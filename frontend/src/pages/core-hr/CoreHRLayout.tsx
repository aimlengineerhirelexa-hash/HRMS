import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface Tab {
  id: string;
  label: string;
  path: string;
}

interface CoreHRLayoutProps {
  children: React.ReactNode;
  title: string;
  tabs: Tab[];
}

const CoreHRLayout: React.FC<CoreHRLayoutProps> = ({ children, title, tabs }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = tabs.find(tab => location.pathname.startsWith(tab.path))?.id || tabs[0]?.id;

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">Manage and organize your workforce efficiently</p>
        </div>
      </div>
      
      {/* Tabs */}
      <Card className="bg-white shadow-sm border-0 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-100">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </Card>
    </div>
  );
};

export default CoreHRLayout;