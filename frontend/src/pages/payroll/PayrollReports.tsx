import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Download, FileText, Calendar, TrendingUp, TrendingDown, 
  BarChart3, PieChart, Filter, Search, Mail, Clock,
  DollarSign, Users, AlertTriangle, Target, RefreshCw,
  Eye, Settings, Archive, Send, Shield
} from 'lucide-react';

interface ReportData {
  _id: string;
  reportName: string;
  reportType: 'summary' | 'detailed' | 'variance' | 'compliance';
  period: string;
  generatedDate: string;
  status: 'generated' | 'scheduled' | 'failed';
  fileSize: string;
  downloadCount: number;
}

interface PayrollSummary {
  month: string;
  employees: number;
  grossPay: number;
  netPay: number;
  deductions: number;
  variance: number;
}

interface EmployeeReport {
  employeeId: string;
  name: string;
  department: string;
  designation: string;
  grossPay: number;
  netPay: number;
  deductions: number;
  taxDeducted: number;
}

interface ComplianceReport {
  component: string;
  type: 'PF' | 'ESI' | 'TDS' | 'PT';
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
  challanStatus: 'pending' | 'generated' | 'paid';
  dueDate: string;
}

const PayrollReports = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-04');
  const [reportType, setReportType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  
  const [scheduleForm, setScheduleForm] = useState({
    reportType: 'summary',
    frequency: 'monthly',
    recipients: '',
    format: 'pdf'
  });

  const monthlyData: PayrollSummary[] = [
    { month: 'January 2024', employees: 150, grossPay: 125000000, netPay: 110000000, deductions: 15000000, variance: 2.5 },
    { month: 'February 2024', employees: 152, grossPay: 128000000, netPay: 112000000, deductions: 16000000, variance: 1.8 },
    { month: 'March 2024', employees: 155, grossPay: 131000000, netPay: 115000000, deductions: 16000000, variance: 2.3 },
    { month: 'April 2024', employees: 158, grossPay: 134000000, netPay: 118000000, deductions: 16000000, variance: 2.9 }
  ];

  const employeeData: EmployeeReport[] = [
    { employeeId: 'EMP001', name: 'John Doe', department: 'IT', designation: 'Senior Developer', grossPay: 95000, netPay: 78000, deductions: 17000, taxDeducted: 12000 },
    { employeeId: 'EMP002', name: 'Jane Smith', department: 'HR', designation: 'HR Manager', grossPay: 105000, netPay: 86000, deductions: 19000, taxDeducted: 15000 },
    { employeeId: 'EMP003', name: 'Mike Johnson', department: 'Finance', designation: 'Financial Analyst', grossPay: 85000, netPay: 70000, deductions: 15000, taxDeducted: 10000 },
    { employeeId: 'EMP004', name: 'Sarah Wilson', department: 'Engineering', designation: 'Lead Engineer', grossPay: 110000, netPay: 90000, deductions: 20000, taxDeducted: 16000 },
    { employeeId: 'EMP005', name: 'David Brown', department: 'Marketing', designation: 'Marketing Manager', grossPay: 98000, netPay: 81000, deductions: 17000, taxDeducted: 13000 }
  ];

  const complianceData: ComplianceReport[] = [
    { component: 'Provident Fund', type: 'PF', employeeContribution: 1200000, employerContribution: 1200000, totalContribution: 2400000, challanStatus: 'paid', dueDate: '2024-04-15' },
    { component: 'Employee State Insurance', type: 'ESI', employeeContribution: 150000, employerContribution: 400000, totalContribution: 550000, challanStatus: 'generated', dueDate: '2024-04-21' },
    { component: 'Tax Deducted at Source', type: 'TDS', employeeContribution: 2500000, employerContribution: 0, totalContribution: 2500000, challanStatus: 'pending', dueDate: '2024-04-07' },
    { component: 'Professional Tax', type: 'PT', employeeContribution: 31600, employerContribution: 0, totalContribution: 31600, challanStatus: 'paid', dueDate: '2024-04-10' }
  ];

  const reportHistory: ReportData[] = [
    { _id: '1', reportName: 'Monthly Payroll Summary - April 2024', reportType: 'summary', period: '2024-04', generatedDate: '2024-04-30', status: 'generated', fileSize: '2.3 MB', downloadCount: 15 },
    { _id: '2', reportName: 'Employee Salary Report - April 2024', reportType: 'detailed', period: '2024-04', generatedDate: '2024-04-30', status: 'generated', fileSize: '5.7 MB', downloadCount: 8 },
    { _id: '3', reportName: 'Payroll Variance Report - Q1 2024', reportType: 'variance', period: '2024-Q1', generatedDate: '2024-03-31', status: 'generated', fileSize: '1.8 MB', downloadCount: 12 },
    { _id: '4', reportName: 'PF Compliance Report - March 2024', reportType: 'compliance', period: '2024-03', generatedDate: '2024-03-31', status: 'generated', fileSize: '890 KB', downloadCount: 6 },
    { _id: '5', reportName: 'Bank Payment Summary - April 2024', reportType: 'summary', period: '2024-04', generatedDate: '2024-04-29', status: 'scheduled', fileSize: '-', downloadCount: 0 }
  ];

  const handleScheduleReport = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Scheduling report:', scheduleForm);
    setIsScheduleDialogOpen(false);
    resetScheduleForm();
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      reportType: 'summary',
      frequency: 'monthly',
      recipients: '',
      format: 'pdf'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      generated: 'bg-green-100 text-green-800 border-0',
      scheduled: 'bg-blue-100 text-blue-800 border-0',
      failed: 'bg-red-100 text-red-800 border-0',
      paid: 'bg-green-100 text-green-800 border-0',
      pending: 'bg-yellow-100 text-yellow-800 border-0',
      summary: 'bg-blue-100 text-blue-800 border-0',
      detailed: 'bg-purple-100 text-purple-800 border-0',
      variance: 'bg-orange-100 text-orange-800 border-0',
      compliance: 'bg-emerald-100 text-emerald-800 border-0'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const filteredReports = reportHistory.filter(report => {
    const matchesSearch = report.reportName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = reportType === 'all' || report.reportType === reportType;
    return matchesSearch && matchesType;
  });


  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Payroll Reports</h2>
          <p className="text-gray-600 mt-1">Comprehensive reporting and analytics for payroll data</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Automated Report</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleScheduleReport} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select value={scheduleForm.reportType} onValueChange={(value) => setScheduleForm({...scheduleForm, reportType: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Payroll Summary</SelectItem>
                        <SelectItem value="detailed">Detailed Report</SelectItem>
                        <SelectItem value="variance">Variance Report</SelectItem>
                        <SelectItem value="compliance">Compliance Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={scheduleForm.frequency} onValueChange={(value) => setScheduleForm({...scheduleForm, frequency: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Recipients</Label>
                  <Input 
                    value={scheduleForm.recipients} 
                    onChange={(e) => setScheduleForm({...scheduleForm, recipients: e.target.value})} 
                    placeholder="email1@company.com, email2@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select value={scheduleForm.format} onValueChange={(value) => setScheduleForm({...scheduleForm, format: value})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <Download className="h-4 w-4 mr-2" />Generate Report
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-xl p-2 shadow-sm border-0">
          <TabsList className="grid w-full grid-cols-4 bg-transparent p-0 h-auto gap-2">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <BarChart3 className="h-4 w-4 mr-2" />Dashboard
            </TabsTrigger>
            <TabsTrigger value="summary" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <PieChart className="h-4 w-4 mr-2" />Summary
            </TabsTrigger>
            <TabsTrigger value="employee" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Users className="h-4 w-4 mr-2" />Employee
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Archive className="h-4 w-4 mr-2" />History
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.slice(-3).map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{data.month}</div>
                        <div className="text-sm text-gray-600">{data.employees} employees</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">₹{(data.netPay / 10000000).toFixed(1)}Cr</div>
                        <div className={`text-sm flex items-center ${
                          data.variance > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {data.variance > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                          {Math.abs(data.variance)}%
                        </div>
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
                  <Download className="h-4 w-4 mr-2" />Monthly Summary Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />Employee Salary Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />Variance Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />Bank Transfer Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />Compliance Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Send className="h-4 w-4 mr-2" />Email Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Summary Reports Tab */}
        <TabsContent value="summary" className="space-y-6">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Monthly Payroll Summary</CardTitle>
              <div className="flex items-center gap-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-04">April 2024</SelectItem>
                    <SelectItem value="2024-03">March 2024</SelectItem>
                    <SelectItem value="2024-02">February 2024</SelectItem>
                    <SelectItem value="2024-01">January 2024</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Month</TableHead>
                    <TableHead className="font-semibold">Employees</TableHead>
                    <TableHead className="font-semibold">Gross Pay</TableHead>
                    <TableHead className="font-semibold">Deductions</TableHead>
                    <TableHead className="font-semibold">Net Pay</TableHead>
                    <TableHead className="font-semibold">Variance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyData.map((data, index) => (
                    <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{data.month}</TableCell>
                      <TableCell>{data.employees}</TableCell>
                      <TableCell>₹{(data.grossPay / 10000000).toFixed(1)}Cr</TableCell>
                      <TableCell>₹{(data.deductions / 10000000).toFixed(1)}Cr</TableCell>
                      <TableCell className="font-semibold text-green-600">₹{(data.netPay / 10000000).toFixed(1)}Cr</TableCell>
                      <TableCell>
                        <div className={`flex items-center ${
                          data.variance > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {data.variance > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                          {Math.abs(data.variance)}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employee Reports Tab */}
        <TabsContent value="employee" className="space-y-6">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Employee-wise Payroll Details</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search employees..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Employee</TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Designation</TableHead>
                    <TableHead className="font-semibold">Gross Pay</TableHead>
                    <TableHead className="font-semibold">Deductions</TableHead>
                    <TableHead className="font-semibold">Tax Deducted</TableHead>
                    <TableHead className="font-semibold">Net Pay</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeData.map((employee) => (
                    <TableRow key={employee.employeeId} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.employeeId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.designation}</TableCell>
                      <TableCell>₹{employee.grossPay.toLocaleString()}</TableCell>
                      <TableCell>₹{employee.deductions.toLocaleString()}</TableCell>
                      <TableCell>₹{employee.taxDeducted.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-green-600">₹{employee.netPay.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Report History</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search reports..." 
                      className="pl-10 w-64" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="variance">Variance</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Report Name</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Period</TableHead>
                    <TableHead className="font-semibold">Generated</TableHead>
                    <TableHead className="font-semibold">Size</TableHead>
                    <TableHead className="font-semibold">Downloads</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{report.reportName}</TableCell>
                      <TableCell>{getStatusBadge(report.reportType)}</TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>{new Date(report.generatedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{report.fileSize}</TableCell>
                      <TableCell>{report.downloadCount}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {report.status === 'generated' && (
                            <Button variant="ghost" size="sm" title="Download Report">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" title="View Report">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Send via Email">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollReports;