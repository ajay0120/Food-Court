import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Package, Shield, Users } from "lucide-react";
import Avatar from "react-avatar";
import axios from "../api/axios";
import AdminShell from "./AdminShell";

const statCards = [
  { key: "users", label: "Users", icon: Users, color: "text-blue-300", bg: "from-blue-500/20 to-blue-700/10" },
  { key: "currentOrders", label: "Current Orders", icon: Package, color: "text-orange-300", bg: "from-orange-500/20 to-red-500/10" },
  { key: "deliveredOrders", label: "Past Orders", icon: CheckCircle2, color: "text-green-300", bg: "from-green-500/20 to-emerald-700/10" },
  { key: "cancelledOrders", label: "Cancelled Orders", icon: AlertCircle, color: "text-red-300", bg: "from-red-500/20 to-red-700/10" },
];

function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    currentOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoadFailed(false);
        const [profileRes, usersRes, currentRes, pastRes, cancelledRes] = await Promise.all([
          axios.get("/users/profile"),
          axios.get("/users", { params: { page: 1, limit: 1 } }),
          axios.get("/orders/currentOrders", { params: { page: 1, limit: 1 } }),
          axios.get("/orders/pastOrders", { params: { page: 1, limit: 1 } }),
          axios.get("/orders/cancelledOrders", { params: { page: 1, limit: 1 } }),
        ]);

        if (!isMounted) {
          return;
        }

        setProfile(profileRes.data);
        setStats({
          users: usersRes.data.pagination?.totalItems || 0,
          currentOrders: currentRes.data.pagination?.totalItems || 0,
          deliveredOrders: pastRes.data.pagination?.totalItems || 0,
          cancelledOrders: cancelledRes.data.pagination?.totalItems || 0,
        });
      } catch (error) {
        if (isMounted) {
          console.error("Failed to load admin profile", error);
          setLoadFailed(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminShell
      title="Admin Profile"
      subtitle="Profile data and order summaries load once when this page opens. If loading fails, the page stops instead of retrying in a loop."
    >
      {loadFailed ? (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-2xl mx-auto text-center border border-red-700">
          <AlertCircle size={46} className="mx-auto mb-4 text-red-400" />
          <h3 className="text-xl font-semibold text-white">Could not load admin profile</h3>
          <p className="mt-2 text-sm text-gray-300">
            Fetching was aborted after the first failure to avoid repeated requests and rate-limit issues.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-gray-800/80 via-gray-700/70 to-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-600/30">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <Avatar
                color={Avatar.getRandomColor("sitebase", ["blue"])}
                name={profile?.username || "Admin"}
                size="90"
                round
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-full bg-orange-500/15 px-4 py-1 text-sm text-orange-300 font-semibold">
                    Admin Access
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white">
                  {loading ? "Loading..." : profile?.name || "Admin"}
                </h3>
                <p className="mt-2 text-gray-300">
                  @{profile?.username || "admin"} | {profile?.email || "Fetching profile"}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Role: {profile?.role || "admin"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.key}
                className={`bg-gradient-to-br ${card.bg} border border-gray-700 rounded-2xl p-6 shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">{card.label}</p>
                    <p className="mt-3 text-3xl font-bold text-white">
                      {loading ? "..." : stats[card.key]}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-900/50 p-3">
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

export default AdminProfile;
