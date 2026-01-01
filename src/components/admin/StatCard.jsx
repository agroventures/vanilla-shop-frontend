import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const StatCard = ({ title, value, icon }) => {
  return (
    <div className="group relative bg-cream rounded-2xl p-6 border border-vanilla-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <span className="text-sm font-medium text-vanilla-600">{title}</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-dark">{value}</h3>
          </div>
        </div>
        <div className="lg:absolute lg:right-1 lg:top-2 xl:static p-3 rounded-xl bg-vanilla-100">
          <div className="text-dark">{icon}</div>
        </div>
      </div>
    </div>
  );
};