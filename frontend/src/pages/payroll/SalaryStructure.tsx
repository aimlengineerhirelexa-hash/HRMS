import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, Edit, Trash2, Copy, Download, Upload, Settings, 
  TrendingUp, TrendingDown, DollarSign, Percent, Calendar,
  Shield, Eye, EyeOff, Search, Filter, MoreHorizontal
} from 'lucide-react';
import { salaryComponentService } from '@/services/api';

interface SalaryComponent {
  _id: string;
  componentName: string;
  componentCode: string;
  componentType: 'earning' | 'deduction';
  calculationMethod: 'fixed' | 'percentage';
  amount?: number;
  percentage?: number;
  payFrequency: 'monthly' | 'bi-weekly';
  taxApplicability: boolean;
  showOnPayslip: boolean;
  effectiveFromDate: string;
  status: 'active' | 'inactive';
  componentGroup: string;
  mandatory: boolean;
  roundingRules?: string;
  visibilityControl: boolean;
}

interface SalaryStructureTemplate {
  _id: string;
  templateName: string;
  description: string;
  components: string[];
  status: 'active' | 'inactive';
  createdDate: string;
  version: number;
}

const SalaryStructure = () => {
  const [activeTab, setActiveTab] = useState('components');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>([]);
  const [templates, setTemplates] = useState<SalaryStructureTemplate[]>([]);
  
  const [componentForm, setComponentForm] = useState({
    componentName: '',
    componentCode: '',
    componentType: 'earning' as 'earning' | 'deduction',
    calculationMethod: 'fixed' as 'fixed' | 'percentage',
    amount: '',
    percentage: '',
    payFrequency: 'monthly' as 'monthly' | 'bi-weekly',
    taxApplicability: true,
    showOnPayslip: true,
    effectiveFromDate: new Date().toISOString().split('T')[0],
    componentGroup: '',
    mandatory: false,
    roundingRules: '',
    visibilityControl: true
  });

  const [templateForm, setTemplateForm] = useState({
    templateName: '',
    description: '',
    selectedComponents: [] as string[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [componentsRes, templatesRes] = await Promise.all([
        salaryComponentService.getComponents(),
        salaryComponentService.getTemplates()
      ]);
      
      if (componentsRes.data.success) {
        setSalaryComponents(componentsRes.data.data);
      }
      
      if (templatesRes.data.success) {
        setTemplates(templatesRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching salary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await salaryComponentService.createComponent(componentForm);
      if (response.data.success) {
        setSalaryComponents([...salaryComponents, response.data.data]);
        setIsDialogOpen(false);
        resetComponentForm();
      }
    } catch (error) {
      console.error('Error creating component:', error);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await salaryComponentService.createTemplate(templateForm);
      if (response.data.success) {
        setTemplates([...templates, response.data.data]);
        setIsTemplateDialogOpen(false);
        resetTemplateForm();
      }
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const resetComponentForm = () => {
    setComponentForm({
      componentName: '',
      componentCode: '',
      componentType: 'earning',
      calculationMethod: 'fixed',
      amount: '',
      percentage: '',
      payFrequency: 'monthly',
      taxApplicability: true,
      showOnPayslip: true,
      effectiveFromDate: new Date().toISOString().split('T')[0],
      componentGroup: '',
      mandatory: false,
      roundingRules: '',
      visibilityControl: true
    });
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      templateName: '',
      description: '',
      selectedComponents: []
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-0',
      inactive: 'bg-gray-100 text-gray-800 border-0',
      earning: 'bg-blue-100 text-blue-800 border-0',
      deduction: 'bg-red-100 text-red-800 border-0',
      fixed: 'bg-purple-100 text-purple-800 border-0',
      percentage: 'bg-orange-100 text-orange-800 border-0'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const filteredComponents = salaryComponents.filter(component => {
    const matchesSearch = component.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.componentCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || component.componentType === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading salary structure data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Salary Structure</h2>
          <p className="text-gray-600 mt-1">Define and manage salary components, templates, and structures</p>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
      </div> */}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-xl p-2 shadow-sm border-0">
          <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto gap-2">
            <TabsTrigger value="components" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Settings className="h-4 w-4 mr-2" />Components
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Copy className="h-4 w-4 mr-2" />Templates
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Salary Components</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search components..." 
                      className="pl-10 w-64" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="earning">Earnings</SelectItem>
                      <SelectItem value="deduction">Deductions</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        <Plus className="h-4 w-4 mr-2" />Add Component
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Salary Component</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateComponent} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="componentName">Component Name *</Label>
                            <Input 
                              id="componentName" 
                              value={componentForm.componentName} 
                              onChange={(e) => setComponentForm({...componentForm, componentName: e.target.value})} 
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="componentCode">Component Code *</Label>
                            <Input 
                              id="componentCode" 
                              value={componentForm.componentCode} 
                              onChange={(e) => setComponentForm({...componentForm, componentCode: e.target.value})} 
                              required 
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Component Type *</Label>
                            <Select 
                              value={componentForm.componentType} 
                              onValueChange={(value: 'earning' | 'deduction') => setComponentForm({...componentForm, componentType: value})}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="earning">Earning</SelectItem>
                                <SelectItem value="deduction">Deduction</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Calculation Method *</Label>
                            <Select 
                              value={componentForm.calculationMethod} 
                              onValueChange={(value: 'fixed' | 'percentage') => setComponentForm({...componentForm, calculationMethod: value})}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                <SelectItem value="percentage">Percentage</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {componentForm.calculationMethod === 'fixed' ? (
                            <div className="space-y-2">
                              <Label htmlFor="amount">Amount (₹) *</Label>
                              <Input 
                                id="amount" 
                                type="number" 
                                value={componentForm.amount} 
                                onChange={(e) => setComponentForm({...componentForm, amount: e.target.value})} 
                                required 
                              />
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label htmlFor="percentage">Percentage (%) *</Label>
                              <Input 
                                id="percentage" 
                                type="number" 
                                step="0.01"
                                value={componentForm.percentage} 
                                onChange={(e) => setComponentForm({...componentForm, percentage: e.target.value})} 
                                required 
                              />
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label>Pay Frequency</Label>
                            <Select 
                              value={componentForm.payFrequency} 
                              onValueChange={(value: 'monthly' | 'bi-weekly') => setComponentForm({...componentForm, payFrequency: value})}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="componentGroup">Component Group</Label>
                            <Input 
                              id="componentGroup" 
                              value={componentForm.componentGroup} 
                              onChange={(e) => setComponentForm({...componentForm, componentGroup: e.target.value})} 
                              placeholder="e.g., Allowances, Statutory Deductions"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="effectiveFromDate">Effective From Date *</Label>
                            <Input 
                              id="effectiveFromDate" 
                              type="date" 
                              value={componentForm.effectiveFromDate} 
                              onChange={(e) => setComponentForm({...componentForm, effectiveFromDate: e.target.value})} 
                              required 
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="taxApplicability">Tax Applicable</Label>
                            <Switch 
                              id="taxApplicability"
                              checked={componentForm.taxApplicability}
                              onCheckedChange={(checked) => setComponentForm({...componentForm, taxApplicability: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="showOnPayslip">Show on Payslip</Label>
                            <Switch 
                              id="showOnPayslip"
                              checked={componentForm.showOnPayslip}
                              onCheckedChange={(checked) => setComponentForm({...componentForm, showOnPayslip: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="mandatory">Mandatory Component</Label>
                            <Switch 
                              id="mandatory"
                              checked={componentForm.mandatory}
                              onCheckedChange={(checked) => setComponentForm({...componentForm, mandatory: checked})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="roundingRules">Rounding Rules</Label>
                          <Input 
                            id="roundingRules" 
                            value={componentForm.roundingRules} 
                            onChange={(e) => setComponentForm({...componentForm, roundingRules: e.target.value})} 
                            placeholder="e.g., Round to nearest 100"
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                            Create Component
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
                      <TableHead className="font-semibold">Component</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Calculation</TableHead>
                      <TableHead className="font-semibold">Amount/Rate</TableHead>
                      <TableHead className="font-semibold">Properties</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComponents.map((component) => (
                      <TableRow key={component._id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{component.componentName}</div>
                            <div className="text-sm text-gray-500">{component.componentCode} • {component.componentGroup}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(component.componentType)}</TableCell>
                        <TableCell>{getStatusBadge(component.calculationMethod)}</TableCell>
                        <TableCell className="font-medium">
                          {component.calculationMethod === 'fixed' 
                            ? `₹${component.amount?.toLocaleString()}` 
                            : `${component.percentage}%`
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {component.taxApplicability && <Badge variant="outline" className="text-xs">Taxable</Badge>}
                            {component.mandatory && <Badge variant="outline" className="text-xs">Mandatory</Badge>}
                            {component.showOnPayslip ? 
                              <Badge variant="outline" className="text-xs"><Eye className="h-3 w-3 mr-1" />Visible</Badge> :
                              <Badge variant="outline" className="text-xs"><EyeOff className="h-3 w-3 mr-1" />Hidden</Badge>
                            }
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(component.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" title="Edit Component">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Duplicate Component">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" title="Delete Component">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredComponents.length === 0 && (
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No components found matching your criteria</p>
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
                <CardTitle className="text-lg font-semibold text-gray-900">Salary Structure Templates</CardTitle>
                <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <Plus className="h-4 w-4 mr-2" />Create Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Salary Structure Template</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateTemplate} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="templateName">Template Name *</Label>
                        <Input 
                          id="templateName" 
                          value={templateForm.templateName} 
                          onChange={(e) => setTemplateForm({...templateForm, templateName: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input 
                          id="description" 
                          value={templateForm.description} 
                          onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})} 
                          placeholder="Brief description of this template"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Select Components</Label>
                        <div className="max-h-60 overflow-y-auto border rounded-lg p-4 space-y-2">
                          {salaryComponents.filter(c => c.status === 'active').map((component) => (
                            <div key={component._id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`component-${component._id}`}
                                checked={templateForm.selectedComponents.includes(component._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setTemplateForm({
                                      ...templateForm,
                                      selectedComponents: [...templateForm.selectedComponents, component._id]
                                    });
                                  } else {
                                    setTemplateForm({
                                      ...templateForm,
                                      selectedComponents: templateForm.selectedComponents.filter(id => id !== component._id)
                                    });
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={`component-${component._id}`} className="text-sm font-medium">
                                {component.componentName} ({component.componentCode})
                              </label>
                              {getStatusBadge(component.componentType)}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                          Create Template
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsTemplateDialogOpen(false)} className="flex-1">
                          Cancel
                        </Button>
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
                        {getStatusBadge(template.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Components:</span>
                          <span className="font-medium">{template.components.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{new Date(template.createdDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
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
      </Tabs>
    </div>
  );
};

export default SalaryStructure;