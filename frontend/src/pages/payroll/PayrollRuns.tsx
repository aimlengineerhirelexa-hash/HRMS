import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, Play, Pause, Lock, Unlock, Download, Upload, Eye, 
  Calendar, Users, DollarSign, CheckCircle, XCircle, AlertTriangle,
  Clock, FileText, Settings, Filter, Search, MoreHorizontal,
  RefreshCw, Archive, Edit, Trash2, Send, Shield
} from 'lucide-react';

interface PayrollRun {
  _id: string;
  payrollPeriod: string;
  payrollType: 'regular' | 'off-cycle';
  payDate: string;
  startDate: string;
  endDate: string;
  employeeList: string[];
  includedEmployees: string[];
  excludedEmployees: string[];
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'approved' | 'processed' | 'locked';
  notes?: string;
  remarks?: string;
  processedBy?: string;
  approvedBy?: string;
  lockedBy?: string;
  processedAt?: string;
  approvedAt?: string;
  lockedAt?: string;
  bankAdviceGenerated: boolean;
  paymentFileGenerated: boolean;
  finalConfirmation: boolean;
  completionPercentage: number;
  createdDate: string;
}

interface Employee {
  _id: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  basicSalary: number;
  status: 'active' | 'inactive';
}

const PayrollRuns = () => {
  const [activeTab, setActiveTab] = useState('runs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);
  
  const [runForm, setRunForm] = useState({
    payrollPeriod: '',
    payrollType: 'regular' as 'regular' | 'off-cycle',
    payDate: '',
    startDate: '',
    endDate: '',
    notes: '',
    remarks: ''
  });

  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([
    {
      _id: '1',
      payrollPeriod: 'January 2024',
      payrollType: 'regular',
      payDate: '2024-01-31',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      employeeList: ['EMP001', 'EMP002', 'EMP003'],
      includedEmployees: ['EMP001', 'EMP002', 'EMP003'],
      excludedEmployees: [],
      totalEarnings: 15000000,
      totalDeductions: 3000000,
      netPay: 12000000,
      status: 'locked',
      notes: 'Regular monthly payroll',
      processedBy: 'HR Admin',
      approvedBy: 'Finance Manager',
      lockedBy: 'Finance Manager',
      processedAt: '2024-01-30T10:00:00Z',
      approvedAt: '2024-01-30T14:00:00Z',
      lockedAt: '2024-01-31T09:00:00Z',
      bankAdviceGenerated: true,
      paymentFileGenerated: true,
      finalConfirmation: true,
      completionPercentage: 100,
      createdDate: '2024-01-25'
    },
    {
      _id: '2',
      payrollPeriod: 'February 2024',
      payrollType: 'regular',
      payDate: '2024-02-29',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      employeeList: ['EMP001', 'EMP002', 'EMP003', 'EMP004'],
      includedEmployees: ['EMP001', 'EMP002', 'EMP003', 'EMP004'],
      excludedEmployees: [],
      totalEarnings: 16000000,
      totalDeductions: 3200000,
      netPay: 12800000,
      status: 'approved',
      notes: 'Regular monthly payroll with new joinee',
      processedBy: 'HR Admin',
      approvedBy: 'Finance Manager',
      processedAt: '2024-02-28T10:00:00Z',
      approvedAt: '2024-02-28T15:00:00Z',
      bankAdviceGenerated: true,
      paymentFileGenerated: false,
      finalConfirmation: false,
      completionPercentage: 85,
      createdDate: '2024-02-25'
    },
    {
      _id: '3',
      payrollPeriod: 'March 2024',
      payrollType: 'regular',
      payDate: '2024-03-31',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      employeeList: ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005'],
      includedEmployees: ['EMP001', 'EMP002', 'EMP003', 'EMP004'],
      excludedEmployees: ['EMP005'],
      totalEarnings: 17000000,
      totalDeductions: 3400000,
      netPay: 13600000,
      status: 'processed',
      notes: 'Regular monthly payroll',
      remarks: 'EMP005 excluded due to leave without pay',
      processedBy: 'HR Admin',
      processedAt: '2024-03-30T10:00:00Z',
      bankAdviceGenerated: false,
      paymentFileGenerated: false,
      finalConfirmation: false,
      completionPercentage: 75,
      createdDate: '2024-03-25'
    },
    {
      _id: '4',
      payrollPeriod: 'April 2024',
      payrollType: 'regular',
      payDate: '2024-04-30',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      employeeList: ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005', 'EMP006'],
      includedEmployees: ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005', 'EMP006'],
      excludedEmployees: [],
      totalEarnings: 18000000,
      totalDeductions: 3600000,
      netPay: 14400000,
      status: 'draft',
      notes: 'Regular monthly payroll with bonus',
      bankAdviceGenerated: false,
      paymentFileGenerated: false,
      finalConfirmation: false,
      completionPercentage: 25,
      createdDate: '2024-04-01'
    },
    {
      _id: '5',
      payrollPeriod: 'March 2024 - Bonus',
      payrollType: 'off-cycle',
      payDate: '2024-03-15',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      employeeList: ['EMP001', 'EMP002'],
      includedEmployees: ['EMP001', 'EMP002'],
      excludedEmployees: [],
      totalEarnings: 500000,
      totalDeductions: 50000,
      netPay: 450000,
      status: 'locked',
      notes: 'Performance bonus payout',
      processedBy: 'HR Manager',
      approvedBy: 'CEO',
      lockedBy: 'Finance Manager',
      processedAt: '2024-03-14T10:00:00Z',
      approvedAt: '2024-03-14T16:00:00Z',
      lockedAt: '2024-03-15T09:00:00Z',
      bankAdviceGenerated: true,
      paymentFileGenerated: true,
      finalConfirmation: true,
      completionPercentage: 100,
      createdDate: '2024-03-10'
    }
  ]);

  const [employees] = useState<Employee[]>([
    { _id: 'EMP001', name: 'John Doe', employeeId: 'EMP001', department: 'Engineering', designation: 'Senior Developer', basicSalary: 80000, status: 'active' },
    { _id: 'EMP002', name: 'Jane Smith', employeeId: 'EMP002', department: 'HR', designation: 'HR Manager', basicSalary: 90000, status: 'active' },
    { _id: 'EMP003', name: 'Mike Johnson', employeeId: 'EMP003', department: 'Finance', designation: 'Financial Analyst', basicSalary: 70000, status: 'active' },
    { _id: 'EMP004', name: 'Sarah Wilson', employeeId: 'EMP004', department: 'Engineering', designation: 'Developer', basicSalary: 75000, status: 'active' },
    { _id: 'EMP005', name: 'David Brown', employeeId: 'EMP005', department: 'Marketing', designation: 'Marketing Manager', basicSalary: 85000, status: 'active' },
    { _id: 'EMP006', name: 'Lisa Davis', employeeId: 'EMP006', department: 'Sales', designation: 'Sales Executive', basicSalary: 65000, status: 'active' }
  ]);

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault();
    const newRun: PayrollRun = {
      _id: Date.now().toString(),
      payrollPeriod: runForm.payrollPeriod,
      payrollType: runForm.payrollType,
      payDate: runForm.payDate,
      startDate: runForm.startDate,
      endDate: runForm.endDate,
      employeeList: employees.filter(e => e.status === 'active').map(e => e.employeeId),
      includedEmployees: employees.filter(e => e.status === 'active').map(e => e.employeeId),
      excludedEmployees: [],
      totalEarnings: 0,
      totalDeductions: 0,
      netPay: 0,
      status: 'draft',
      notes: runForm.notes,
      remarks: runForm.remarks,
      bankAdviceGenerated: false,
      paymentFileGenerated: false,
      finalConfirmation: false,
      completionPercentage: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setPayrollRuns([newRun, ...payrollRuns]);
    setIsDialogOpen(false);
    resetRunForm();
  };

  const resetRunForm = () => {
    setRunForm({
      payrollPeriod: '',
      payrollType: 'regular',
      payDate: '',
      startDate: '',
      endDate: '',
      notes: '',
      remarks: ''
    });
  };

  const updateRunStatus = (runId: string, newStatus: PayrollRun['status']) => {
    setPayrollRuns(payrollRuns.map(run => {
      if (run._id === runId) {
        const updatedRun = { ...run, status: newStatus };
        const now = new Date().toISOString();
        
        if (newStatus === 'processed') {
          updatedRun.processedBy = 'Current User';
          updatedRun.processedAt = now;
          updatedRun.completionPercentage = 75;
        } else if (newStatus === 'approved') {
          updatedRun.approvedBy = 'Current User';
          updatedRun.approvedAt = now;
          updatedRun.completionPercentage = 85;
        } else if (newStatus === 'locked') {
          updatedRun.lockedBy = 'Current User';
          updatedRun.lockedAt = now;
          updatedRun.completionPercentage = 100;
          updatedRun.finalConfirmation = true;
        }
        
        return updatedRun;
      }
      return run;
    }));
  };

  const generateBankAdvice = (runId: string) => {
    setPayrollRuns(payrollRuns.map(run => 
      run._id === runId ? { ...run, bankAdviceGenerated: true } : run
    ));
  };

  const generatePaymentFile = (runId: string) => {
    setPayrollRuns(payrollRuns.map(run => 
      run._id === runId ? { ...run, paymentFileGenerated: true } : run
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'bg-yellow-100 text-yellow-800 border-0',
      processed: 'bg-blue-100 text-blue-800 border-0',
      approved: 'bg-green-100 text-green-800 border-0',
      locked: 'bg-gray-100 text-gray-800 border-0',
      regular: 'bg-blue-100 text-blue-800 border-0',
      'off-cycle': 'bg-purple-100 text-purple-800 border-0'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      draft: Clock,
      processed: RefreshCw,
      approved: CheckCircle,
      locked: Lock
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const filteredRuns = payrollRuns.filter(run => {
    const matchesSearch = run.payrollPeriod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || run.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: 'Total Runs',
      value: payrollRuns.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Employees',
      value: employees.filter(e => e.status === 'active').length,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Monthly Net Pay',
      value: `₹${(payrollRuns.filter(r => r.payrollType === 'regular').reduce((sum, r) => sum + r.netPay, 0) / 10000000).toFixed(1)}Cr`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Pending Approvals',
      value: payrollRuns.filter(r => r.status === 'processed').length,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Locked Runs',
      value: payrollRuns.filter(r => r.status === 'locked').length,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Off-cycle Runs',
      value: payrollRuns.filter(r => r.payrollType === 'off-cycle').length,
      icon: RefreshCw,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Payroll Runs</h2>
          <p className="text-gray-600 mt-1">Process and manage monthly payroll runs with comprehensive controls</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />Import Data
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
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
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-xl p-2 shadow-sm border-0">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto gap-2">
            <TabsTrigger value="runs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Calendar className="h-4 w-4 mr-2" />Payroll Runs
            </TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Users className="h-4 w-4 mr-2" />Employee Management
            </TabsTrigger>
            <TabsTrigger value="processing" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Settings className="h-4 w-4 mr-2" />Processing Queue
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Payroll Runs Tab */}
        <TabsContent value="runs" className="space-y-6">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Payroll Runs</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search runs..." 
                      className="pl-10 w-64" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        <Plus className="h-4 w-4 mr-2" />New Payroll Run
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Payroll Run</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateRun} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="payrollPeriod">Payroll Period *</Label>
                            <Input 
                              id="payrollPeriod" 
                              value={runForm.payrollPeriod} 
                              onChange={(e) => setRunForm({...runForm, payrollPeriod: e.target.value})} 
                              placeholder="e.g., May 2024" 
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Payroll Type *</Label>
                            <Select 
                              value={runForm.payrollType} 
                              onValueChange={(value: 'regular' | 'off-cycle') => setRunForm({...runForm, payrollType: value})}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="regular">Regular</SelectItem>
                                <SelectItem value="off-cycle">Off-cycle</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date *</Label>
                            <Input 
                              id="startDate" 
                              type="date" 
                              value={runForm.startDate} 
                              onChange={(e) => setRunForm({...runForm, startDate: e.target.value})} 
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date *</Label>
                            <Input 
                              id="endDate" 
                              type="date" 
                              value={runForm.endDate} 
                              onChange={(e) => setRunForm({...runForm, endDate: e.target.value})} 
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="payDate">Pay Date *</Label>
                            <Input 
                              id="payDate" 
                              type="date" 
                              value={runForm.payDate} 
                              onChange={(e) => setRunForm({...runForm, payDate: e.target.value})} 
                              required 
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea 
                            id="notes" 
                            value={runForm.notes} 
                            onChange={(e) => setRunForm({...runForm, notes: e.target.value})} 
                            placeholder="Add any notes for this payroll run"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="remarks">Remarks</Label>
                          <Textarea 
                            id="remarks" 
                            value={runForm.remarks} 
                            onChange={(e) => setRunForm({...runForm, remarks: e.target.value})} 
                            placeholder="Add any special remarks or instructions"
                            rows={2}
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                            Create Payroll Run
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Period & Type</TableHead>
                      <TableHead className="font-semibold">Dates</TableHead>
                      <TableHead className="font-semibold">Employees</TableHead>
                      <TableHead className="font-semibold">Financials</TableHead>
                      <TableHead className="font-semibold">Progress</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRuns.map((run) => (
                      <TableRow key={run._id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{run.payrollPeriod}</div>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusBadge(run.payrollType)}
                              {run.notes && <span className="text-xs text-gray-500">• {run.notes.substring(0, 30)}...</span>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Start: {new Date(run.startDate).toLocaleDateString()}</div>
                            <div>End: {new Date(run.endDate).toLocaleDateString()}</div>
                            <div className="font-medium">Pay: {new Date(run.payDate).toLocaleDateString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{run.includedEmployees.length} included</div>
                            {run.excludedEmployees.length > 0 && (
                              <div className="text-red-600">{run.excludedEmployees.length} excluded</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Gross: ₹{(run.totalEarnings / 100000).toFixed(1)}L</div>
                            <div>Deductions: ₹{(run.totalDeductions / 100000).toFixed(1)}L</div>
                            <div className="font-medium text-green-600">Net: ₹{(run.netPay / 100000).toFixed(1)}L</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Progress value={run.completionPercentage} className="w-20 h-2" />
                            <span className="text-xs text-gray-500">{run.completionPercentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(run.status)}
                            {getStatusBadge(run.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {run.status === 'draft' && (
                              <Button size="sm" onClick={() => updateRunStatus(run._id, 'processed')} title="Process Run">
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            {run.status === 'processed' && (
                              <Button size="sm" onClick={() => updateRunStatus(run._id, 'approved')} title="Approve Run">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {run.status === 'approved' && (
                              <Button size="sm" onClick={() => updateRunStatus(run._id, 'locked')} title="Lock Run">
                                <Lock className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {run.status !== 'locked' && (
                              <Button variant="ghost" size="sm" title="Edit Run">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" title="More Options">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredRuns.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No payroll runs found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employee Management Tab */}
        <TabsContent value="employees" className="space-y-6">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Employee Inclusion/Exclusion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Active Employees ({employees.filter(e => e.status === 'active').length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {employees.filter(e => e.status === 'active').map((employee) => (
                      <div key={employee._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-600">{employee.employeeId} • {employee.department}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">₹{employee.basicSalary.toLocaleString()}</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Exclusion Rules & Notes</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Automatic Exclusions</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Employees on unpaid leave</li>
                        <li>• Terminated employees</li>
                        <li>• Employees with incomplete documentation</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Manual Exclusions</h4>
                      <p className="text-sm text-blue-700 mb-3">Add employees to exclude from this payroll run:</p>
                      <div className="space-y-2">
                        <Input placeholder="Search employee to exclude..." />
                        <Button size="sm" variant="outline" className="w-full">
                          Add to Exclusion List
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Processing Queue Tab */}
        <TabsContent value="processing" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Processing Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payrollRuns.filter(r => r.status !== 'locked').map((run) => (
                    <div key={run._id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{run.payrollPeriod}</h4>
                        {getStatusBadge(run.status)}
                      </div>
                      <div className="space-y-2">
                        <Progress value={run.completionPercentage} className="w-full h-2" />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{run.completionPercentage}% complete</span>
                          <span>{run.includedEmployees.length} employees</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {!run.bankAdviceGenerated && run.status === 'approved' && (
                          <Button size="sm" variant="outline" onClick={() => generateBankAdvice(run._id)}>
                            <FileText className="h-4 w-4 mr-1" />Bank Advice
                          </Button>
                        )}
                        {!run.paymentFileGenerated && run.status === 'approved' && (
                          <Button size="sm" variant="outline" onClick={() => generatePaymentFile(run._id)}>
                            <Download className="h-4 w-4 mr-1" />Payment File
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <RefreshCw className="h-4 w-4 mr-2" />Re-run Calculations
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />Bulk Export
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Send className="h-4 w-4 mr-2" />Send Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />Archive Old Runs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />Compliance Check
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollRuns;