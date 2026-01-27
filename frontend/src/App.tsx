import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "@/components/auth/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Employees from "./pages/core-hr/Employees";
import Onboarding from "./pages/core-hr/Onboarding";
import OrganizationPage from "./pages/core-hr/Organization";
import ExitManagementPage from "./pages/core-hr/ExitManagement";
import { PayrollManagement, SalaryStructure, PayrollRuns, Payslips, PayrollReports } from "./pages/payroll";
import { PerformanceManagement, GoalsOKRs, PerformanceReviews, RatingsScores, Calibration } from "./pages/performance";
import AttendanceTracking from "./pages/time-attendance/AttendanceTracking";
import ShiftManagement from "./pages/time-attendance/ShiftManagement";
import LeaveManagement from "./pages/time-attendance/LeaveManagement";
import JobOpenings from "./pages/recruitment/JobOpenings";
import PlaceholderPage from "./components/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Most specific routes first */}
      
      {/* Core HR Routes */}
      <Route path="/core-hr/employees/*" element={<ProtectedRoute><Layout><Employees /></Layout></ProtectedRoute>} />
      <Route path="/core-hr/onboarding/*" element={<ProtectedRoute><Layout><Onboarding /></Layout></ProtectedRoute>} />
      <Route path="/core-hr/organization" element={<ProtectedRoute><Layout><OrganizationPage /></Layout></ProtectedRoute>} />
      <Route path="/core-hr/exit" element={<ProtectedRoute><Layout><ExitManagementPage /></Layout></ProtectedRoute>} />
      
      {/* Legacy Routes for Backward Compatibility */}
      <Route path="/core-hr/people/directory" element={<Navigate to="/core-hr/employees/directory" replace />} />
      <Route path="/core-hr/people/profile" element={<Navigate to="/core-hr/employees/profile" replace />} />
      
      {/* Payroll Routes */}
      <Route path="/payroll/salary-structure" element={<ProtectedRoute><Layout><SalaryStructure /></Layout></ProtectedRoute>} />
      <Route path="/payroll/runs" element={<ProtectedRoute><Layout><PayrollRuns /></Layout></ProtectedRoute>} />
      <Route path="/payroll/payslips" element={<ProtectedRoute><Layout><Payslips /></Layout></ProtectedRoute>} />
      <Route path="/payroll/reports" element={<ProtectedRoute><Layout><PayrollReports /></Layout></ProtectedRoute>} />
      <Route path="/payroll" element={<ProtectedRoute><Layout><PayrollManagement /></Layout></ProtectedRoute>} />
      
      {/* Time & Attendance Routes */}
      <Route path="/time-attendance/tracking" element={<ProtectedRoute><Layout><AttendanceTracking /></Layout></ProtectedRoute>} />
      <Route path="/time-attendance/shifts" element={<ProtectedRoute><Layout><ShiftManagement /></Layout></ProtectedRoute>} />
      <Route path="/time-attendance/leaves" element={<ProtectedRoute><Layout><LeaveManagement /></Layout></ProtectedRoute>} />
      
      {/* Recruitment Routes */}
      <Route path="/recruitment/jobs" element={<ProtectedRoute><JobOpenings /></ProtectedRoute>} />
      <Route path="/recruitment/applicants" element={<ProtectedRoute><PlaceholderPage title="Applicant Management" /></ProtectedRoute>} />
      <Route path="/recruitment/interviews" element={<ProtectedRoute><PlaceholderPage title="Interview Scheduling" /></ProtectedRoute>} />
      <Route path="/recruitment/offers" element={<ProtectedRoute><PlaceholderPage title="Offer Management" /></ProtectedRoute>} />
      <Route path="/recruitment/onboarding" element={<ProtectedRoute><PlaceholderPage title="Recruitment Onboarding" /></ProtectedRoute>} />
      
      {/* Performance Routes */}
      <Route path="/performance/goals" element={<ProtectedRoute><Layout><GoalsOKRs /></Layout></ProtectedRoute>} />
      <Route path="/performance/reviews" element={<ProtectedRoute><Layout><PerformanceReviews /></Layout></ProtectedRoute>} />
      <Route path="/performance/ratings" element={<ProtectedRoute><Layout><RatingsScores /></Layout></ProtectedRoute>} />
      <Route path="/performance/calibration" element={<ProtectedRoute><Layout><Calibration /></Layout></ProtectedRoute>} />
      <Route path="/performance" element={<ProtectedRoute><Layout><PerformanceManagement /></Layout></ProtectedRoute>} />
      <Route path="/performance/history" element={<ProtectedRoute><Layout><PerformanceManagement /></Layout></ProtectedRoute>} />
      
      {/* Training Routes */}
      <Route path="/training/courses" element={<ProtectedRoute><PlaceholderPage title="Training Courses" /></ProtectedRoute>} />
      <Route path="/training/paths" element={<ProtectedRoute><PlaceholderPage title="Learning Paths" /></ProtectedRoute>} />
      <Route path="/training/certifications" element={<ProtectedRoute><PlaceholderPage title="Certifications" /></ProtectedRoute>} />
      
      {/* Expenses Routes */}
      <Route path="/expenses/claims" element={<ProtectedRoute><PlaceholderPage title="Expense Claims" /></ProtectedRoute>} />
      <Route path="/expenses/approvals" element={<ProtectedRoute><PlaceholderPage title="Expense Approvals" /></ProtectedRoute>} />
      <Route path="/expenses/reports" element={<ProtectedRoute><PlaceholderPage title="Expense Reports" /></ProtectedRoute>} />
      
      {/* Benefits Routes */}
      <Route path="/benefits/insurance" element={<ProtectedRoute><PlaceholderPage title="Insurance Plans" /></ProtectedRoute>} />
      <Route path="/benefits/allowances" element={<ProtectedRoute><PlaceholderPage title="Allowances" /></ProtectedRoute>} />
      <Route path="/benefits/costing" element={<ProtectedRoute><PlaceholderPage title="Employee Benefits Costing" /></ProtectedRoute>} />
      
      {/* Documents Routes */}
      <Route path="/documents/financial" element={<ProtectedRoute><PlaceholderPage title="Financial Documents" /></ProtectedRoute>} />
      <Route path="/documents/compliance" element={<ProtectedRoute><PlaceholderPage title="Compliance Records" /></ProtectedRoute>} />
      <Route path="/documents/tax" element={<ProtectedRoute><PlaceholderPage title="Tax Documents" /></ProtectedRoute>} />
      <Route path="/documents/audit" element={<ProtectedRoute><PlaceholderPage title="Audit Logs" /></ProtectedRoute>} />
      
      {/* Analytics Routes */}
      <Route path="/analytics/hr-metrics" element={<ProtectedRoute><PlaceholderPage title="HR Metrics" /></ProtectedRoute>} />
      <Route path="/analytics/payroll" element={<ProtectedRoute><PlaceholderPage title="Payroll Analytics" /></ProtectedRoute>} />
      <Route path="/analytics/expenses" element={<ProtectedRoute><PlaceholderPage title="Expense Analytics" /></ProtectedRoute>} />
      <Route path="/analytics/cost-budget" element={<ProtectedRoute><PlaceholderPage title="Cost & Budget Reports" /></ProtectedRoute>} />
      <Route path="/analytics/custom-financial" element={<ProtectedRoute><PlaceholderPage title="Custom Financial Reports" /></ProtectedRoute>} />
      <Route path="/analytics/attendance" element={<ProtectedRoute><PlaceholderPage title="Attendance Reports" /></ProtectedRoute>} />
      <Route path="/analytics/attrition" element={<ProtectedRoute><PlaceholderPage title="Attrition Analysis" /></ProtectedRoute>} />
      <Route path="/analytics/custom" element={<ProtectedRoute><PlaceholderPage title="Custom Reports" /></ProtectedRoute>} />
      
      {/* Settings Routes */}
      <Route path="/settings/company" element={<ProtectedRoute><PlaceholderPage title="Company Settings" /></ProtectedRoute>} />
      <Route path="/settings/payroll" element={<ProtectedRoute><PlaceholderPage title="Payroll Settings" /></ProtectedRoute>} />
      <Route path="/settings/tax-statutory" element={<ProtectedRoute><PlaceholderPage title="Tax & Statutory Settings" /></ProtectedRoute>} />
      <Route path="/settings/roles" element={<ProtectedRoute><PlaceholderPage title="Roles & Permissions" /></ProtectedRoute>} />
      <Route path="/settings/security" element={<ProtectedRoute><PlaceholderPage title="Security Settings" /></ProtectedRoute>} />
      <Route path="/settings/integrations" element={<ProtectedRoute><PlaceholderPage title="Integrations" /></ProtectedRoute>} />
      <Route path="/settings/preferences" element={<ProtectedRoute><PlaceholderPage title="System Preferences" /></ProtectedRoute>} />
      
      {/* Auth Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;