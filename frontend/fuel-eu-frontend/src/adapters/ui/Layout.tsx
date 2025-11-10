import type { ReactNode } from "react";
import {
  FaRoute,
  FaBalanceScaleLeft,
  FaWallet,
  FaUsersCog
} from "react-icons/fa";

interface LayoutProps {
  children: ReactNode;
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export function Layout({ children, onTabChange, activeTab }: LayoutProps) {
  const tabs = [
    {
      id: "routes",
      label: "Routes",
      icon: <FaRoute className="inline-block mr-2 text-lg font-bold" />
    },
    {
      id: "compare",
      label: "Compare",
      icon: <FaBalanceScaleLeft className="inline-block mr-2 text-lg font-bold" />
    },
    {
      id: "banking",
      label: "Banking",
      icon: <FaWallet className="inline-block mr-2 text-lg font-bold" />
    },
    {
      id: "pooling",
      label: "Pooling",
      icon: <FaUsersCog className="inline-block mr-2 text-lg font-bold" />
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf5]">
      {/* Header */}
      <header className="bg-orange-500 shadow-lg px-8 py-6 flex justify-center items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center tracking-wider">
          FuelEU Maritime Dashboard
        </h1>
      </header>

      {/* Tabs */}
      <nav className="bg-orange-100 border-b border-orange-300 shadow-sm">
        <div className="flex justify-center flex-wrap space-x-4 md:space-x-8 px-4 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center py-3 px-5 rounded-t-lg font-bold text-lg transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white shadow-xl scale-105"
                    : "text-orange-800 hover:text-orange-600 hover:shadow-md hover:bg-orange-200"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 px-6 md:px-12 py-6">{children}</main>
    </div>
  );
}
