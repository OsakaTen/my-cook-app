import { TabOption } from "../types";

interface Props {
  tabOptions: TabOption[];
  activeTab: TabOption;
  setActiveTab: (tab: TabOption) => void;
}

const Tabs: React.FC<Props> = ({ tabOptions, activeTab, setActiveTab }) => (
  <div className="border-b border-green-500/20 mb-6">
    <nav className="flex gap-8">
      {tabOptions.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab)}
          className={`py-4 px-1 inline-flex items-center gap-2 text-sm font-medium border-b-2 ${
            activeTab.id === tab.id
              ? "text-green-500 border-green-500"
              : "text-gray-500 hover:text-green-500 border-transparent"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

export default Tabs;
