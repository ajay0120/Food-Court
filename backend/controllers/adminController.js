import mongoose from "mongoose";
import User from "../models/User.js";
import Order from "../models/order.js";
import {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
} from "../../common/orderEnums.js";
import { USER_ROLES } from "../../common/userEnums.js";
import {
  buildValidationError,
  validateObjectId,
} from "../utils/validation.js";

const CURRENT_ORDER_STATUSES = [ORDER_STATUSES.PLACED, ORDER_STATUSES.PREPARING];
const PAST_ORDER_STATUSES = [ORDER_STATUSES.DELIVERED];
const CANCELLED_ORDER_STATUSES = [ORDER_STATUSES.CANCELLED];

const getPaginationParams = (req) => {
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  if (limit > 100) limit = 100;

  return { page, limit };
};

const buildPagination = ({ total, page, limit }) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    totalItems: total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

const normalizeDateRange = (fromDate, toDate) => {
  const range = {};

  if (fromDate) {
    const parsed = new Date(fromDate);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error("Invalid fromDate");
    }
    parsed.setHours(0, 0, 0, 0);
    range.$gte = parsed;
  }

  if (toDate) {
    const parsed = new Date(toDate);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error("Invalid toDate");
    }
    parsed.setHours(23, 59, 59, 999);
    range.$lte = parsed;
  }

  return Object.keys(range).length ? range : null;
};

const getOrderSectionStatuses = (section) => {
  if (section === "current") return CURRENT_ORDER_STATUSES;
  if (section === "past") return PAST_ORDER_STATUSES;
  if (section === "cancelled") return CANCELLED_ORDER_STATUSES;
  return null;
};

const buildUserFilters = (query) => {
  const filters = {};
  const {
    search,
    userId,
    fromDate,
    toDate,
    role,
    activity,
  } = query;

  if (search?.trim()) {
    filters.username = { $regex: search.trim(), $options: "i" };
  }

  if (userId) {
    if (!validateObjectId(userId)) {
      throw new Error("Invalid userId");
    }
    filters._id = userId;
  }

  if (role) {
    if (!Object.values(USER_ROLES).includes(role)) {
      throw new Error("Invalid role");
    }
    filters.role = role;
  }

  const createdAt = normalizeDateRange(fromDate, toDate);
  if (createdAt) {
    filters.createdAt = createdAt;
  }

  return { filters, activity };
};

const getPaymentStatusConditions = (paymentStatus) => {
  if (paymentStatus === PAYMENT_STATUSES.PAID) {
    return [
      { paymentStatus: PAYMENT_STATUSES.PAID },
      {
        paymentStatus: { $exists: false },
        paymentMethod: { $in: [PAYMENT_METHODS.CARD, PAYMENT_METHODS.UPI] },
      },
    ];
  }

  if (paymentStatus === PAYMENT_STATUSES.UNPAID) {
    return [
      { paymentStatus: PAYMENT_STATUSES.UNPAID },
      {
        paymentStatus: { $exists: false },
        paymentMethod: PAYMENT_METHODS.CASH,
      },
    ];
  }

  return null;
};

const buildOrderFilters = (query) => {
  const filters = {};
  const {
    section,
    status,
    userId,
    search,
    fromDate,
    toDate,
    paymentStatus,
    minAmount,
    maxAmount,
  } = query;

  const sectionStatuses = getOrderSectionStatuses(section);
  if (section && !sectionStatuses) {
    throw new Error("Invalid section");
  }

  if (status) {
    if (!Object.values(ORDER_STATUSES).includes(status)) {
      throw new Error("Invalid status");
    }
    filters.status = status;
  } else if (sectionStatuses) {
    filters.status = { $in: sectionStatuses };
  }

  if (userId) {
    if (!validateObjectId(userId)) {
      throw new Error("Invalid userId");
    }
    filters.user = new mongoose.Types.ObjectId(userId);
  }

  const createdAt = normalizeDateRange(fromDate, toDate);
  if (createdAt) {
    filters.createdAt = createdAt;
  }

  const totalRange = {};
  if (minAmount !== undefined && minAmount !== "") {
    const parsedMin = Number(minAmount);
    if (Number.isNaN(parsedMin)) {
      throw new Error("Invalid minAmount");
    }
    totalRange.$gte = parsedMin;
  }
  if (maxAmount !== undefined && maxAmount !== "") {
    const parsedMax = Number(maxAmount);
    if (Number.isNaN(parsedMax)) {
      throw new Error("Invalid maxAmount");
    }
    totalRange.$lte = parsedMax;
  }
  if (Object.keys(totalRange).length) {
    filters.total = totalRange;
  }

  if (paymentStatus) {
    if (!Object.values(PAYMENT_STATUSES).includes(paymentStatus)) {
      throw new Error("Invalid paymentStatus");
    }
    filters.$or = getPaymentStatusConditions(paymentStatus);
  }

  return { filters, search: search?.trim() };
};

const getAdminSummary = async (req, res) => {
  const [userCount, orderCount, currentOrders, deliveredOrders, cancelledOrders] =
    await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: CURRENT_ORDER_STATUSES } }),
      Order.countDocuments({ status: ORDER_STATUSES.DELIVERED }),
      Order.countDocuments({ status: ORDER_STATUSES.CANCELLED }),
    ]);

  return res.status(200).json({
    admin: req.user,
    stats: {
      userCount,
      orderCount,
      currentOrders,
      deliveredOrders,
      cancelledOrders,
    },
  });
};

const getAdminUsers = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req);
    const { filters, activity } = buildUserFilters(req.query);

    let matchedUserIds = null;
    if (activity === "withOrders" || activity === "withoutOrders") {
      const usersWithOrders = await Order.distinct("user");
      matchedUserIds = usersWithOrders.map((id) => id.toString());
      filters._id = {
        ...(filters._id ? { $eq: filters._id } : {}),
        [activity === "withOrders" ? "$in" : "$nin"]: matchedUserIds,
      };
    } else if (activity) {
      return res.status(400).json(buildValidationError("Invalid activity filter"));
    }

    const [total, users] = await Promise.all([
      User.countDocuments(filters),
      User.find(filters)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const userIds = users.map((user) => user._id);
    const orderCounts = await Order.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: "$user", totalOrders: { $sum: 1 } } },
    ]);
    const orderCountMap = new Map(
      orderCounts.map((entry) => [entry._id.toString(), entry.totalOrders])
    );

    return res.status(200).json({
      users: users.map((user) => ({
        ...user,
        totalOrders: orderCountMap.get(user._id.toString()) || 0,
      })),
      pagination: buildPagination({ total, page, limit }),
    });
  } catch (error) {
    return res.status(400).json(buildValidationError(error.message));
  }
};

const getAdminUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id)) {
      return res.status(400).json(buildValidationError("Invalid user id"));
    }

    const user = await User.findById(id)
      .select("-password")
      .populate({ path: "cart.product", select: "name img price category" })
      .populate({ path: "favourites", select: "name img price category" })
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({ user: id })
      .populate({ path: "items.product", select: "name img price category" })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      user: {
        ...user,
        metadata: {
          googleId: user.googleId || null,
          profilePicture: user.profilePicture || null,
          img: user.img || null,
          verified: user.verified,
          otpTries: user.otpTries,
          favouritesCount: user.favourites?.length || 0,
          cartItemsCount: user.cart?.length || 0,
        },
      },
      orders,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user details" });
  }
};

const getAdminOrders = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req);
    const { filters, search } = buildOrderFilters(req.query);

    const finalFilter = { ...filters };
    if (search) {
      const searchConditions = [];

      if (validateObjectId(search)) {
        searchConditions.push({ _id: search });
      }

      const matchedUsers = await User.find({
        username: { $regex: search, $options: "i" },
      })
        .select("_id")
        .lean();

      if (matchedUsers.length) {
        searchConditions.push({
          user: { $in: matchedUsers.map((user) => user._id) },
        });
      }

      if (!searchConditions.length) {
        return res.status(200).json({
          orders: [],
          pagination: buildPagination({ total: 0, page, limit }),
        });
      }

      finalFilter.$and = [...(finalFilter.$and || []), { $or: searchConditions }];
    }

    const [total, orders] = await Promise.all([
      Order.countDocuments(finalFilter),
      Order.find(finalFilter)
        .populate({ path: "user", select: "name username email role createdAt" })
        .populate({ path: "items.product", select: "name img price category" })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return res.status(200).json({
      orders: orders.map((order) => ({
        ...order,
        section: CANCELLED_ORDER_STATUSES.includes(order.status)
          ? "cancelled"
          : PAST_ORDER_STATUSES.includes(order.status)
            ? "past"
            : "current",
        paymentStatus:
          order.paymentStatus ||
          (order.paymentMethod === PAYMENT_METHODS.CASH
            ? PAYMENT_STATUSES.UNPAID
            : PAYMENT_STATUSES.PAID),
      })),
      pagination: buildPagination({ total, page, limit }),
    });
  } catch (error) {
    return res.status(400).json(buildValidationError(error.message));
  }
};

const updateAdminOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    if (!validateObjectId(id)) {
      return res.status(400).json(buildValidationError("Invalid order id"));
    }

    const update = {};
    if (status !== undefined) {
      if (!Object.values(ORDER_STATUSES).includes(status)) {
        return res.status(400).json(buildValidationError("Invalid status"));
      }
      if(status === ORDER_STATUSES.DELIVERED){
        update.paymentStatus = PAYMENT_STATUSES.PAID;
      }
      update.status = status;
    }

    if (paymentStatus !== undefined) {
      if (!Object.values(PAYMENT_STATUSES).includes(paymentStatus)) {
        return res.status(400).json(buildValidationError("Invalid paymentStatus"));
      }
      if(update.paymentStatus === PAYMENT_STATUSES.PAID){
        update.paymentStatus = PAYMENT_STATUSES.PAID;
      }
      else {
        update.paymentStatus = paymentStatus;
      }
    }

    if (!Object.keys(update).length) {
      return res
        .status(400)
        .json(buildValidationError("At least one field is required"));
    }

    const order = await Order.findByIdAndUpdate(id, { $set: update }, { new: true })
      .populate({ path: "user", select: "name username email role createdAt" })
      .populate({ path: "items.product", select: "name img price category" });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order" });
  }
};

export {
  getAdminSummary,
  getAdminUsers,
  getAdminUserDetail,
  getAdminOrders,
  updateAdminOrderStatus,
};
