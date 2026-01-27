import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { NavigationItem } from '../../../shared/types';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  item: NavigationItem;
  level?: number;
  isActive?: boolean;
  onNavigate: (path: string) => void;
}

const SidebarItem = ({ item, level = 0, isActive, onNavigate }: SidebarItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const location = useLocation();

  useEffect(() => {
    if (hasChildren && item.children) {
      const hasActiveChild = item.children.some(child => 
        child.path === location.pathname || 
        (child.children && child.children.some(grandChild => grandChild.path === location.pathname))
      );
      if (hasActiveChild) {
        setIsExpanded(true);
      }
    }
  }, [location.pathname, hasChildren, item.children]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hasChildren) {
      setIsExpanded(!isExpanded);
      return;
    }
    
    if (item.path) {
      onNavigate(item.path);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-md transition-all duration-200 text-left",
          level > 0 && "ml-4 pl-6",
          isActive
            ? "text-primary font-medium bg-primary/5 border-l-2 border-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <span>{item.label}</span>
        {hasChildren && (
          isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
        )}
      </button>
      
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              level={level + 1}
              isActive={child.path === location.pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const { navigationItems } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="w-72 border-r border-border bg-card min-h-[calc(100vh-4rem)] py-6 overflow-y-auto">
      <nav className="space-y-1 px-3">
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={item.path === location.pathname}
            onNavigate={handleNavigate}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;