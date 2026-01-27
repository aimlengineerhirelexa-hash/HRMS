import React, { createContext, useContext, useState, useEffect } from 'react';
import { roleService } from '../services/roleService';
import { api } from '../services/api';
import { NavigationItem, Permission } from '../../../shared/types';

interface User {
  _id: string;
  employeeId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  department: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  permissions: Permission[];
  navigationItems: NavigationItem[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      const [userPermissions, userNavigation] = await Promise.all([
        roleService.getUserPermissions(),
        roleService.getNavigationItems()
      ]);
      setPermissions(userPermissions);
      setNavigationItems(userNavigation);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        setUser(response.data.data.user);
        setIsAuthenticated(true);
        await loadUserData();
        return true;
      }
      console.log('Login failed:', response.data.message);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPermissions([]);
    setNavigationItems([]);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.some(p => p.name === permission);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    permissions,
    navigationItems,
    login,
    logout,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};