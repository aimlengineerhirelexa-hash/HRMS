import { Request, Response } from 'express';
import { Analytics } from '../models/Analytics';
import { Employee } from '../models/Employee';
import { Payroll, PayrollRun } from '../models/Payroll';
import { Attendance } from '../models/Attendance';
import { Leave } from '../models/Leave';
import { ExitManagement } from '../models/ExitManagement';

interface AuthRequest extends Request {
  user?: { tenantId: string; role: string; };
}

export const getHRMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.user!;
    const totalEmployees = await Employee.countDocuments({ tenantId, status: 'active' });
    const newHires = await Employee.countDocuments({ 
      tenantId, 
      'workInfo.hireDate': { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } 
    });
    const avgTenure = await Employee.aggregate([
      { $match: { tenantId, status: 'active' } },
      { $project: { tenure: { $divide: [{ $subtract: [new Date(), '$workInfo.hireDate'] }, 31536000000] } } },
      { $group: { _id: null, avg: { $avg: '$tenure' } } }
    ]);

    res.json({ 
      success: true, 
      data: { totalEmployees, newHires, avgTenure: avgTenure[0]?.avg || 0 } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch HR metrics' });
  }
};

export const getPayrollAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.user!;
    const currentMonth = new Date();
    const payrollRuns = await PayrollRun.find({ 
      tenantId,
      startDate: { $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) }
    });
    
    const totalPayroll = payrollRuns.reduce((sum, run) => sum + run.netPay, 0);
    const avgSalary = totalPayroll / (payrollRuns.length || 1);

    res.json({ 
      success: true, 
      data: { totalPayroll, avgSalary, payrollRuns: payrollRuns.length } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payroll analytics' });
  }
};

export const getAttendanceReports = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.user!;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.find({ tenantId, date: { $gte: today } });
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;

    res.json({ 
      success: true, 
      data: { present, absent, late, total: attendance.length } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch attendance reports' });
  }
};

export const getAttritionAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.user!;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const exits = await ExitManagement.find({ 
      tenantId,
      exitDate: { $gte: sixMonthsAgo }
    });

    const monthlyData = exits.reduce((acc: any, exit: any) => {
      const month = new Date(exit.exitDate).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    res.json({ 
      success: true, 
      data: Object.entries(monthlyData).map(([month, count]) => ({ month, count })) 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch attrition analysis' });
  }
};
