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
import { Switch } from '@/components/ui/switch';
import { 
  FileText, Download, Eye, Mail, Lock, Unlock, Plus, 
  Search, Filter, Settings, Users, Calendar, Shield,
  Send, Archive, Edit, Trash2, RefreshCw, Upload,
  CheckCircle, XCircle, Clock, AlertTriangle
} from 'lucide-react';

interface Payslip {
  _id: string;
  payrollRunId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  payPeriod: string;
  companyDetails: {
    name: string;
    address: string;
    logo?: string;
  };
  employeeDetails: {
    bankAccount?: string;
    panNumber?: string;
    pfNumber?: string;
    esiNumber?: string;
  };
  earningsBreakdown: {
    componentName: string;
    amount: number;
  }[];
  deductionsBreakdown: {
    componentName: string;
    amount: number;
  }[];
  grossPay: number;
  netPay: number;
  paymentDate: string;
  payslipNumber: string;
  status: 'generated' | 'sent' | 'downloaded' | 'acknowledged';
  passwordProtected: boolean;
  revisionHistory: {
    version: number;
    modifiedBy: string;
    modifiedAt: string;
    changes: string;
  }[];
  template: string;
  generatedDate: string;
  sentDate?: string;
  downloadCount: number;
}

interface PayslipTemplate {
  _id: string;
  templateName: string;
  description: string;
  isDefault: boolean;
  companyBranding: {
    logo: boolean;
    address: boolean;
    colors: string;
  };
  sections: {
    earnings: boolean;
    deductions: boolean;
    netPay: boolean;
    ytdSummary: boolean;
  };
  status: 'active' | 'inactive';
}

const Payslips = () => {
  const [activeTab, setActiveTab] = useState('payslips');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedPayslips, setSelectedPayslips] = useState<string[]>([]);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  
  const [generateForm, setGenerateForm] = useState({
    payrollRunId: '',
    template: 'default',
    passwordProtected: false,
    sendEmail: false
  });

  const [templateForm, setTemplateForm] = useState({
    templateName: '',
    description: '',
    companyLogo: true,
    companyAddress: true,
    colorScheme: 'blue',
    includeEarnings: true,
    includeDeductions: true,
    includeNetPay: true,
    includeYTD: false
  });

  const [payslips] = useState<Payslip[]>([
    {
      _id: '1',
      payrollRunId: 'PR001',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      department: 'Engineering',
      designation: 'Senior Developer',
      payPeriod: 'April 2024',
      companyDetails: {
        name: 'TechCorp Solutions',
        address: '123 Business Park, Tech City, TC 12345'
      },
      employeeDetails: {
        bankAccount: 'XXXX-XXXX-1234',
        panNumber: 'ABCDE1234F',
        pfNumber: 'PF123456789',
        esiNumber: 'ESI987654321'
      },
      earningsBreakdown: [
        { componentName: 'Basic Salary', amount: 50000 },
        { componentName: 'HRA', amount: 20000 },
        { componentName: 'Transport Allowance', amount: 3000 },
        { componentName: 'Medical Allowance', amount: 2500 }
      ],
      deductionsBreakdown: [
        { componentName: 'PF Contribution', amount: 6000 },
        { componentName: 'ESI Contribution', amount: 563 },
        { componentName: 'Professional Tax', amount: 200 },
        { componentName: 'Income Tax', amount: 7500 }
      ],
      grossPay: 75500,
      netPay: 61237,
      paymentDate: '2024-04-30',
      payslipNumber: 'PS-2024-04-001',
      status: 'sent',
      passwordProtected: true,
      revisionHistory: [
        {
          version: 1,
          modifiedBy: 'HR Admin',
          modifiedAt: '2024-04-30T10:00:00Z',
          changes: 'Initial generation'
        }
      ],
      template: 'default',
      generatedDate: '2024-04-30',
      sentDate: '2024-05-01',
      downloadCount: 3
    },
    {
      _id: '2',
      payrollRunId: 'PR001',
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      department: 'HR',
      designation: 'HR Manager',
      payPeriod: 'April 2024',
      companyDetails: {
        name: 'TechCorp Solutions',
        address: '123 Business Park, Tech City, TC 12345'
      },
      employeeDetails: {
        bankAccount: 'XXXX-XXXX-5678',
        panNumber: 'FGHIJ5678K',
        pfNumber: 'PF987654321',
        esiNumber: 'ESI123456789'
      },
      earningsBreakdown: [
        { componentName: 'Basic Salary', amount: 60000 },
        { componentName: 'HRA', amount: 24000 },
        { componentName: 'Transport Allowance', amount: 3000 },
        { componentName: 'Medical Allowance', amount: 2500 }
      ],
      deductionsBreakdown: [
        { componentName: 'PF Contribution', amount: 7200 },
        { componentName: 'ESI Contribution', amount: 675 },
        { componentName: 'Professional Tax', amount: 200 },
        { componentName: 'Income Tax', amount: 9000 }
      ],
      grossPay: 89500,
      netPay: 72425,
      paymentDate: '2024-04-30',
      payslipNumber: 'PS-2024-04-002',
      status: 'acknowledged',
      passwordProtected: false,
      revisionHistory: [
        {
          version: 1,
          modifiedBy: 'HR Admin',
          modifiedAt: '2024-04-30T10:00:00Z',
          changes: 'Initial generation'
        }
      ],
      template: 'default',
      generatedDate: '2024-04-30',
      sentDate: '2024-05-01',
      downloadCount: 1
    },
    {
      _id: '3',
      payrollRunId: 'PR001',
      employeeId: 'EMP003',
      employeeName: 'Mike Johnson',
      department: 'Finance',
      designation: 'Financial Analyst',
      payPeriod: 'April 2024',
      companyDetails: {
        name: 'TechCorp Solutions',
        address: '123 Business Park, Tech City, TC 12345'
      },
      employeeDetails: {
        bankAccount: 'XXXX-XXXX-9012',
        panNumber: 'KLMNO9012P',
        pfNumber: 'PF456789123'
      },
      earningsBreakdown: [
        { componentName: 'Basic Salary', amount: 45000 },
        { componentName: 'HRA', amount: 18000 },
        { componentName: 'Transport Allowance', amount: 3000 }
      ],
      deductionsBreakdown: [
        { componentName: 'PF Contribution', amount: 5400 },
        { componentName: 'Professional Tax', amount: 200 },
        { componentName: 'Income Tax', amount: 6000 }
      ],
      grossPay: 66000,
      netPay: 54400,
      paymentDate: '2024-04-30',
      payslipNumber: 'PS-2024-04-003',
      status: 'generated',
      passwordProtected: true,
      revisionHistory: [
        {
          version: 1,
          modifiedBy: 'HR Admin',
          modifiedAt: '2024-04-30T10:00:00Z',
          changes: 'Initial generation'
        }
      ],
      template: 'default',
      generatedDate: '2024-04-30',
      downloadCount: 0
    }
  ]);

  const [templates] = useState<PayslipTemplate[]>([
    {
      _id: '1',
      templateName: 'Default Template',
      description: 'Standard payslip template with company branding',
      isDefault: true,
      companyBranding: {
        logo: true,
        address: true,
        colors: 'blue'
      },
      sections: {
        earnings: true,
        deductions: true,
        netPay: true,
        ytdSummary: false
      },
      status: 'active'
    },
    {
      _id: '2',
      templateName: 'Detailed Template',
      description: 'Comprehensive template with YTD summary',
      isDefault: false,
      companyBranding: {
        logo: true,
        address: true,
        colors: 'green'
      },
      sections: {
        earnings: true,
        deductions: true,
        netPay: true,
        ytdSummary: true
      },
      status: 'active'
    },
    {
      _id: '3',
      templateName: 'Minimal Template',
      description: 'Simple template with essential information only',
      isDefault: false,
      companyBranding: {
        logo: false,
        address: false,
        colors: 'gray'
      },
      sections: {
        earnings: true,
        deductions: true,
        netPay: true,
        ytdSummary: false
      },
      status: 'active'
    }
  ]);

  const handleGeneratePayslips = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Generating payslips:', generateForm);
    setIsGenerateDialogOpen(false);
    resetGenerateForm();
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating template:', templateForm);
    setIsTemplateDialogOpen(false);
    resetTemplateForm();
  };

  const resetGenerateForm = () => {
    setGenerateForm({
      payrollRunId: '',
      template: 'default',
      passwordProtected: false,
      sendEmail: false
    });
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      templateName: '',
      description: '',
      companyLogo: true,
      companyAddress: true,
      colorScheme: 'blue',
      includeEarnings: true,
      includeDeductions: true,
      includeNetPay: true,
      includeYTD: false
    });
  };

  const togglePayslipSelection = (payslipId: string) => {
    setSelectedPayslips(prev => 
      prev.includes(payslipId) 
        ? prev.filter(id => id !== payslipId)
        : [...prev, payslipId]
    );
  };

  const selectAllPayslips = () => {
    setSelectedPayslips(filteredPayslips.map(p => p._id));
  };

  const clearSelection = () => {
    setSelectedPayslips([]);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      generated: 'bg-blue-100 text-blue-800 border-0',
      sent: 'bg-green-100 text-green-800 border-0',
      downloaded: 'bg-purple-100 text-purple-800 border-0',
      acknowledged: 'bg-emerald-100 text-emerald-800 border-0',
      active: 'bg-green-100 text-green-800 border-0',
      inactive: 'bg-gray-100 text-gray-800 border-0'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      generated: FileText,
      sent: Send,
      downloaded: Download,
      acknowledged: CheckCircle
    };
    const Icon = icons[status as keyof typeof icons] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const filteredPayslips = payslips.filter(payslip => {
    const matchesSearch = payslip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payslip.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payslip.payslipNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payslip.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || payslip.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = [...new Set(payslips.map(p => p.department))];


  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Employee Payslips</h2>
          <p className="text-gray-600 mt-1">Generate, manage, and distribute employee payslips</p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-xl p-2 shadow-sm border-0">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto gap-2">
            <TabsTrigger value="payslips" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <FileText className="h-4 w-4 mr-2" />Payslips
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Settings className="h-4 w-4 mr-2" />Templates
            </TabsTrigger>
            <TabsTrigger value="bulk-actions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Users className="h-4 w-4 mr-2" />Bulk Actions
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Payslips Tab */}
        <TabsContent value="payslips" className="space-y-6">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Employee Payslips</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search payslips..." 
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
                      <SelectItem value="generated">Generated</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="downloaded">Downloaded</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        <Plus className="h-4 w-4 mr-2" />Generate Payslips
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate Employee Payslips</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleGeneratePayslips} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Payroll Run</Label>
                          <Select value={generateForm.payrollRunId} onValueChange={(value) => setGenerateForm({...generateForm, payrollRunId: value})}>
                            <SelectTrigger><SelectValue placeholder="Select payroll run" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PR001">April 2024 - Regular</SelectItem>
                              <SelectItem value="PR002">March 2024 - Regular</SelectItem>
                              <SelectItem value="PR003">April 2024 - Bonus</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Template</Label>
                          <Select value={generateForm.template} onValueChange={(value) => setGenerateForm({...generateForm, template: value})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {templates.filter(t => t.status === 'active').map(template => (
                                <SelectItem key={template._id} value={template._id}>{template.templateName}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Password Protection</Label>
                            <Switch 
                              checked={generateForm.passwordProtected}
                              onCheckedChange={(checked) => setGenerateForm({...generateForm, passwordProtected: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Send Email Automatically</Label>
                            <Switch 
                              checked={generateForm.sendEmail}
                              onCheckedChange={(checked) => setGenerateForm({...generateForm, sendEmail: checked})}
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button type="submit" className="flex-1">Generate Payslips</Button>
                          <Button type="button" variant="outline" onClick={() => setIsGenerateDialogOpen(false)} className="flex-1">Cancel</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedPayslips.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">{selectedPayslips.length} payslips selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />Bulk Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-1" />Send All
                      </Button>
                      <Button size="sm" variant="outline" onClick={clearSelection}>
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedPayslips.length === filteredPayslips.length && filteredPayslips.length > 0}
                          onChange={() => selectedPayslips.length === filteredPayslips.length ? clearSelection() : selectAllPayslips()}
                          className="rounded border-gray-300"
                        />
                      </TableHead>
                      <TableHead className="font-semibold">Employee</TableHead>
                      <TableHead className="font-semibold">Department</TableHead>
                      <TableHead className="font-semibold">Period</TableHead>
                      <TableHead className="font-semibold">Payslip Number</TableHead>
                      <TableHead className="font-semibold">Gross Pay</TableHead>
                      <TableHead className="font-semibold">Net Pay</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Security</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayslips.map((payslip) => (
                      <TableRow key={payslip._id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedPayslips.includes(payslip._id)}
                            onChange={() => togglePayslipSelection(payslip._id)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {payslip.employeeName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{payslip.employeeName}</div>
                              <div className="text-sm text-gray-500">{payslip.employeeId} • {payslip.designation}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{payslip.department}</TableCell>
                        <TableCell>{payslip.payPeriod}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{payslip.payslipNumber}</div>
                            <div className="text-sm text-gray-500">Generated: {new Date(payslip.generatedDate).toLocaleDateString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>₹{payslip.grossPay.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold text-green-600">₹{payslip.netPay.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payslip.status)}
                            {getStatusBadge(payslip.status)}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" title="View Payslip">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Download PDF">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Send Email">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Edit Payslip">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredPayslips.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No payslips found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Payslip Templates</CardTitle>
                <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <Plus className="h-4 w-4 mr-2" />Create Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Payslip Template</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateTemplate} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Template Name</Label>
                          <Input 
                            value={templateForm.templateName} 
                            onChange={(e) => setTemplateForm({...templateForm, templateName: e.target.value})} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Color Scheme</Label>
                          <Select value={templateForm.colorScheme} onValueChange={(value) => setTemplateForm({...templateForm, colorScheme: value})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="gray">Gray</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input 
                          value={templateForm.description} 
                          onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})} 
                          placeholder="Brief description of this template"
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Company Branding</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-between">
                            <Label>Include Company Logo</Label>
                            <Switch 
                              checked={templateForm.companyLogo}
                              onCheckedChange={(checked) => setTemplateForm({...templateForm, companyLogo: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Include Company Address</Label>
                            <Switch 
                              checked={templateForm.companyAddress}
                              onCheckedChange={(checked) => setTemplateForm({...templateForm, companyAddress: checked})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Sections to Include</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-between">
                            <Label>Earnings Breakdown</Label>
                            <Switch 
                              checked={templateForm.includeEarnings}
                              onCheckedChange={(checked) => setTemplateForm({...templateForm, includeEarnings: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Deductions Breakdown</Label>
                            <Switch 
                              checked={templateForm.includeDeductions}
                              onCheckedChange={(checked) => setTemplateForm({...templateForm, includeDeductions: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Net Pay Summary</Label>
                            <Switch 
                              checked={templateForm.includeNetPay}
                              onCheckedChange={(checked) => setTemplateForm({...templateForm, includeNetPay: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>YTD Summary</Label>
                            <Switch 
                              checked={templateForm.includeYTD}
                              onCheckedChange={(checked) => setTemplateForm({...templateForm, includeYTD: checked})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">Create Template</Button>
                        <Button type="button" variant="outline" onClick={() => setIsTemplateDialogOpen(false)} className="flex-1">Cancel</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <Card key={template._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{template.templateName}</h3>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(template.status)}
                          {template.isDefault && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-0 text-xs">Default</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Company Logo:</span>
                          <span className={template.companyBranding.logo ? 'text-green-600' : 'text-gray-400'}>
                            {template.companyBranding.logo ? 'Included' : 'Not included'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">YTD Summary:</span>
                          <span className={template.sections.ytdSummary ? 'text-green-600' : 'text-gray-400'}>
                            {template.sections.ytdSummary ? 'Included' : 'Not included'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Color Scheme:</span>
                          <span className="font-medium capitalize">{template.companyBranding.colors}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />Preview
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Actions Tab */}
        <TabsContent value="bulk-actions" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Bulk Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Download className="h-4 w-4 mr-2" />Bulk Download (ZIP)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />Send All Payslips
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />Regenerate Selected
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="h-4 w-4 mr-2" />Enable Password Protection
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />Archive Old Payslips
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />Update Template
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Distribution Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <span className="font-medium text-blue-800">Generated</span>
                    </div>
                    <span className="text-lg font-bold text-blue-800">{payslips.filter(p => p.status === 'generated').length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Send className="h-6 w-6 text-green-600" />
                      <span className="font-medium text-green-800">Sent</span>
                    </div>
                    <span className="text-lg font-bold text-green-800">{payslips.filter(p => p.status === 'sent').length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                      <span className="font-medium text-emerald-800">Acknowledged</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-800">{payslips.filter(p => p.status === 'acknowledged').length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Download className="h-6 w-6 text-purple-600" />
                      <span className="font-medium text-purple-800">Downloaded</span>
                    </div>
                    <span className="text-lg font-bold text-purple-800">{payslips.filter(p => p.status === 'downloaded').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payslips;