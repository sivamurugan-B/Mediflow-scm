import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendType = "neutral", // "up", "down", "neutral"
  theme = "blue" // "blue", "teal", "amber", "rose", "emerald", "purple"
}) {
  const themeStyles = {
    blue: {
      bg: "bg-blue-50/70",
      border: "border-blue-100 hover:border-blue-300",
      text: "text-blue-900",
      iconBg: "bg-blue-600 text-white",
      glow: "hover:shadow-blue-500/10"
    },
    teal: {
      bg: "bg-teal-50/70",
      border: "border-teal-100 hover:border-teal-300",
      text: "text-teal-900",
      iconBg: "bg-teal-600 text-white",
      glow: "hover:shadow-teal-500/10"
    },
    emerald: {
      bg: "bg-emerald-50/70",
      border: "border-emerald-100 hover:border-emerald-300",
      text: "text-emerald-900",
      iconBg: "bg-emerald-600 text-white",
      glow: "hover:shadow-emerald-500/10"
    },
    amber: {
      bg: "bg-amber-50/70",
      border: "border-amber-100 hover:border-amber-300",
      text: "text-amber-900",
      iconBg: "bg-amber-500 text-white",
      glow: "hover:shadow-amber-500/10"
    },
    rose: {
      bg: "bg-rose-50/70",
      border: "border-rose-100 hover:border-rose-300",
      text: "text-rose-900",
      iconBg: "bg-rose-600 text-white",
      glow: "hover:shadow-rose-500/10"
    },
    purple: {
      bg: "bg-purple-50/70",
      border: "border-purple-100 hover:border-purple-300",
      text: "text-purple-900",
      iconBg: "bg-purple-600 text-white",
      glow: "hover:shadow-purple-500/10"
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.blue;

  return (
    <div className={`p-5 rounded-2xl bg-white border ${currentTheme.border} shadow-sm hover:shadow-lg ${currentTheme.glow} transition-all duration-200 flex flex-col justify-between`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${currentTheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-slate-500 font-medium truncate">
              {subtitle}
            </span>
          )}

          {trend && (
            <span className={`inline-flex items-center gap-0.5 font-bold ${
              trendType === "up" ? "text-emerald-600" : trendType === "down" ? "text-rose-600" : "text-slate-500"
            }`}>
              {trendType === "up" && <ArrowUpRight className="w-3.5 h-3.5" />}
              {trendType === "down" && <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
