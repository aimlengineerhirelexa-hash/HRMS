import { Request, Response } from 'express';
import { Employee } from '../models/Employee';
import { Attendance } from '../models/Attendance';
import { Leave } from '../models/Leave';
import { Department } from '../models/Department';
import {
  RecruitmentFunnel,
  ComplianceSnapshot
} from '../models/DashboardMetrics';

interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: "Admin" | "HR" | "Manager" | "Employee" | "Super Admin" | "HR Manager";
  };
}

/* =========================================================
   DASHBOARD METRICS (SUMMARY)
========================================================= */
export const getDashboardMetrics = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const role = req.user?.role || 'Employee';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalEmployees = await Employee.countDocuments({ status: 'active' });

    const totalPresent = await Attendance.countDocuments({
      date: { $gte: today },
      status: 'present'
    });

    const totalAbsent = Math.max(totalEmployees - totalPresent, 0);

    const onLeave = await Leave.countDocuments({
      status: 'approved',
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    const onsiteCount = await Employee.countDocuments({
      status: 'active',
      'workInfo.workLocation': 'office'
    });

    const remoteCount = await Employee.countDocuments({
      status: 'active',
      'workInfo.workLocation': 'remote'
    });

    const hybridCount = await Employee.countDocuments({
      status: 'active',
      'workInfo.workLocation': 'hybrid'
    });

    const departments = await Department.find({ status: 'Active' });

    const departmentDistribution = departments.map(d => ({
      label: d.name,
      value: d.employeeCount || 0
    }));

    const recruitmentFunnel = await RecruitmentFunnel.find({
      tenantId: 'default'
    })
      .select('-tenantId -__v -createdAt -updatedAt')
      .sort({ stage: 1 });

    const complianceSnapshots = await ComplianceSnapshot.find({
      tenantId: 'default'
    }).select('-tenantId -__v -createdAt -updatedAt');

    const complianceData = mapComplianceSnapshot(complianceSnapshots);

    const payload = {
      totalEmployees,
      totalPresent,
      totalAbsent,
      onLeave,
      workforceDistribution: {
        onsite: totalEmployees
          ? Math.round((onsiteCount / totalEmployees) * 100)
          : 0,
        remote: totalEmployees
          ? Math.round((remoteCount / totalEmployees) * 100)
          : 0,
        hybrid: totalEmployees
          ? Math.round((hybridCount / totalEmployees) * 100)
          : 0
      },
      departmentDistribution,
      recruitmentFunnel,
      complianceData
    };

    if (role === 'Employee') {
      return res.json({
        success: true,
        data: {
          totalEmployees,
          workforceDistribution: payload.workforceDistribution,
          departmentDistribution
        }
      });
    }

    if (role === 'Manager') {
      const { complianceData, ...managerView } = payload;
      return res.json({ success: true, data: managerView });
    }

    return res.json({ success: true, data: payload });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
};

/* =========================================================
   EMPLOYEE KPI API
========================================================= */
export const getEmployeeKPIs = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalEmployees = await Employee.countDocuments({ status: 'active' });

    const totalPresent = await Attendance.countDocuments({
      date: { $gte: today },
      status: 'present'
    });

    const totalAbsent = Math.max(totalEmployees - totalPresent, 0);

    const onLeave = await Leave.countDocuments({
      status: 'approved',
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    return res.json({
      success: true,
      data: {
        totalEmployees,
        totalPresent,
        totalAbsent,
        onLeave
      }
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Employee KPI fetch failed'
    });
  }
};

/* =========================================================
   WORKFORCE DISTRIBUTION API
========================================================= */
export const getWorkforceDistribution = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const totalEmployees = await Employee.countDocuments({ status: 'active' });

    const onsite = await Employee.countDocuments({
      status: 'active',
      'workInfo.workLocation': 'office'
    });

    const remote = await Employee.countDocuments({
      status: 'active',
      'workInfo.workLocation': 'remote'
    });

    const hybrid = await Employee.countDocuments({
      status: 'active',
      'workInfo.workLocation': 'hybrid'
    });

    return res.json({
      success: true,
      data: {
        onsite: totalEmployees
          ? Math.round((onsite / totalEmployees) * 100)
          : 0,
        remote: totalEmployees
          ? Math.round((remote / totalEmployees) * 100)
          : 0,
        hybrid: totalEmployees
          ? Math.round((hybrid / totalEmployees) * 100)
          : 0
      }
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Workforce distribution failed'
    });
  }
};

/* =========================================================
   DEPARTMENT DISTRIBUTION API
========================================================= */
export const getDepartmentDistribution = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const departments = await Department.find({ status: 'Active' });

    return res.json({
      success: true,
      data: departments.map(d => ({
        label: d.name,
        value: d.employeeCount || 0
      }))
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Department distribution failed'
    });
  }
};

/* =========================================================
   RECRUITMENT FUNNEL API
========================================================= */
export const getRecruitmentFunnel = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!['Super Admin', 'HR Manager'].includes(req.user?.role || 'Employee')) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const data = await RecruitmentFunnel.find({ tenantId: 'default' })
      .select('-tenantId -__v -createdAt -updatedAt')
      .sort({ stage: 1 });

    return res.json({ success: true, data });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Recruitment funnel failed'
    });
  }
};

/* =========================================================
    ATTRITION DATA API
========================================================= */
export const getAttritionData = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!['Super Admin', 'HR Manager'].includes(req.user?.role || 'Employee')) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Calculate attrition rate (simplified)
    const totalEmployees = await Employee.countDocuments();
    const terminatedEmployees = await Employee.countDocuments({ status: 'terminated' });

    const attritionRate = totalEmployees > 0 ? (terminatedEmployees / totalEmployees) * 100 : 0;

    return res.json({
      success: true,
      data: {
        totalEmployees,
        terminatedEmployees,
        attritionRate: Math.round(attritionRate * 100) / 100
      }
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Attrition data failed'
    });
  }
};

/* =========================================================
    COMPLIANCE API
========================================================= */
export const getComplianceData = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!['Super Admin', 'HR Manager'].includes(req.user?.role || 'Employee')) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const snapshots = await ComplianceSnapshot.find({ tenantId: 'default' })
      .select('-tenantId -__v -createdAt -updatedAt');

    return res.json({
      success: true,
      data: mapComplianceSnapshot(snapshots)
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Compliance data failed'
    });
  }
};

/* =========================================================
   FULL DASHBOARD API (FRONTEND READY)
========================================================= */
export const getFullDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalEmployees = await Employee.countDocuments({ status: "active" });
    const totalPresent = await Attendance.countDocuments({
      date: { $gte: today },
      status: "present",
    });

    const totalAbsent = Math.max(totalEmployees - totalPresent, 0);

    const onLeave = await Leave.countDocuments({
      status: "approved",
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    // workforce distribution by location
    const workforceAgg = await Employee.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: "$workInfo.workLocation",
          count: { $sum: 1 },
        },
      },
    ]);

    const workforceData = workforceAgg.map((item: any) => ({
      label: item._id || "Unknown",
      value: item.count,
      color: getRandomColor(),
    }));

    // department distribution
    const departmentData = await Department.find({ status: "Active" }).select(
      "name employeeCount"
    );

    const departmentFormatted = departmentData.map((d: any) => ({
      label: d.name,
      value: d.employeeCount || 0,
      color: getRandomColor(),
    }));

    // recruitment funnel
    const recruitmentFunnel = await RecruitmentFunnel.find({
      tenantId: "default",
    }).sort({ stage: 1 });

    // compliance snapshot
    const complianceSnapshots = await ComplianceSnapshot.find({
      tenantId: "default",
    });

    const complianceData = complianceSnapshots.map((item: any) => ({
      title: item.title,
      value: item.value,
      icon: item.icon || "FileText",
      color: item.color || "#3B82F6",
    }));

    return res.json({
      success: true,
      data: {
        kpiData: {
          totalEmployees: { value: totalEmployees, change: "0%", trend: "up" },
          totalPresent: { value: totalPresent, change: "0%", trend: "up" },
          totalAbsenties: { value: totalAbsent, change: "0%", trend: "up" },
          onLeave: { value: onLeave, change: "0%", trend: "up" },
        },
        workforceData,
        locationData: workforceData,
        departmentData: departmentFormatted,
        recruitmentFunnelData: recruitmentFunnel,
        complianceData,
        totalEmployeesCount: totalEmployees,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};

function getRandomColor() {
  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#06B6D4",
    "#EF4444",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/* =========================================================
   HELPERS
========================================================= */
async function getWorkforceDistributionData() {
  const totalEmployees = await Employee.countDocuments({ status: 'active' });
  const onsite = await Employee.countDocuments({
    status: 'active',
    'workInfo.workLocation': 'office'
  });
  const remote = await Employee.countDocuments({
    status: 'active',
    'workInfo.workLocation': 'remote'
  });
  const hybrid = await Employee.countDocuments({
    status: 'active',
    'workInfo.workLocation': 'hybrid'
  });

  return {
    onsite: totalEmployees ? Math.round((onsite / totalEmployees) * 100) : 0,
    remote: totalEmployees ? Math.round((remote / totalEmployees) * 100) : 0,
    hybrid: totalEmployees ? Math.round((hybrid / totalEmployees) * 100) : 0
  };
}

async function getLocationDistributionData() {
  // Sample: you can modify based on your schema
  const locations = await Employee.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: '$workInfo.workLocation', count: { $sum: 1 } } }
  ]);

  return locations.map((l: any) => ({
    label: l._id,
    value: l.count
  }));
}

function mapComplianceSnapshot(records: any[]) {
  const result = {
    documentsDue: 0,
    skillsGapCount: 0,
    documentsExpiring: 0,
    complianceRisk: 'Low'
  };

  records.forEach(r => {
    if (r.title === 'Documents Due') result.documentsDue = r.value;
    if (r.title === 'Skills Gap Count') result.skillsGapCount = r.value;
    if (r.title === 'Documents Expiring') result.documentsExpiring = r.value;
    if (r.title === 'Compliance Risk') result.complianceRisk = r.value;
  });

  return result;
}
