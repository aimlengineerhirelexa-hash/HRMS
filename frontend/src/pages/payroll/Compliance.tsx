import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, Download, Upload, Calendar, AlertTriangle, CheckCircle, 
  XCircle, Clock, FileText, DollarSign, Users, TrendingUp,
  Search, Filter, Eye, Edit, RefreshCw, Send, Archive,
  Calculator, Target, BarChart3, PieChart
} from 'lucide-react';

interface ComplianceRecord {
  _id: string;
  payrollRunId: string;
  period: string;
  pfApplicability: boolean;
  esiApplicability: boolean;
  pfCalculation: {
    employeeContribution: number;
    employerContribution: number;
    totalContribution: number;
  };
  esiCalculation: {
    employeeContribution: number;
    employerContribution: number;
    totalContribution: number;
  };
  challanGenerated: boolean;
  challanNumber?: string;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  filingPeriod: string;
  complianceSummary: {
    totalEmployees: number;
    pfEligibleEmployees: number;
    esiEligibleEmployees: number;
  };
  dueDate: string;
  filedDate?: string;
}

interface ChallanRecord {
  _id: string;
  challanNumber: string;
  type: 'PF' | 'ESI';
  period: string;
  amount: number;
  dueDate: string;
  generatedDate: string;
  paymentDate?: string;
  status: 'generated' | 'paid' | 'overdue';
  bankReference?: string;
}

const Compliance = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-04');
  const [isChallanDialogOpen, setIsChallanDialogOpen] = useState(false);
  
  const [challanForm, setChallanForm] = useState({
    type: 'PF' as 'PF' | 'ESI',
    period: '',
    dueDate: '',
    amount: ''
  });

  const [complianceRecords] = useState<ComplianceRecord[]>([
    {
      _id: '1',
      payrollRunId: 'PR001',
      period: 'April 2024',
      pfApplicability: true,
      esiApplicability: true,
      pfCalculation: {
        employeeContribution: 1200000,
        employerContribution: 1200000,
        totalContribution: 2400000
      },
      esiCalculation: {
        employeeContribution: 150000,
        employerContribution: 400000,
        totalContribution: 550000
      },
      challanGenerated: true,
      challanNumber: 'PF240415001',
      paymentStatus: 'paid',
      filingPeriod: '2024-04',
      complianceSummary: {
        totalEmployees: 158,
        pfEligibleEmployees: 145,
        esiEligibleEmployees: 89
      },
      dueDate: '2024-05-15',
      filedDate: '2024-05-10'
    },
    {
      _id: '2',
      payrollRunId: 'PR002',
      period: 'March 2024',
      pfApplicability: true,
      esiApplicability: true,
      pfCalculation: {
        employeeContribution: 1150000,
        employerContribution: 1150000,
        totalContribution: 2300000
      },
      esiCalculation: {
        employeeContribution: 140000,
        employerContribution: 380000,
        totalContribution: 520000
      },
      challanGenerated: true,
      challanNumber: 'PF240315001',
      paymentStatus: 'paid',
      filingPeriod: '2024-03',
      complianceSummary: {
        totalEmployees: 155,
        pfEligibleEmployees: 142,
        esiEligibleEmployees: 85
      },
      dueDate: '2024-04-15',
      filedDate: '2024-04-12'
    },
    {
      _id: '3',
      payrollRunId: 'PR003',
      period: 'May 2024',
      pfApplicability: true,
      esiApplicability: true,
      pfCalculation: {
        employeeContribution: 1250000,
        employerContribution: 1250000,
        totalContribution: 2500000
      },
      esiCalculation: {
        employeeContribution: 160000,
        employerContribution: 420000,
        totalContribution: 580000
      },
      challanGenerated: false,
      paymentStatus: 'pending',
      filingPeriod: '2024-05',
      complianceSummary: {
        totalEmployees: 162,
        pfEligibleEmployees: 148,
        esiEligibleEmployees: 92
      },
      dueDate: '2024-06-15'
    }
  ]);

  const [challanRecords] = useState<ChallanRecord[]>([
    {
      _id: '1',
      challanNumber: 'PF240415001',
      type: 'PF',
      period: 'April 2024',
      amount: 2400000,
      dueDate: '2024-05-15',
      generatedDate: '2024-05-01',
      paymentDate: '2024-05-10',
      status: 'paid',
      bankReference: 'TXN123456789'
    },
    {
      _id: '2',
      challanNumber: 'ESI240421001',
      type: 'ESI',
      period: 'April 2024',
      amount: 550000,
      dueDate: '2024-05-21',
      generatedDate: '2024-05-01',
      paymentDate: '2024-05-18',
      status: 'paid',
      bankReference: 'TXN987654321'
    },
    {
      _id: '3',
      challanNumber: 'PF240315001',
      type: 'PF',
      period: 'March 2024',
      amount: 2300000,
      dueDate: '2024-04-15',
      generatedDate: '2024-04-01',
      paymentDate: '2024-04-12',
      status: 'paid',
      bankReference: 'TXN456789123'
    },
    {
      _id: '4',
      challanNumber: 'PF240515001',
      type: 'PF',
      period: 'May 2024',
      amount: 2500000,
      dueDate: '2024-06-15',
      generatedDate: '2024-06-01',
      status: 'generated'
    },
    {
      _id: '5',
      challanNumber: 'ESI240521001',
      type: 'ESI',
      period: 'May 2024',
      amount: 580000,
      dueDate: '2024-06-21',
      generatedDate: '2024-06-01',
      status: 'overdue'
    }
  ]);

  const handleGenerateChallan = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Generating challan:', challanForm);
    setIsChallanDialogOpen(false);
    resetChallanForm();
  };

  const resetChallanForm = () => {
    setChallanForm({
      type: 'PF',
      period: '',
      dueDate: '',
      amount: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-green-100 text-green-800 border-0',
      pending: 'bg-yellow-100 text-yellow-800 border-0',
      overdue: 'bg-red-100 text-red-800 border-0',
      generated: 'bg-blue-100 text-blue-800 border-0',
      PF: 'bg-purple-100 text-purple-800 border-0',
      ESI: 'bg-indigo-100 text-indigo-800 border-0'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      paid: CheckCircle,
      pending: Clock,
      overdue: AlertTriangle,
      generated: FileText
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    const colors = {
      paid: 'text-green-600',
      pending: 'text-yellow-600',
      overdue: 'text-red-600',
      generated: 'text-blue-600'
    };
    return <Icon className={`h-4 w-4 ${colors[status as keyof typeof colors]}`} />;
  };

  const filteredRecords = complianceRecords.filter(record => {
    const matchesSearch = record.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: 'Total Compliance Records',
      value: complianceRecords.length,
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'PF Eligible Employees',
      value: complianceRecords[0]?.complianceSummary.pfEligibleEmployees || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'ESI Eligible Employees',
      value: complianceRecords[0]?.complianceSummary.esiEligibleEmployees || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Monthly PF Contribution',
      value: `₹${((complianceRecords[0]?.pfCalculation.totalContribution || 0) / 100000).toFixed(1)}L`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Monthly ESI Contribution',
      value: `₹${((complianceRecords[0]?.esiCalculation.totalContribution || 0) / 100000).toFixed(1)}L`,
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Pending Payments',
      value: challanRecords.filter(c => c.status === 'pending' || c.status === 'overdue').length,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Compliance Management</h2>
          <p className="text-gray-600 mt-1">Manage PF, ESI, and statutory compliance requirements</p>
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
          <TabsList className="grid w-full grid-cols-4 bg-transparent p-0 h-auto gap-2">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <BarChart3 className="h-4 w-4 mr-2" />Dashboard
            </TabsTrigger>
            <TabsTrigger value="pf-esi" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Shield className="h-4 w-4 mr-2" />PF & ESI
            </TabsTrigger>
            <TabsTrigger value="challans" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <FileText className="h-4 w-4 mr-2" />Challans
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <PieChart className="h-4 w-4 mr-2" />Reports
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Compliance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-medium text-green-800">PF Compliance</h3>
                        <p className="text-sm text-green-600">All payments up to date</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-800">100%</p>
                      <p className="text-sm text-green-600">Compliant</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-8 w-8 text-yellow-600" />
                      <div>
                        <h3 className="font-medium text-yellow-800">ESI Compliance</h3>
                        <p className="text-sm text-yellow-600">1 payment overdue</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-800">95%</p>
                      <p className="text-sm text-yellow-600">Compliant</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Clock className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-blue-800">Upcoming Deadlines</h3>
                        <p className="text-sm text-blue-600">2 payments due this month</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-800">2</p>
                      <p className="text-sm text-blue-600">Due Soon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog open={isChallanDialogOpen} onOpenChange={setIsChallanDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <FileText className="h-4 w-4 mr-2" />Generate Challan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate Compliance Challan</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleGenerateChallan} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Challan Type</Label>
                          <Select value={challanForm.type} onValueChange={(value: 'PF' | 'ESI') => setChallanForm({...challanForm, type: value})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PF">Provident Fund</SelectItem>
                              <SelectItem value="ESI">Employee State Insurance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Period</Label>
                          <Input 
                            value={challanForm.period} 
                            onChange={(e) => setChallanForm({...challanForm, period: e.target.value})} 
                            placeholder="e.g., May 2024"
                            required 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Due Date</Label>
                          <Input 
                            type="date"
                            value={challanForm.dueDate} 
                            onChange={(e) => setChallanForm({...challanForm, dueDate: e.target.value})} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Amount (₹)</Label>
                          <Input 
                            type="number"
                            value={challanForm.amount} 
                            onChange={(e) => setChallanForm({...challanForm, amount: e.target.value})} 
                            required 
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">Generate Challan</Button>
                        <Button type="button" variant="outline" onClick={() => setIsChallanDialogOpen(false)} className="flex-1">Cancel</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="w-full justify-start">
                  <Calculator className="h-4 w-4 mr-2" />Calculate Contributions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />Download Forms
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Send className="h-4 w-4 mr-2" />Submit Returns
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />Sync with Portal
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />Compliance Check
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PF & ESI Tab */}
        <TabsContent value="pf-esi" className="space-y-6">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg font-semibold text-gray-900">PF & ESI Compliance Records</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search records..." 
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
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Period</TableHead>
                    <TableHead className="font-semibold">PF Contribution</TableHead>
                    <TableHead className="font-semibold">ESI Contribution</TableHead>
                    <TableHead className="font-semibold">Employees</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{record.period}</div>
                          <div className="text-sm text-gray-500">Filing: {record.filingPeriod}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Employee: ₹{(record.pfCalculation.employeeContribution / 100000).toFixed(1)}L</div>
                          <div>Employer: ₹{(record.pfCalculation.employerContribution / 100000).toFixed(1)}L</div>
                          <div className="font-medium">Total: ₹{(record.pfCalculation.totalContribution / 100000).toFixed(1)}L</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Employee: ₹{(record.esiCalculation.employeeContribution / 100000).toFixed(1)}L</div>
                          <div>Employer: ₹{(record.esiCalculation.employerContribution / 100000).toFixed(1)}L</div>
                          <div className="font-medium">Total: ₹{(record.esiCalculation.totalContribution / 100000).toFixed(1)}L</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Total: {record.complianceSummary.totalEmployees}</div>
                          <div>PF: {record.complianceSummary.pfEligibleEmployees}</div>
                          <div>ESI: {record.complianceSummary.esiEligibleEmployees}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(record.dueDate).toLocaleDateString()}</div>
                          {record.filedDate && (
                            <div className="text-green-600">Filed: {new Date(record.filedDate).toLocaleDateString()}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.paymentStatus)}
                          {getStatusBadge(record.paymentStatus)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!record.challanGenerated && (
                            <Button variant="ghost" size="sm" title="Generate Challan">
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                          {record.challanGenerated && (
                            <Button variant="ghost" size="sm" title="Download Challan">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challans Tab */}
        <TabsContent value="challans" className="space-y-6">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Challan Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Challan Number</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Period</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold">Payment Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {challanRecords.map((challan) => (
                    <TableRow key={challan._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{challan.challanNumber}</div>
                          <div className="text-sm text-gray-500">Generated: {new Date(challan.generatedDate).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(challan.type)}</TableCell>
                      <TableCell>{challan.period}</TableCell>
                      <TableCell className="font-medium">₹{(challan.amount / 100000).toFixed(1)}L</TableCell>
                      <TableCell>{new Date(challan.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {challan.paymentDate ? (
                          <div>
                            <div>{new Date(challan.paymentDate).toLocaleDateString()}</div>
                            {challan.bankReference && (
                              <div className="text-sm text-gray-500">Ref: {challan.bankReference}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(challan.status)}
                          {getStatusBadge(challan.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" title="Download Challan">
                            <Download className="h-4 w-4" />
                          </Button>
                          {challan.status === 'generated' && (
                            <Button variant="ghost" size="sm" title="Mark as Paid">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" title="View Details">
                            <Eye className="h-4 w-4" />
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

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Compliance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total PF Contributions (YTD):</span>
                    <span className="font-semibold text-gray-900">₹{(complianceRecords.reduce((sum, r) => sum + r.pfCalculation.totalContribution, 0) / 10000000).toFixed(1)}Cr</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total ESI Contributions (YTD):</span>
                    <span className="font-semibold text-gray-900">₹{(complianceRecords.reduce((sum, r) => sum + r.esiCalculation.totalContribution, 0) / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-700 font-medium">Compliance Rate:</span>
                    <span className="font-bold text-green-800">98.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Generate Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Download className="h-4 w-4 mr-2" />Monthly Compliance Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />PF Annual Return
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />ESI Half-yearly Return
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calculator className="h-4 w-4 mr-2" />Contribution Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />Audit Trail Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />Historical Data Export
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Compliance;