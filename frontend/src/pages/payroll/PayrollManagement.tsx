import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  DollarSign, Calendar, FileText, TrendingUp, TrendingDown, Plus, Play, Download, Eye, 
  Settings, Users, CheckCircle, XCircle, Calculator, AlertTriangle, Clock, Target, 
  BarChart3, PieChart, Filter, Search, Mail, Bell, Zap, Shield, Archive, Edit, Trash2 
} from 'lucide-react';

interface SalaryComponent {
  _id: string;
  name: string;
  type: 'earning' | 'deduction';
  calculationType: 'fixed' | 'percentage';
  amount: number;
  percentage?: number;
  taxable: boolean;
  mandatory: boolean;
  effectiveDate: string;
  status: 'active' | 'inactive';
}

interface PayrollRun {
  _id: string;
  period: string;
  startDate: string;
  endDate: string;
  employees: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  status: 'draft' | 'processing' | 'processed' | 'approved' | 'locked';
  createdDate: string;
  processedBy?: string;
  approvedBy?: string;
  completionPercentage: number;
}

interface Payslip {
  _id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  period: string;
  basicSalary: number;
  earnings: { component: string; amount: number }[];
  deductions: { component: string; amount: number }[];
  grossPay: number;
  netPay: number;
  status: 'generated' | 'sent' | 'downloaded' | 'acknowledged';
  generatedDate: string;
  sentDate?: string;
}

interface PayrollApproval {
  _id: string;
  runId: string;
  period: string;
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  priority: 'low' | 'medium' | 'high';
}

interface PayrollAlert {
  _id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  date: string;
  resolved: boolean;
}

const PayrollManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [salaryComponents] = useState<SalaryComponent[]>([
    { _id: '1', name: 'Basic Salary', type: 'earning', calculationType: 'fixed', amount: 50000, taxable: true, mandatory: true, effectiveDate: '2024-01-01', status: 'active' },
    { _id: '2', name: 'HRA', type: 'earning', calculationType: 'percentage', amount: 0, percentage: 40, taxable: true, mandatory: true, effectiveDate: '2024-01-01', status: 'active' },
    { _id: '3', name: 'Transport Allowance', type: 'earning', calculationType: 'fixed', amount: 3000, taxable: false, mandatory: false, effectiveDate: '2024-01-01', status: 'active' },
    { _id: '4', name: 'Medical Allowance', type: 'earning', calculationType: 'fixed', amount: 2500, taxable: false, mandatory: false, effectiveDate: '2024-01-01', status: 'active' },
    { _id: '5', name: 'PF Contribution', type: 'deduction', calculationType: 'percentage', amount: 0, percentage: 12, taxable: false, mandatory: true, effectiveDate: '2024-01-01', status: 'active' },
    { _id: '6', name: 'ESI Contribution', type: 'deduction', calculationType: 'percentage', amount: 0, percentage: 0.75, taxable: false, mandatory: true, effectiveDate: '2024-01-01', status: 'active' },
    { _id: '7', name: 'Professional Tax', type: 'deduction', calculationType: 'fixed', amount: 200, taxable: false, mandatory: true, effectiveDate: '2024-01-01', status: 'active' },
    { _id: '8', name: 'Income Tax', type: 'deduction', calculationType: 'percentage', amount: 0, percentage: 10, taxable: false, mandatory: true, effectiveDate: '2024-01-01', status: 'active' }
  ]);
  
  const [payrollRuns] = useState<PayrollRun[]>([
    { _id: '1', period: 'January 2024', startDate: '2024-01-01', endDate: '2024-01-31', employees: 150, totalGross: 12500000, totalDeductions: 2500000, totalNet: 10000000, status: 'locked', createdDate: '2024-01-25', processedBy: 'HR Admin', approvedBy: 'Finance Manager', completionPercentage: 100 },
    { _id: '2', period: 'February 2024', startDate: '2024-02-01', endDate: '2024-02-29', employees: 152, totalGross: 12800000, totalDeductions: 2600000, totalNet: 10200000, status: 'approved', createdDate: '2024-02-25', processedBy: 'HR Admin', approvedBy: 'Finance Manager', completionPercentage: 100 },
    { _id: '3', period: 'March 2024', startDate: '2024-03-01', endDate: '2024-03-31', employees: 155, totalGross: 13100000, totalDeductions: 2700000, totalNet: 10400000, status: 'processing', createdDate: '2024-03-25', completionPercentage: 75 },
    { _id: '4', period: 'April 2024', startDate: '2024-04-01', endDate: '2024-04-30', employees: 158, totalGross: 13400000, totalDeductions: 2800000, totalNet: 10600000, status: 'draft', createdDate: '2024-04-01', completionPercentage: 0 }
  ]);
  
  const [payslips] = useState<Payslip[]>([
    { _id: '1', employeeId: 'EMP001', employeeName: 'John Doe', department: 'Engineering', designation: 'Senior Developer', period: 'March 2024', basicSalary: 50000, earnings: [{ component: 'HRA', amount: 20000 }, { component: 'Transport', amount: 3000 }, { component: 'Medical', amount: 2500 }], deductions: [{ component: 'PF', amount: 6000 }, { component: 'ESI', amount: 563 }, { component: 'Tax', amount: 7500 }], grossPay: 75500, netPay: 61437, status: 'sent', generatedDate: '2024-03-31', sentDate: '2024-04-01' },
    { _id: '2', employeeId: 'EMP002', employeeName: 'Jane Smith', department: 'HR', designation: 'HR Manager', period: 'March 2024', basicSalary: 60000, earnings: [{ component: 'HRA', amount: 24000 }, { component: 'Transport', amount: 3000 }, { component: 'Medical', amount: 2500 }], deductions: [{ component: 'PF', amount: 7200 }, { component: 'ESI', amount: 675 }, { component: 'Tax', amount: 9000 }], grossPay: 89500, netPay: 72625, status: 'acknowledged', generatedDate: '2024-03-31', sentDate: '2024-04-01' },
    { _id: '3', employeeId: 'EMP003', employeeName: 'Mike Johnson', department: 'Finance', designation: 'Financial Analyst', period: 'March 2024', basicSalary: 45000, earnings: [{ component: 'HRA', amount: 18000 }, { component: 'Transport', amount: 3000 }], deductions: [{ component: 'PF', amount: 5400 }, { component: 'ESI', amount: 495 }, { component: 'Tax', amount: 6000 }], grossPay: 66000, netPay: 54105, status: 'generated', generatedDate: '2024-03-31' }
  ]);

  const [approvals] = useState<PayrollApproval[]>([
    { _id: '1', runId: '3', period: 'March 2024', requestedBy: 'HR Manager', requestDate: '2024-03-30', status: 'pending', priority: 'high' },
    { _id: '2', runId: '4', period: 'April 2024', requestedBy: 'HR Admin', requestDate: '2024-04-01', status: 'pending', priority: 'medium' }
  ]);

  const [alerts] = useState<PayrollAlert[]>([
    { _id: '1', type: 'warning', title: 'Pending Approvals', message: '2 payroll runs require approval', date: '2024-04-01', resolved: false },
    { _id: '2', type: 'error', title: 'Tax Calculation Error', message: 'Income tax calculation failed for 3 employees', date: '2024-03-31', resolved: false },
    { _id: '3', type: 'info', title: 'Payslip Generation Complete', message: 'All payslips for March 2024 generated successfully', date: '2024-03-31', resolved: true }
  ]);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-0',
      inactive: 'bg-gray-100 text-gray-800 border-0',
      draft: 'bg-yellow-100 text-yellow-800 border-0',
      processing: 'bg-blue-100 text-blue-800 border-0',
      processed: 'bg-green-100 text-green-800 border-0',
      approved: 'bg-green-100 text-green-800 border-0',
      locked: 'bg-gray-100 text-gray-800 border-0',
      generated: 'bg-blue-100 text-blue-800 border-0',
      sent: 'bg-green-100 text-green-800 border-0',
      downloaded: 'bg-purple-100 text-purple-800 border-0',
      acknowledged: 'bg-emerald-100 text-emerald-800 border-0',
      pending: 'bg-yellow-100 text-yellow-800 border-0',
      rejected: 'bg-red-100 text-red-800 border-0',
      high: 'bg-red-100 text-red-800 border-0',
      medium: 'bg-yellow-100 text-yellow-800 border-0',
      low: 'bg-green-100 text-green-800 border-0'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const stats = [
    { title: 'Total Employees', value: payrollRuns[payrollRuns.length - 1]?.employees || 0, icon: Users, color: 'text-blue-600', trend: '+3.2%' },
    { title: 'Monthly Gross', value: `₹${(payrollRuns[payrollRuns.length - 1]?.totalGross / 100000 || 0).toFixed(1)}L`, icon: DollarSign, color: 'text-green-600', trend: '+5.1%' },
    { title: 'Active Components', value: salaryComponents.filter(c => c.status === 'active').length, icon: Settings, color: 'text-purple-600', trend: '+2' },
    { title: 'Pending Approvals', value: approvals.filter(a => a.status === 'pending').length, icon: AlertTriangle, color: 'text-orange-600', trend: '2 urgent' },
    { title: 'Payslips Generated', value: payslips.length, icon: FileText, color: 'text-indigo-600', trend: '100%' },
    { title: 'Processing Time', value: '2.3 hrs', icon: Clock, color: 'text-teal-600', trend: '-15%' }
  ];

  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = payslip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payslip.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payslip.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Payroll Management</h2>
          <p className="text-gray-600 mt-1">Comprehensive payroll processing and salary management system</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
            <Zap className="h-4 w-4 mr-2" />Quick Process
          </Button>
          <Button variant="outline" className="border-gray-300">
            <Bell className="h-4 w-4 mr-2" />Notifications
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-green-600">{stat.trend}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alert Banner */}
      {alerts.filter(a => !a.resolved).length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Action Required</p>
                  <p className="text-sm text-yellow-700">{alerts.filter(a => !a.resolved).length} pending alerts require attention</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-xl p-2 shadow-sm border-0">
          <TabsList className="grid w-full grid-cols-6 bg-transparent p-0 h-auto gap-2">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <BarChart3 className="h-4 w-4 mr-2" />Dashboard
            </TabsTrigger>
            <TabsTrigger value="salary-structure" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Settings className="h-4 w-4 mr-2" />Components
            </TabsTrigger>
            <TabsTrigger value="payroll-runs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Calculator className="h-4 w-4 mr-2" />Payroll Runs
            </TabsTrigger>
            <TabsTrigger value="payslips" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <FileText className="h-4 w-4 mr-2" />Payslips
            </TabsTrigger>
            <TabsTrigger value="approvals" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <CheckCircle className="h-4 w-4 mr-2" />Approvals
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <PieChart className="h-4 w-4 mr-2" />Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Activity */}
            <Card className="lg:col-span-2 bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Payroll Activity</CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payrollRuns.slice(0, 4).map((run) => (
                    <div key={run._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{run.period}</p>
                          <p className="text-sm text-gray-600">{run.employees} employees • ₹{(run.totalNet / 100000).toFixed(1)}L</p>
                          {run.completionPercentage < 100 && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2">
                                <Progress value={run.completionPercentage} className="w-24 h-2" />
                                <span className="text-xs text-gray-500">{run.completionPercentage}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(run.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions & System Health */}
            <div className="space-y-6">
              <Card className="bg-white shadow-sm border-0 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Plus className="h-4 w-4 mr-2" />New Payroll Run
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />Bulk Download
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />Send Payslips
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />Compliance Check
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm border-0 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">System Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.filter(a => !a.resolved).slice(0, 3).map((alert) => (
                      <div key={alert._id} className={`p-3 rounded-lg border ${
                        alert.type === 'error' ? 'bg-red-50 border-red-200' :
                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                            alert.type === 'error' ? 'text-red-600' :
                            alert.type === 'warning' ? 'text-yellow-600' :
                            'text-blue-600'
                          }`} />
                          <div className="flex-1">
                            <p className={`font-medium text-sm ${
                              alert.type === 'error' ? 'text-red-800' :
                              alert.type === 'warning' ? 'text-yellow-800' :
                              'text-blue-800'
                            }`}>{alert.title}</p>
                            <p className={`text-xs ${
                              alert.type === 'error' ? 'text-red-600' :
                              alert.type === 'warning' ? 'text-yellow-600' :
                              'text-blue-600'
                            }`}>{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Salary Structure Tab */}
        <TabsContent value="salary-structure" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Component Categories */}
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <div className="p-2 rounded-lg bg-green-100">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Earnings</p>
                    <p className="text-lg font-semibold text-gray-900">{salaryComponents.filter(c => c.type === 'earning' && c.status === 'active').length}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                  <div className="p-2 rounded-lg bg-red-100">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Deductions</p>
                    <p className="text-lg font-semibold text-gray-900">{salaryComponents.filter(c => c.type === 'deduction' && c.status === 'active').length}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mandatory</p>
                    <p className="text-lg font-semibold text-gray-900">{salaryComponents.filter(c => c.mandatory && c.status === 'active').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Components Table */}
            <Card className="lg:col-span-3 bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">Salary Components</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input placeholder="Search components..." className="pl-10 w-64" />
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <Plus className="h-4 w-4 mr-2" />Add Component
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount/Rate</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {salaryComponents.map((component) => (
                        <tr key={component._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{component.name}</div>
                              <div className="text-xs text-gray-500">Effective: {new Date(component.effectiveDate).toLocaleDateString()}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={component.type === 'earning' ? 'bg-green-100 text-green-800 border-0' : 'bg-red-100 text-red-800 border-0'}>
                              {component.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {component.calculationType === 'fixed' ? `₹${component.amount.toLocaleString()}` : `${component.percentage}%`}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              {component.taxable && <Badge variant="outline" className="text-xs">Taxable</Badge>}
                              {component.mandatory && <Badge variant="outline" className="text-xs">Mandatory</Badge>}
                            </div>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(component.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payslips Tab */}
        <TabsContent value="payslips" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Filters & Actions */}
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Filters & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Search Employee</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Name or ID..." 
                      className="pl-10" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Filter by Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="generated">Generated</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="downloaded">Downloaded</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4 space-y-2">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Plus className="h-4 w-4 mr-2" />Generate Payslips
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />Bulk Download
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />Send All
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Archive className="h-4 w-4 mr-2" />Archive Old
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payslips Table */}
            <Card className="lg:col-span-3 bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Employee Payslips</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{filteredPayslips.length} payslips</Badge>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />More Filters
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPayslips.map((payslip) => (
                        <tr key={payslip._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {payslip.employeeName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{payslip.employeeName}</div>
                                <div className="text-xs text-gray-500">{payslip.employeeId} • {payslip.designation}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{payslip.department}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{payslip.period}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{payslip.grossPay.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm font-bold text-green-600">₹{payslip.netPay.toLocaleString()}</td>
                          <td className="px-6 py-4">{getStatusBadge(payslip.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" title="View Payslip">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Download PDF">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Send Email">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredPayslips.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No payslips found matching your criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Employees:</span>
                    <span className="font-semibold text-gray-900">158</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Gross Payroll:</span>
                    <span className="font-semibold text-gray-900">₹134L</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Deductions:</span>
                    <span className="font-semibold text-gray-900">₹28L</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-700 font-medium">Net Payroll:</span>
                    <span className="font-bold text-green-800">₹106L</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />Payroll Summary Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />Employee Salary Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calculator className="h-4 w-4 mr-2" />Tax Deduction Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Target className="h-4 w-4 mr-2" />Bank Transfer Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />Compliance Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollManagement;