import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  AlertTriangle, 
  Check, 
  XCircle, 
  RotateCw,
  ShieldCheck,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function StatusBadge({ status, size = "md", showIcon = true }) {
  if (!status) return null;

  const normalized = status.toString().trim().toLowerCase();

  let config = {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    icon: Clock,
    dot: "bg-slate-400"
  };

  if (normalized.includes('delivered') || normalized.includes('completed') || normalized.includes('received')) {
    config = {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: CheckCircle2,
      dot: "bg-emerald-500"
    };
  } else if (normalized.includes('delayed')) {
    config = {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: AlertTriangle,
      dot: "bg-rose-500"
    };
  } else if (normalized.includes('in transit') || normalized.includes('dispatched')) {
    config = {
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
      icon: Truck,
      dot: "bg-sky-500"
    };
  } else if (normalized.includes('out for delivery')) {
    config = {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
      icon: MapPin,
      dot: "bg-indigo-500"
    };
  } else if (normalized.includes('processing') || normalized.includes('quality check') || normalized.includes('technician assigned') || normalized.includes('in progress')) {
    config = {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: RotateCw,
      dot: "bg-amber-500"
    };
  } else if (normalized.includes('confirmed') || normalized.includes('approved')) {
    config = {
      bg: "bg-teal-50",
      text: "text-teal-700",
      border: "border-teal-200",
      icon: ShieldCheck,
      dot: "bg-teal-500"
    };
  } else if (normalized.includes('packed')) {
    config = {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: Package,
      dot: "bg-blue-500"
    };
  } else if (normalized.includes('new') || normalized.includes('requested')) {
    config = {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      icon: Sparkles,
      dot: "bg-purple-500"
    };
  } else if (normalized.includes('low stock')) {
    config = {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-300",
      icon: AlertTriangle,
      dot: "bg-amber-600"
    };
  } else if (normalized.includes('out of stock')) {
    config = {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: XCircle,
      dot: "bg-red-500"
    };
  } else if (normalized.includes('in stock') || normalized.includes('active')) {
    config = {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: Check,
      dot: "bg-green-500"
    };
  }

  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-xs font-medium gap-1"
    : size === "lg"
    ? "px-3.5 py-1.5 text-sm font-semibold gap-2"
    : "px-2.5 py-1 text-xs font-semibold gap-1.5";

  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} shadow-sm transition-colors`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${normalized.includes('transit') || normalized.includes('processing') ? 'animate-pulse' : ''}`} />
      {showIcon && <IconComponent className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />}
      <span>{status}</span>
    </span>
  );
}
