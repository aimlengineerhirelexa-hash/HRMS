import express from 'express';
import { Payroll, SalaryComponent, PayrollRun, Payslip, Compliance } from '../models/Payroll';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Salary Components Routes
router.get('/components', authenticateToken, async (req: any, res) => {
  try {
    const components = await SalaryComponent.find({ tenantId: req.user.tenantId }).sort({ componentName: 1 });
    res.json({ success: true, data: components });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/components', authenticateToken, async (req: any, res) => {
  try {
    const componentData = { ...req.body, tenantId: req.user.tenantId };
    const component = new SalaryComponent(componentData);
    await component.save();
    res.status(201).json({ success: true, data: component });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/components/:id', authenticateToken, async (req: any, res) => {
  try {
    const component = await SalaryComponent.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true }
    );
    if (!component) {
      return res.status(404).json({ success: false, message: 'Component not found' });
    }
    res.json({ success: true, data: component });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Payroll Runs Routes
router.get('/runs', authenticateToken, async (req: any, res) => {
  try {
    const runs = await PayrollRun.find({ tenantId: req.user.tenantId }).sort({ createdAt: -1 });
    res.json({ success: true, data: runs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/runs', authenticateToken, async (req: any, res) => {
  try {
    const runData = { ...req.body, tenantId: req.user.tenantId };
    const run = new PayrollRun(runData);
    await run.save();
    res.status(201).json({ success: true, data: run });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/runs/:id', authenticateToken, async (req: any, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.status === 'approved') {
      updateData.approvedBy = req.user.userId;
      updateData.approvedAt = new Date();
    } else if (req.body.status === 'processed') {
      updateData.processedBy = req.user.userId;
      updateData.processedAt = new Date();
    } else if (req.body.status === 'locked') {
      updateData.lockedBy = req.user.userId;
      updateData.lockedAt = new Date();
    }
    
    const run = await PayrollRun.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      updateData,
      { new: true }
    );
    
    if (!run) {
      return res.status(404).json({ success: false, message: 'Payroll run not found' });
    }
    
    res.json({ success: true, data: run });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Payslips Routes
router.get('/payslips', authenticateToken, async (req: any, res) => {
  try {
    const { employeeId, payPeriod, status } = req.query;
    const filter: any = { tenantId: req.user.tenantId };
    
    if (employeeId) filter.employeeId = employeeId;
    if (payPeriod) filter.payPeriod = payPeriod;
    if (status) filter.status = status;
    
    const payslips = await Payslip.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: payslips });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/payslips', authenticateToken, async (req: any, res) => {
  try {
    const payslipData = { ...req.body, tenantId: req.user.tenantId };
    const payslip = new Payslip(payslipData);
    await payslip.save();
    res.status(201).json({ success: true, data: payslip });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/payslips/:id', authenticateToken, async (req: any, res) => {
  try {
    const payslip = await Payslip.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      req.body,
      { new: true }
    );
    if (!payslip) {
      return res.status(404).json({ success: false, message: 'Payslip not found' });
    }
    res.json({ success: true, data: payslip });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Compliance Routes
router.get('/compliance', authenticateToken, async (req: any, res) => {
  try {
    const compliance = await Compliance.find({ tenantId: req.user.tenantId }).sort({ createdAt: -1 });
    res.json({ success: true, data: compliance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/compliance', authenticateToken, async (req: any, res) => {
  try {
    const complianceData = { ...req.body, tenantId: req.user.tenantId };
    const compliance = new Compliance(complianceData);
    await compliance.save();
    res.status(201).json({ success: true, data: compliance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reports Routes
router.get('/reports/summary', authenticateToken, async (req: any, res) => {
  try {
    const { period } = req.query;
    const filter: any = { tenantId: req.user.tenantId };
    if (period) filter.payrollPeriod = period;
    
    const runs = await PayrollRun.find(filter);
    const summary = {
      totalRuns: runs.length,
      totalEmployees: runs.reduce((sum, run) => sum + run.employeeList.length, 0),
      totalEarnings: runs.reduce((sum, run) => sum + run.totalEarnings, 0),
      totalDeductions: runs.reduce((sum, run) => sum + run.totalDeductions, 0),
      totalNetPay: runs.reduce((sum, run) => sum + run.netPay, 0)
    };
    
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/reports/variance', authenticateToken, async (req: any, res) => {
  try {
    const runs = await PayrollRun.find({ tenantId: req.user.tenantId })
      .sort({ createdAt: -1 })
      .limit(2);
    
    if (runs.length < 2) {
      return res.json({ success: true, data: { message: 'Insufficient data for variance report' } });
    }
    
    const [current, previous] = runs;
    const variance = {
      employeeChange: current.employeeList.length - previous.employeeList.length,
      earningsChange: current.totalEarnings - previous.totalEarnings,
      deductionsChange: current.totalDeductions - previous.totalDeductions,
      netPayChange: current.netPay - previous.netPay
    };
    
    res.json({ success: true, data: variance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Legacy payroll routes (backward compatibility)
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const { status, employeeId, payPeriod } = req.query;
    const filter: any = { tenantId: req.user.tenantId };
    
    if (status) filter.status = status;
    if (employeeId) filter.employeeId = employeeId;
    if (payPeriod) {
      const [year, month] = payPeriod.split('-');
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter['payPeriod.startDate'] = { $gte: startDate };
      filter['payPeriod.endDate'] = { $lte: endDate };
    }

    const payrolls = await Payroll.find(filter).sort({ 'payPeriod.startDate': -1 });
    res.json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const payrollData = { ...req.body, tenantId: req.user.tenantId };
    const payroll = new Payroll(payrollData);
    await payroll.save();
    res.status(201).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.status === 'processed') {
      updateData.processedBy = req.user.userId;
      updateData.processedAt = new Date();
    }
    
    const payroll = await Payroll.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      updateData,
      { new: true }
    );
    
    if (!payroll) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }
    
    res.json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;