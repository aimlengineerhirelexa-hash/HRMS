import { Request, Response } from 'express';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';
import { NavigationItem } from '../models/NavigationItem';

interface AuthRequest extends Request {
  user?: {
    role: string;
    _id: string;
    email: string;
  };
}

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find({ isActive: true });
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch roles' });
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await Permission.find({ isActive: true });
    res.json({ success: true, data: permissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch permissions' });
  }
};

export const getUserPermissions = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    const roleDoc = await Role.findOne({ name: role, isActive: true });
    
    if (!roleDoc) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    const permissions = await Permission.find({ 
      name: { $in: roleDoc.permissions },
      isActive: true 
    });

    res.json({ success: true, data: permissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user permissions' });
  }
};

export const getNavigationItems = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.user!;
    const roleDoc = await Role.findOne({ name: role, isActive: true });
    
    if (!roleDoc) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    const allNavigationItems = await NavigationItem.find({ isActive: true }).sort({ order: 1 });
    
    // Filter items where user has all required permissions
    const navigationItems = allNavigationItems.filter(item => {
      if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
        return true;
      }
      return item.requiredPermissions.every(perm => roleDoc.permissions.includes(perm));
    });

    // Build hierarchical structure
    const itemMap = new Map();
    const rootItems: any[] = [];

    navigationItems.forEach(item => {
      itemMap.set(item.id, { ...item.toObject(), children: [] });
    });

    navigationItems.forEach(item => {
      const itemObj = itemMap.get(item.id);
      if (item.parentId && itemMap.has(item.parentId)) {
        itemMap.get(item.parentId).children.push(itemObj);
      } else {
        rootItems.push(itemObj);
      }
    });

    res.json({ success: true, data: rootItems });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch navigation items' });
  }
};