import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { LoginRequest, LoginResponse, ApiResponse } from '../../../shared/types';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    console.log('Database name:', mongoose.connection.name);
    const { email, password }: LoginRequest = req.body;

    // Debug: Check all users in database
    const allUsers = await User.find({});
    console.log('Total users in database:', allUsers.length);
    console.log('User emails:', allUsers.map(u => u.email));

    const user = await User.findOne({ email, isActive: true });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password!);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const response: ApiResponse<LoginResponse> = {
      success: true,
      data: {
        token,
        user: {
          _id: user._id.toString(),
          tenantId: user.tenantId,
          employeeId: user.employeeId,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          department: user.department,
          managerId: user.managerId,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    };

    console.log('Login successful for:', email);
    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: any, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

export default router;