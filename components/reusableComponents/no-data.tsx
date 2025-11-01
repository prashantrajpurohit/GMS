import React from "react";
import { Inbox, LucideIcon } from "lucide-react";

interface NoDataProps {
  title?: string;
  logo?: LucideIcon;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

const NoData: React.FC<NoDataProps> = ({
  title = "No Data Available",
  logo: Logo = Inbox,
  subtitle,
  actionButton,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <Logo className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-semibold mb-2">{title}</h3>

      {subtitle && (
        <p className="text-gray-500 text-center max-w-md mb-6">{subtitle}</p>
      )}

      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  );
};
export default NoData;
