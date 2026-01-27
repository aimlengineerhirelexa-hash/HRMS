import { api } from './api';
import { Role, Permission, NavigationItem } from '../../../shared/types';

export const roleService = {
  getRoles: async (): Promise<Role[]> => {
    const response = await api.get('/api/roles');
    return response.data.data;
  },

  getPermissions: async (): Promise<Permission[]> => {
    const response = await api.get('/api/permissions');
    return response.data.data;
  },

  getUserPermissions: async (): Promise<Permission[]> => {
    const response = await api.get('/api/user-permissions');
    return response.data.data;
  },

  getNavigationItems: async (): Promise<NavigationItem[]> => {
    const response = await api.get('/api/navigation');
    return response.data.data;
  }
};