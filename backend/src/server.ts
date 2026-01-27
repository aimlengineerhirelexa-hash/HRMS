import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import config from './config';

import authRoutes from './routes/auth';
import employeeRoutes from './routes/employees';
import attendanceRoutes from './routes/attendance';
import leaveRoutes from './routes/leave';
import jobRoutes from './routes/jobs';
import payrollRoutes from './routes/payroll';
import roleRoutes from './routes/roleRoutes';
import organizationRoutes from './routes/organization';
import onboardingRoutes from './routes/onboarding';
import exitManagementRoutes from './routes/exitManagement';
import dashboardRoutes from './routes/dashboard';
import salaryStructureRoutes from './routes/salaryStructure';
import shiftRoutes from './routes/shifts';
import analyticsRoutes from './routes/analytics';
import holidayRoutes from './routes/holidays';
import salaryComponentRoutes from './routes/salaryComponents';
import expenseRoutes from './routes/expenses';
import benefitRoutes from './routes/benefits';
import documentRoutes from './routes/documents';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api', roleRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/exit-management', exitManagementRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/salary-structure', salaryStructureRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/salary-components', salaryComponentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/benefits', benefitRoutes);
app.use('/api/documents', documentRoutes);

// Health check
app.get('/health', (req, res) => {
  console.log('Health check accessed');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint accessed');
  res.json({ message: 'Backend is working', timestamp: new Date().toISOString() });
});

// MongoDB connection
mongoose.connect(config.mongodbUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});