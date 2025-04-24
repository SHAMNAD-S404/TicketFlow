import React from "react";
import { CheckCircle, Loader2, Radio } from "lucide-react";

interface StatusIndicatorProps {
  status: "idle" | "testing" | "ready";
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusContent = () => {
    switch (status) {
      case "idle":
        return {
          icon: <Radio className="w-4 h-4 mr-2 text-gray-400" />,
          text: "Not connected",
          classes: "bg-white/10 text-gray-300",
        };
      case "testing":
        return {
          icon: <Loader2 className="w-4 h-4 mr-2 text-blue-400 animate-spin" />,
          text: "Testing connection",
          classes: "bg-blue-500/20 text-blue-300",
        };
      case "ready":
        return {
          icon: <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />,
          text: "Ready to connect",
          classes: "bg-emerald-500/20 text-emerald-300",
        };
      default:
        return {
          icon: <Radio className="w-4 h-4 mr-2 text-gray-400" />,
          text: "Unknown status",
          classes: "bg-white/10 text-gray-300",
        };
    }
  };

  const { icon, text, classes } = getStatusContent();

  return (
    <div className={`flex items-center text-xs px-3 py-1.5 rounded-full ${classes} transition-all duration-300`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};
