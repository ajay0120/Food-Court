import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Package,
  Search,
  ShoppingBag,
  Slash,
  Truck,
  UserCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import AdminShell from "./AdminShell";
import axios from "../api/axios";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "../../../common/orderEnums";

const tabs = {
  current: {
    label: "Current Orders",
    endpoint: "/orders/currentOrders",
    icon: Clock3,
    statuses: ["", ORDER_STATUSES.PLACED, ORDER_STATUSES.PREPARING],
  },
  past: {
    label: "Past Orders",
    endpoint: "/orders/pastOrders",
    icon: CheckCircle2,
    statuses: ["", ORDER_STATUSES.DELIVERED],
  },
  cancelled: {
    label: "Cancelled Orders",
    endpoint: "/orders/cancelledOrders",
    icon: Slash,
    statuses: ["", ORDER_STATUSES.CANCELLED],
  },
};

const createFilters = () => ({
  search: "",
  userId: "",
  fromDate: "",
  toDate: "",
  status: "",
  paymentStatus: "",
  minAmount: "",
  maxAmount: "",
});

const createSectionState = () => ({
  draft: createFilters(),
  applied: createFilters(),
  orders: [],
  loading: true,
  loadFailed: false,
  cache: {},
  pagination: { page: 1, totalPages: 1, hasNext: false, hasPrev: false, totalItems: 0 },
});

const formatDate = (value) =>
  value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(
    Number(value || 0)
  );

const getStatusAppearance = (status) => {
  if (status === ORDER_STATUSES.DELIVERED) {
    return {
      icon: CheckCircle2,
      pillClass: "bg-green-500/20 text-green-400",
      titleClass: "text-orange-400",
      borderClass: "border-gray-700",
      titlePrefix: "Order",
    };
  }

  if (status === ORDER_STATUSES.CANCELLED) {
    return {
      icon: XCircle,
      pillClass: "bg-red-500/20 text-red-400",
      titleClass: "text-red-400",
      borderClass: "border-red-600",
      titlePrefix: "Cancelled Order",
    };
  }

  if (status === ORDER_STATUSES.PREPARING) {
    return {
      icon: Truck,
      pillClass: "bg-yellow-500/20 text-yellow-300",
      titleClass: "text-orange-400",
      borderClass: "border-gray-700",
      titlePrefix: "Order",
    };
  }

  return {
    icon: Clock3,
    pillClass: "bg-orange-500/20 text-orange-400",
    titleClass: "text-orange-400",
    borderClass: "border-gray-700",
    titlePrefix: "Order",
  };
};

function AdminOrders() {
  const [activeTab, setActiveTab] = useState("current");
  const [reloadToken, setReloadToken] = useState(0);
  const [sections, setSections] = useState({
    current: createSectionState(),
    past: createSectionState(),
    cancelled: createSectionState(),
  });

  const activeSection = sections[activeTab];
  const appliedFilters = activeSection.applied;
  const currentPage = activeSection.pagination.page;
  const activeCacheKey = useMemo(
    () => JSON.stringify({ filters: appliedFilters, page: currentPage }),
    [appliedFilters, currentPage]
  );
  const cachedEntry = activeSection.cache[activeCacheKey];

  useEffect(() => {
    let cancelled = false;

    const loadTabCounts = async () => {
      try {
        const [currentRes, pastRes, cancelledRes] = await Promise.all([
          axios.get(tabs.current.endpoint, { params: { page: 1, limit: 1 } }),
          axios.get(tabs.past.endpoint, { params: { page: 1, limit: 1 } }),
          axios.get(tabs.cancelled.endpoint, { params: { page: 1, limit: 1 } }),
        ]);

        if (cancelled) {
          return;
        }

        setSections((prev) => ({
          current: {
            ...prev.current,
            pagination: {
              ...prev.current.pagination,
              ...(currentRes.data.pagination || {}),
              page: prev.current.pagination.page,
            },
          },
          past: {
            ...prev.past,
            pagination: {
              ...prev.past.pagination,
              ...(pastRes.data.pagination || {}),
              page: prev.past.pagination.page,
            },
          },
          cancelled: {
            ...prev.cancelled,
            pagination: {
              ...prev.cancelled.pagination,
              ...(cancelledRes.data.pagination || {}),
              page: prev.cancelled.pagination.page,
            },
          },
        }));
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load admin order counts", error);
        }
      }
    };

    loadTabCounts();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      if (cachedEntry) {
        setSections((prev) => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            orders: cachedEntry.orders,
            loading: false,
            loadFailed: false,
            pagination: { ...prev[activeTab].pagination, ...(cachedEntry.pagination || {}) },
          },
        }));
        return;
      }

      try {
        setSections((prev) => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            loading: true,
            loadFailed: false,
          },
        }));

        const { data } = await axios.get(tabs[activeTab].endpoint, {
          params: {
            ...appliedFilters,
            page: currentPage,
            limit: 10,
          },
        });

        if (cancelled) {
          return;
        }

        setSections((prev) => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            orders: data.orders || [],
            loading: false,
            loadFailed: false,
            cache: {
              ...prev[activeTab].cache,
              [activeCacheKey]: {
                orders: data.orders || [],
                pagination: data.pagination || {},
              },
            },
            pagination: { ...prev[activeTab].pagination, ...(data.pagination || {}) },
          },
        }));
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(`Failed to fetch ${activeTab} orders`, error);
        setSections((prev) => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            loading: false,
            loadFailed: true,
          },
        }));
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [activeTab, activeCacheKey, appliedFilters, cachedEntry, currentPage, reloadToken]);

  const totalOrders = useMemo(
    () =>
      sections.current.pagination.totalItems +
      sections.past.pagination.totalItems +
      sections.cancelled.pagination.totalItems,
    [sections]
  );

  const updateDraftField = (key, value) => {
    setSections((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        draft: {
          ...prev[activeTab].draft,
          [key]: value,
        },
      },
    }));
  };

  const applyFilters = () => {
    setSections((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        applied: { ...prev[activeTab].draft },
        pagination: { ...prev[activeTab].pagination, page: 1 },
      },
    }));
  };

  const resetFilters = () => {
    const empty = createFilters();
    setSections((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        draft: empty,
        applied: empty,
        pagination: { ...prev[activeTab].pagination, page: 1 },
      },
    }));
  };

  const updatePage = (nextPage) => {
    setSections((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        pagination: { ...prev[activeTab].pagination, page: nextPage },
      },
    }));
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`/orders/${orderId}/deliver`, { status });
      setSections((prev) => ({
        current: {
          ...prev.current,
          cache: {},
        },
        past: {
          ...prev.past,
          cache: {},
        },
        cancelled: {
          ...prev.cancelled,
          cache: {},
        },
      }));
      setReloadToken((value) => value + 1);
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  const renderAdminActions = (order) => {
    if (activeTab !== "current") {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-3">
        {order.status !== ORDER_STATUSES.PREPARING && order.status !== ORDER_STATUSES.DELIVERED ? (
          <button
            onClick={() => handleStatusUpdate(order._id, ORDER_STATUSES.PREPARING)}
            className="rounded-xl border border-yellow-600/40 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-200 transition hover:bg-yellow-500/20"
          >
            Mark Preparing
          </button>
        ) : null}

        {order.status !== ORDER_STATUSES.DELIVERED ? (
          <button
            onClick={() => handleStatusUpdate(order._id, ORDER_STATUSES.DELIVERED)}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <Truck size={16} />
            Mark Delivered
          </button>
        ) : null}

        {order.status !== ORDER_STATUSES.CANCELLED ? (
          <button
            onClick={() => handleStatusUpdate(order._id, ORDER_STATUSES.CANCELLED)}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Cancel Order
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <AdminShell
      title="Admin Orders"
      subtitle="Orders load once when a section opens. Filters are applied manually so the page does not continuously refetch and trip rate limits."
    >
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3">
          {Object.entries(tabs).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = key === activeTab;

            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/60"
                }`}
              >
                <Icon size={18} />
                <span>{config.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">
                  {sections[key].pagination.totalItems || 0}
                </span>
              </button>
            );
          })}

          <div className="ml-auto px-4 py-3 rounded-xl bg-gray-800/60 border border-gray-700 text-sm text-gray-300">
            Total tracked orders: {totalOrders}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
          <section className="rounded-2xl bg-gray-900/70 border border-gray-700 p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-2">{tabs[activeTab].label} Filters</h3>
            <p className="text-sm text-gray-400 mb-5">
              Edit filters freely. Nothing refetches until you press Apply Filters. Click Apply filters to see the effect of your changes. Reset will clear all filters and show all orders in this section.
            </p>

            <div className="flex flex-wrap gap-3 justify-end">
              <button onClick={applyFilters} className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400">
                Apply Filters
              </button>
              <button onClick={resetFilters} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                Reset
              </button>
            </div> 
            
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-gray-300">Search</span>
                <div className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800/70 px-3">
                  <Search size={16} className="text-gray-400" />
                  <input
                    value={activeSection.draft.search}
                    onChange={(event) => updateDraftField("search", event.target.value)}
                    className="w-full bg-transparent py-3 outline-none text-white"
                    placeholder="Username or order id"
                  />
                </div>
              </label>

              <label className="space-y-2 text-sm">
                <span className="text-gray-300">User Id</span>
                <input
                  value={activeSection.draft.userId}
                  onChange={(event) => updateDraftField("userId", event.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/70 px-3 py-3 outline-none text-white"
                  placeholder="Exact Mongo id"
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="text-gray-300">From Date</span>
                <input
                  type="date"
                  value={activeSection.draft.fromDate}
                  onChange={(event) => updateDraftField("fromDate", event.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/70 px-3 py-3 outline-none text-white"
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="text-gray-300">To Date</span>
                <input
                  type="date"
                  value={activeSection.draft.toDate}
                  onChange={(event) => updateDraftField("toDate", event.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/70 px-3 py-3 outline-none text-white"
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="text-gray-300">Status</span>
                <select
                  value={activeSection.draft.status}
                  onChange={(event) => updateDraftField("status", event.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/70 px-3 py-3 outline-none text-white"
                >
                  {tabs[activeTab].statuses.map((status) => (
                    <option key={status || "all"} value={status}>
                      {status || "All statuses"}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="text-gray-300">Payment Status</span>
                <select
                  value={activeSection.draft.paymentStatus}
                  onChange={(event) => updateDraftField("paymentStatus", event.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/70 px-3 py-3 outline-none text-white"
                >
                  <option value="">All payments</option>
                  <option value={PAYMENT_STATUSES.PAID}>Paid</option>
                  <option value={PAYMENT_STATUSES.UNPAID}>Unpaid</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="text-gray-300">Min Amount</span>
                <input
                  type="number"
                  value={activeSection.draft.minAmount}
                  onChange={(event) => updateDraftField("minAmount", event.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/70 px-3 py-3 outline-none text-white"
                  placeholder="0"
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="text-gray-300">Max Amount</span>
                <input
                  type="number"
                  value={activeSection.draft.maxAmount}
                  onChange={(event) => updateDraftField("maxAmount", event.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/70 px-3 py-3 outline-none text-white"
                  placeholder="1000"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-gray-900/70 border border-gray-700 shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{tabs[activeTab].label}</h3>
                <p className="text-sm text-gray-400">
                  Page {activeSection.pagination.page || 1} of {activeSection.pagination.totalPages || 1}
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-gray-800 text-sm text-gray-300">
                {activeSection.pagination.totalItems || 0} total
              </div>
            </div>

            <div className="p-6 space-y-4">
              {activeSection.loadFailed && activeSection.orders.length > 0 ? (
                <div className="rounded-xl bg-red-950/30 border border-red-700 px-5 py-4 text-center text-red-200">
                  Could&apos;nt refresh this section, so the last loaded orders are still being shown.
                </div>
              ) : null}

              {activeSection.loading ? (
                <div className="rounded-xl bg-gray-800/70 border border-gray-700 px-5 py-10 text-center text-gray-300">
                  Loading orders...
                </div>
              ) : activeSection.loadFailed && activeSection.orders.length === 0 ? (
                <div className="rounded-xl bg-red-950/30 border border-red-700 px-5 py-10 text-center text-red-200">
                  Could&apos;nt load orders. Please try again later.
                </div>
              ) : activeSection.orders.length === 0 ? (
                <div className="rounded-xl bg-gray-800/70 border border-gray-700 px-5 py-10 text-center text-gray-300">
                  No orders matched this section.
                </div>
              ) : (
                activeSection.orders.map((order, index) => {
                  const appearance = getStatusAppearance(order.status);
                  const StatusIcon = appearance.icon;
                  const orderNumber = ((activeSection.pagination.page || 1) - 1) * 10 + index + 1;

                  return (
                    <article
                      key={order._id}
                      className={`bg-gray-900 p-6 rounded-xl shadow-lg text-white border ${appearance.borderClass} space-y-4`}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-3">
                          <Package className={appearance.titleClass} size={20} />
                          <div>
                            <h4 className={`text-lg font-semibold ${appearance.titleClass}`}>
                              {appearance.titlePrefix} #{orderNumber}
                            </h4>
                            <p className="text-xs text-gray-500 break-all">ID: {order._id}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-300">
                              <UserCircle2 size={15} className="text-blue-400" />
                              <span>
                                {order.user?.name || "Unknown user"} {order.user?.username ? `(@${order.user.username})` : ""}
                              </span>
                              <span className="text-gray-500">|</span>
                              <span>{order.user?.email || "No email"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar size={14} />
                          <span className="text-sm italic">{formatDate(order.createdAt)}</span>
                        </div>
                      </div>

                      <div className="space-y-2 divide-y divide-gray-800">
                        {order.items?.map((item, itemIndex) => (
                          <div key={`${order._id}-${itemIndex}`} className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="text-orange-400" size={16} />
                              <div>
                                <p className="text-white font-medium">{item.product?.name || "Item not found"}</p>
                                <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="text-orange-400 font-semibold">
                              {formatCurrency(item.product?.price?.org || 0)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CreditCard className="text-blue-400" size={16} />
                            <span className="text-sm text-gray-400">
                              {order.paymentMethod} | {order.paymentStatus || "Unknown payment"}
                            </span>
                          </div>

                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${appearance.pillClass}`}
                          >
                            <StatusIcon size={14} />
                            <span>Status: {order.status}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-3 lg:items-end">
                          <p className={`text-2xl font-bold ${appearance.titleClass}`}>
                            Total: {formatCurrency(order.total)}
                          </p>
                          {renderAdminActions(order)}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <div className="px-6 py-5 border-t border-gray-700 flex items-center justify-between">
              <button
                disabled={!activeSection.pagination.hasPrev}
                onClick={() => updatePage(Math.max(1, (activeSection.pagination.page || 1) - 1))}
                className="px-4 py-2 rounded-xl bg-gray-800 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={!activeSection.pagination.hasNext}
                onClick={() => updatePage((activeSection.pagination.page || 1) + 1)}
                className="px-4 py-2 rounded-xl bg-orange-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}

export default AdminOrders;
