import express from 'express';
import { Employee } from '../models/Employee';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Get all employees (HR and Admin only)
router.get('/', 
  authenticateToken, 
  authorizeRoles('super_admin', 'admin', 'hr_manager'),
  async (req: any, res) => {
    try {
      const employees = await Employee.find({ 
        tenantId: req.user.tenantId
        // status: 'active' 
      });
      
      res.json({
        success: true,
        data: employees
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  }
);

// Get employee by ID
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create employee
router.post('/',
  authenticateToken,
  authorizeRoles('super_admin', 'admin', 'hr_manager'),
  async (req: any, res) => {
    try {
      const employeeData = {
        ...req.body,
        tenantId: req.user.tenantId
      };

      const employee = new Employee(employeeData);
      await employee.save();

      res.status(201).json({
        success: true,
        data: employee
      });
    } catch (error) {
      console.error('Create employee error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create employee'
      });
    }
  }
);

// Update employee
router.put('/:id',
  authenticateToken,
  authorizeRoles('super_admin', 'admin', 'hr_manager'),
  async (req: any, res) => {
    try {
      const employee = await Employee.findOneAndUpdate(
        { _id: req.params.id, tenantId: req.user.tenantId },
        req.body,
        { new: true }
      );

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      res.json({
        success: true,
        data: employee
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update employee'
      });
    }
  }
);

// Delete employee
router.delete('/:id',
  authenticateToken,
  authorizeRoles('super_admin'),
  async (req: any, res) => {
    try {
      const employee = await Employee.findOneAndDelete({
        _id: req.params.id,
        tenantId: req.user.tenantId
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      res.json({
        success: true,
        message: 'Employee deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete employee'
      });
    }
  }
);

// Get employees by department
router.get('/department/:department',
 authenticateToken,
 authorizeRoles('super_admin', 'admin', 'hr_manager'),
 async (req: any, res) => {
   try {
     const employees = await Employee.find({
       tenantId: req.user.tenantId,
       'workInfo.department': req.params.department,
       status: 'active'
     });

     res.json({
       success: true,
       data: employees
     });
   } catch (error) {
     res.status(500).json({
       success: false,
       message: 'Server error'
     });
   }
 }
);

export default router;