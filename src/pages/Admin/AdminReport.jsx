import React, { useEffect, useState, useMemo } from "react";
import { DollarSign, ShoppingBag, TrendingUp, Package, Download, RefreshCcw, ChevronDown } from "lucide-react";
import PageTitle from "../../components/admin/PageTitle";
import { StatCard } from "../../components/admin/StatCard";
import { getOrders } from "../../api/data.api";
import useSEO from "../../hooks/useSEO";

const formatPrice = (price) => `LKR ${new Intl.NumberFormat().format(price || 0)}`;
const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminReport() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useSEO({ title: "Revenue Report - The Vanilla Shop", url: window.location.href });

  const fetchOrders = () => {
    setLoading(true);
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const date = new Date(order.createdAt);
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (dateFrom && date < new Date(dateFrom)) return false;
      if (dateTo && date > new Date(new Date(dateTo).setHours(23, 59, 59, 999))) return false;
      return true;
    });
  }, [orders, statusFilter, dateFrom, dateTo]);

  const totalRevenue = filtered.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalOrders = filtered.length;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
  const totalItems = filtered.reduce((sum, o) => sum + (o.orderItems?.reduce((s, i) => s + i.quantity, 0) || 0), 0);

  const topProducts = useMemo(() => {
    const map = new Map();
    filtered.forEach((order) => {
      order.orderItems?.forEach((item) => {
        const key = item.name;
        const existing = map.get(key);
        if (existing) {
          existing.qty += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          map.set(key, { name: item.name, qty: item.quantity, revenue: item.price * item.quantity });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [filtered]);

  const handleExport = () => {
    const rows = [
      ["Order ID", "Customer", "Status", "Items", "Total", "Date"],
      ...filtered.map((o) => [
        o.orderId,
        `${o.firstName} ${o.lastName}`,
        o.status,
        o.orderItems?.reduce((s, i) => s + i.quantity, 0) || 0,
        o.totalPrice,
        formatDate(o.createdAt),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `revenue-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const clearFilters = () => { setStatusFilter("all"); setDateFrom(""); setDateTo(""); };
  const hasFilters = statusFilter !== "all" || dateFrom || dateTo;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageTitle title="Revenue Report" subtitle="Track your store's financial performance" />
        <div className="flex gap-2">
          <button onClick={fetchOrders} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 border border-vanilla-200 rounded-lg hover:bg-vanilla-50 text-sm bg-white text-vanilla-900">
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-vanilla-900 text-white rounded-lg hover:bg-vanilla-800 text-sm shadow-md">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-vanilla-200 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Date From */}
          <div>
            <label className="block text-xs font-medium text-vanilla-800/70 mb-1">From Date</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2.5 border border-vanilla-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm text-vanilla-900 bg-white" />
          </div>
          {/* Date To */}
          <div>
            <label className="block text-xs font-medium text-vanilla-800/70 mb-1">To Date</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2.5 border border-vanilla-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm text-vanilla-900 bg-white" />
          </div>
          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-vanilla-800/70 mb-1">Order Status</label>
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-vanilla-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 text-sm bg-white text-vanilla-900 appearance-none">
                <option value="all">All Statuses</option>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vanilla-400 pointer-events-none" />
            </div>
          </div>
          {/* Clear */}
          <div className="flex items-end">
            {hasFilters ? (
              <button onClick={clearFilters} className="w-full px-3 py-2.5 text-vanilla-800 border border-vanilla-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                Clear Filters
              </button>
            ) : (
              <div className="w-full px-3 py-2.5 text-vanilla-400 border border-dashed border-vanilla-200 rounded-lg text-sm text-center">
                No filters applied
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={loading ? "..." : formatPrice(totalRevenue)} icon={<DollarSign className="w-6 h-6 text-gold-500" />} />
        <StatCard title="Total Orders" value={loading ? "..." : totalOrders} icon={<ShoppingBag className="w-6 h-6 text-gold-500" />} />
        <StatCard title="Avg. Order Value" value={loading ? "..." : formatPrice(avgOrderValue)} icon={<TrendingUp className="w-6 h-6 text-gold-500" />} />
        <StatCard title="Items Sold" value={loading ? "..." : totalItems} icon={<Package className="w-6 h-6 text-gold-500" />} />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-vanilla-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-vanilla-200">
            <h2 className="text-lg font-bold font-serif text-vanilla-900">Orders</h2>
            <p className="text-sm text-vanilla-800/60 mt-0.5">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-vanilla-400 animate-pulse">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-vanilla-400">No orders found for selected filters</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-vanilla-50 border-b border-vanilla-200">
                  <tr>
                    {["Order ID", "Customer", "Status", "Items", "Total", "Date"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-vanilla-800 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-vanilla-100">
                  {filtered.map((order) => (
                    <tr key={order._id} className="hover:bg-vanilla-50 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-vanilla-900 font-medium">#{order.orderId?.slice(-8)}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-vanilla-900">{order.firstName} {order.lastName}</p>
                        <p className="text-xs text-vanilla-800/50 truncate max-w-36">{order.email}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border
                          ${order.status === "delivered" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                            order.status === "shipped" ? "bg-purple-50 text-purple-800 border-purple-200" :
                            order.status === "processing" ? "bg-blue-50 text-blue-800 border-blue-200" :
                            order.status === "cancelled" ? "bg-red-50 text-red-800 border-red-200" :
                            "bg-amber-50 text-amber-800 border-amber-200"}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-vanilla-800">
                        {order.orderItems?.reduce((s, i) => s + i.quantity, 0) || 0}
                      </td>
                      <td className="px-5 py-3 font-bold text-vanilla-900">{formatPrice(order.totalPrice)}</td>
                      <td className="px-5 py-3 text-xs text-vanilla-800/60">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-vanilla-50 border-t-2 border-vanilla-200">
                  <tr>
                    <td colSpan={4} className="px-5 py-3 font-bold text-vanilla-900 text-sm">Total</td>
                    <td className="px-5 py-3 font-bold text-gold-500 text-sm">{formatPrice(totalRevenue)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-vanilla-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-vanilla-200">
            <h2 className="text-lg font-bold font-serif text-vanilla-900">Top Products</h2>
            <p className="text-sm text-vanilla-800/60 mt-0.5">By revenue in selected period</p>
          </div>
          <div className="p-4 space-y-2">
            {loading ? (
              <div className="py-10 text-center text-vanilla-400 animate-pulse">Loading...</div>
            ) : topProducts.length === 0 ? (
              <div className="py-10 text-center text-vanilla-400 italic">No data available</div>
            ) : (
              topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-vanilla-50 border border-transparent hover:border-vanilla-200 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-vanilla-100 flex items-center justify-center text-xs font-bold text-vanilla-600 shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-vanilla-900 truncate text-sm">{p.name}</p>
                    <p className="text-xs text-vanilla-800/50">{p.qty} units sold</p>
                  </div>
                  <p className="font-bold text-vanilla-900 text-sm shrink-0">{formatPrice(p.revenue)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
