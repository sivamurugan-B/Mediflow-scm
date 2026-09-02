import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Package, 
  Circle, 
  AlertCircle,
  FileCheck,
  Building2
} from 'lucide-react';

const DEFAULT_STAGES = [
  { id: 1, name: "Order Placed", desc: "Digital requisition submitted & verified" },
  { id: 2, name: "Order Confirmed", desc: "Order approved & inventory allocated" },
  { id: 3, name: "Processing", desc: "Warehouse picking & batch assembly" },
  { id: 4, name: "Quality Check", desc: "Medical sterility & QA verification" },
  { id: 5, name: "Packed", desc: "Tamper-evident thermal packaging sealed" },
  { id: 6, name: "Dispatched", desc: "Carrier handover & departure gate pass" },
  { id: 7, name: "In Transit", desc: "En route via temperature-controlled transport" },
  { id: 8, name: "Out for Delivery", desc: "Last-mile courier out for hospital drop-off" },
  { id: 9, name: "Delivered", desc: "Received, inspected & acknowledged" }
];

export default function TrackingTimeline({ 
  currentStatus = "Order Confirmed", 
  stages = null,
  detailed = false
}) {
  // Determine active index based on status string
  const normalizedStatus = currentStatus ? currentStatus.toLowerCase() : "";

  const statusIndexMap = {
    'new': 0,
    'order placed': 0,
    'confirmed': 1,
    'order confirmed': 1,
    'booking confirmed': 1,
    'technician assigned': 2,
    'processing': 2,
    'in progress': 2,
    'quality check': 3,
    'qa passed': 3,
    'packed': 4,
    'dispatched': 5,
    'in transit': 6,
    'delayed': 6,
    'out for delivery': 7,
    'delivered': 8,
    'completed': 8
  };

  const activeIndex = statusIndexMap[normalizedStatus] !== undefined ? statusIndexMap[normalizedStatus] : 1;
  const isDelayed = normalizedStatus.includes('delayed');

  const timelineItems = stages && stages.length > 0 
    ? stages 
    : DEFAULT_STAGES.map((s, idx) => {
        let status = "pending";
        if (idx < activeIndex) status = "completed";
        else if (idx === activeIndex) status = isDelayed ? "delayed" : "current";
        return {
          ...s,
          status,
          timestamp: idx <= activeIndex ? (idx === activeIndex ? "Current Step" : "Completed") : "Pending",
          location: idx <= activeIndex ? "Active Checkpoint" : "Destination Route",
          remarks: s.desc
        };
      });

  return (
    <div className="w-full py-4">
      {/* Visual Timeline (Horizontal on large screens, Vertical on small) */}
      <div className="relative">
        <ol className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 space-y-6 sm:space-y-8">
          {timelineItems.map((item, index) => {
            let itemStatus = item.status;
            if (!itemStatus) {
              if (index < activeIndex) itemStatus = "completed";
              else if (index === activeIndex) itemStatus = isDelayed ? "delayed" : "current";
              else itemStatus = "pending";
            }

            const isCompleted = itemStatus === "completed";
            const isCurrent = itemStatus === "current";
            const isDelayedStep = itemStatus === "delayed";
            const isPending = itemStatus === "pending";

            return (
              <li key={item.id || index} className="mb-6 ml-6 group">
                {/* Node Icon Indicator */}
                <span className={`absolute -left-[17px] flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white transition-all ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : isCurrent 
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/40 ring-brand-100 animate-pulse' 
                    : isDelayedStep
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/40 ring-rose-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  ) : isDelayedStep ? (
                    <AlertCircle className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </span>

                {/* Content Box */}
                <div className={`p-4 rounded-xl border transition-all ${
                  isCurrent 
                    ? 'bg-brand-50/70 border-brand-200 shadow-sm' 
                    : isDelayedStep
                    ? 'bg-rose-50/70 border-rose-200 shadow-sm'
                    : isCompleted 
                    ? 'bg-white border-slate-200' 
                    : 'bg-slate-50/50 border-slate-200/60 opacity-70'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${
                        isCurrent ? 'text-brand-900 font-extrabold' : isCompleted ? 'text-slate-900' : 'text-slate-500'
                      }`}>
                        {item.name || item.stageName}
                      </h4>

                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-600 text-white shadow-xs">
                          ● Current Stage
                        </span>
                      )}
                      {isDelayedStep && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-xs">
                          ⚠ Monsoon Delay
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ Completed
                        </span>
                      )}
                      {isPending && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          ○ Pending
                        </span>
                      )}
                    </div>

                    {item.timestamp && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.timestamp}</span>
                      </div>
                    )}
                  </div>

                  {/* Detailed location and remarks */}
                  {(detailed || item.location || item.remarks) && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      {item.remarks && (
                        <div className="text-slate-500 italic">
                          "{item.remarks}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
