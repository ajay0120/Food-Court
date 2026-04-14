import React, { useEffect, useMemo, useState } from "react";
import { Search, UserRoundSearch, X } from "lucide-react";
import AdminShell from "./AdminShell";
import axios from "../api/axios";

const emptyFilters = {
  search: "",
  userId: "",
  fromDate: "",
  toDate: "",
  role: "",
  activity: "",
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-";

function AdminUsers() {
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, hasNext: false, hasPrev: false, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/users", {
          params: { ...applied, page: pagination.page, limit: 10 },
        });
        setUsers(data.users || []);
        setPagination((prev) => ({ ...prev, ...(data.pagination || {}) }));
      } catch (error) {
        console.error("Failed to fetch users", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [applied, pagination.page]);

  useEffect(() => {
    if (!selectedUserId) {
      setSelectedUser(null);
      return;
    }

    const loadUser = async () => {
      try {
        setDrawerLoading(true);
        const { data } = await axios.get(`/users/${selectedUserId}`);
        setSelectedUser(data);
      } catch (error) {
        console.error("Failed to fetch user detail", error);
      } finally {
        setDrawerLoading(false);
      }
    };

    loadUser();
  }, [selectedUserId]);

  const activeFilterCount = useMemo(() => Object.values(applied).filter(Boolean).length, [applied]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setApplied(filters);
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
    setApplied(emptyFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <AdminShell
      title="Users"
      subtitle="Search by username, filter by exact user id or creation dates, and open the full user record in the drawer."
      // actions={
      //   <>
      //     <button onClick={applyFilters} className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-orange-400">
      //       Apply Filters
      //     </button>
      //     <button onClick={resetFilters} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
      //       Reset
      //     </button>
      //   </>
      // }
    >
      <div className="space-y-6">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <p className="text-sm text-slate-300">{activeFilterCount} active filter{activeFilterCount === 1 ? "" : "s"}</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-end">
                <button onClick={applyFilters} className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400">
                  Apply Filters
                </button>
                <button onClick={resetFilters} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                  Reset
                </button>
              </div>
            </div>

            

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="space-y-2 text-sm">
                <span className="text-slate-200">Username Search</span>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} className="w-full bg-transparent py-3 outline-none" placeholder="Partial username" />
                </div>
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-200">User Id</span>
                <input value={filters.userId} onChange={(event) => updateFilter("userId", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3 outline-none" placeholder="Exact Mongo id" />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-200">Role</span>
                <select value={filters.role} onChange={(event) => updateFilter("role", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3 outline-none">
                  <option value="">All roles</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-200">Created From</span>
                <input type="date" value={filters.fromDate} onChange={(event) => updateFilter("fromDate", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3 outline-none" />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-200">Created To</span>
                <input type="date" value={filters.toDate} onChange={(event) => updateFilter("toDate", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3 outline-none" />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-200">Order Activity</span>
                <select value={filters.activity} onChange={(event) => updateFilter("activity", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3 outline-none">
                  <option value="">All users</option>
                  <option value="withOrders">With orders</option>
                  <option value="withoutOrders">Without orders</option>
                </select>
              </label>
            </div>
          </section>

          <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-white">User Directory</h3>
                <p className="text-sm text-slate-300">Default load returns paginated users.</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                {pagination.totalItems || 0} total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Username</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Orders</th>
                    <th className="px-5 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-300">Loading users...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-300">No users matched the current filters.</td></tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} onClick={() => setSelectedUserId(user._id)} className="cursor-pointer border-t border-white/5 transition hover:bg-orange-500/10">
                        <td className="px-5 py-4 font-semibold text-white">{user.name}</td>
                        <td className="px-5 py-4 text-slate-200">@{user.username}</td>
                        <td className="px-5 py-4 text-slate-300">{user.email}</td>
                        <td className="px-5 py-4 text-slate-200">{user.role}</td>
                        <td className="px-5 py-4 text-slate-200">{user.totalOrders}</td>
                        <td className="px-5 py-4 text-slate-300">{formatDate(user.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
              <p className="text-sm text-slate-300">Page {pagination.page || 1} of {pagination.totalPages || 1}</p>
              <div className="flex gap-3">
                <button disabled={!pagination.hasPrev} onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">
                  Previous
                </button>
                <button disabled={!pagination.hasNext} onClick={() => setPagination((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))} className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>

        {!selectedUserId ? (
          <div className="hidden" aria-hidden="true">
            <UserRoundSearch />
          </div>
        ) : null}
      </div>

      {selectedUserId ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/55 backdrop-blur-[2px]">
          <button
            type="button"
            aria-label="Close preview"
            className="absolute inset-0"
            onClick={() => setSelectedUserId(null)}
          />

          <aside className="relative z-50 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-slate-950/95 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">User Detail</h3>
                <p className="text-sm text-slate-300">Preview opens over the page and collapses when closed.</p>
              </div>
              <button onClick={() => setSelectedUserId(null)} className="rounded-2xl bg-white/10 p-2 text-slate-200 transition hover:bg-white/15">
                <X className="h-4 w-4" />
              </button>
            </div>

            {drawerLoading || !selectedUser ? (
              <div className="flex min-h-80 items-center justify-center rounded-[24px] border border-white/10 bg-white/5 text-slate-300">
                Loading user detail...
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">Profile</p>
                  <h4 className="mt-2 text-xl font-bold text-white">{selectedUser.user.name}</h4>
                  <p className="mt-1 text-sm text-slate-300">@{selectedUser.user.username} | {selectedUser.user.email}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-200">
                    <div>Role: {selectedUser.user.role}</div>
                    <div>Created: {formatDate(selectedUser.user.createdAt)}</div>
                    <div>Verified: {selectedUser.user.metadata?.verified ? "Yes" : "No"}</div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <h5 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Metadata</h5>
                  <div className="mt-3 space-y-2 text-sm text-slate-200">
                    <div>Google Id: {selectedUser.user.metadata?.googleId || "N/A"}</div>
                    <div>Cart Items: {selectedUser.user.metadata?.cartItemsCount || 0}</div>
                    <div>Favourites: {selectedUser.user.metadata?.favouritesCount || 0}</div>
                    <div>OTP Tries: {selectedUser.user.metadata?.otpTries || 0}</div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <h5 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Cart</h5>
                  <div className="mt-3 space-y-3 text-sm text-slate-200">
                    {selectedUser.user.cart?.length ? selectedUser.user.cart.map((item, index) => (
                      <div key={`${item.product?._id || index}-${index}`} className="rounded-2xl bg-white/5 p-3">
                        <div className="font-semibold text-white">{item.product?.name || "Unknown item"}</div>
                        <div className="mt-1 text-slate-300">Quantity: {item.quantity}</div>
                      </div>
                    )) : <p className="text-slate-300">No cart items stored.</p>}
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <h5 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Orders</h5>
                  <div className="mt-3 space-y-3 text-sm text-slate-200">
                    {selectedUser.orders?.length ? selectedUser.orders.map((order) => (
                      <div key={order._id} className="rounded-2xl bg-white/5 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-white">{order._id}</span>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{order.status}</span>
                        </div>
                        <div className="mt-2 text-slate-300">{order.items?.length || 0} items | {formatDate(order.createdAt)}</div>
                      </div>
                    )) : <p className="text-slate-300">No orders found.</p>}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      ) : null}
    </AdminShell>
  );
}

export default AdminUsers;
