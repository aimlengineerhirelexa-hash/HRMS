import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Users, UserCheck, Plus, Search, Filter, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { organizationService, employeeService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Department {
  _id: string;
  name: string;
  code: string;
  head: string;
  employeeCount: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

interface Designation {
  _id: string;
  name: string;
  department?: string;
  employeeCount: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

interface ReportingManager {
  _id: string;
  employeeName: string;
  reportingManager: string;
  department: string;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

const Organization: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showDesigModal, setShowDesigModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; type: string }>({ open: false, id: '', type: '' });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [reportingManagers, setReportingManagers] = useState<ReportingManager[]>([]);
  const [departmentEmployees, setDepartmentEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deptResponse, desigResponse, reportResponse] = await Promise.all([
          organizationService.getDepartments(),
          organizationService.getDesignations(),
          organizationService.getReportingManagers()
        ]);

        if (deptResponse.data.success) {
          setDepartments(deptResponse.data.data);
        }
        if (desigResponse.data.success) {
          setDesignations(desigResponse.data.data);
        }
        if (reportResponse.data.success) {
          setReportingManagers(reportResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching organization data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [deptForm, setDeptForm] = useState<{ name: string; code: string; head: string; status: 'Active' | 'Inactive' }>({ 
    name: '', code: '', head: '', status: 'Active' 
  });
  const [desigForm, setDesigForm] = useState<{ name: string; department: string; status: 'Active' | 'Inactive' }>({ 
    name: '', department: '', status: 'Active' 
  });
  const [reportForm, setReportForm] = useState({ 
    employeeName: '', reportingManager: '', department: '', effectiveDate: '' 
  });

  const handleAddDepartment = async () => {
    try {
      if (editingItem) {
        const response = await organizationService.updateDepartment(editingItem._id, {
          name: deptForm.name,
          code: deptForm.code,
          head: deptForm.head,
          status: deptForm.status
        });
        if (response.data.success) {
          setDepartments(prev => prev.map(d => d._id === editingItem._id ? response.data.data : d));
          toast({
            title: "Success",
            description: "Department updated successfully.",
          });
        }
      } else {
        const response = await organizationService.createDepartment({
          name: deptForm.name,
          code: deptForm.code,
          head: deptForm.head,
          status: deptForm.status
        });
        if (response.data.success) {
          setDepartments(prev => [...prev, response.data.data]);
          toast({
            title: "Success",
            description: "Department created successfully.",
          });
        }
      }
      setDeptForm({ name: '', code: '', head: '', status: 'Active' });
      setEditingItem(null);
      setShowDeptModal(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save department. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddDesignation = async () => {
    try {
      if (editingItem) {
        const response = await organizationService.updateDesignation(editingItem._id, {
          name: desigForm.name,
          department: desigForm.department,
          status: desigForm.status
        });
        if (response.data.success) {
          setDesignations(prev => prev.map(d => d._id === editingItem._id ? response.data.data : d));
          toast({
            title: "Success",
            description: "Designation updated successfully.",
          });
        }
      } else {
        const response = await organizationService.createDesignation({
          name: desigForm.name,
          department: desigForm.department,
          status: desigForm.status
        });
        if (response.data.success) {
          setDesignations(prev => [...prev, response.data.data]);
          toast({
            title: "Success",
            description: "Designation created successfully.",
          });
        }
      }
      setDesigForm({ name: '', department: '', status: 'Active' });
      setEditingItem(null);
      setShowDesigModal(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save designation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddReporting = async () => {
    try {
      if (editingItem) {
        const response = await organizationService.updateReportingManager(editingItem._id, reportForm);
        if (response.data.success) {
          setReportingManagers(prev => prev.map(r => r._id === editingItem._id ? response.data.data : r));
          toast({
            title: "Success",
            description: "Reporting relationship updated successfully.",
          });
        }
      } else {
        const response = await organizationService.createReportingManager(reportForm);
        if (response.data.success) {
          setReportingManagers(prev => [...prev, response.data.data]);
          toast({
            title: "Success",
            description: "Reporting relationship created successfully.",
          });
        }
      }
      setReportForm({ employeeName: '', reportingManager: '', department: '', effectiveDate: '' });
      setEditingItem(null);
      setShowReportModal(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save reporting manager. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchEmployeesByDepartment = async (department: string) => {
    try {
      const response = await employeeService.getByDepartment(department);
      if (response.data.success) {
        setDepartmentEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching employees by department:', error);
    }
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    if (type === 'department') {
      setDeptForm({ name: item.name, code: item.code, head: item.head, status: item.status });
      setShowDeptModal(true);
    } else if (type === 'designation') {
      setDesigForm({ name: item.name, department: item.department || '', status: item.status });
      setShowDesigModal(true);
    } else if (type === 'reporting') {
      setReportForm({ employeeName: item.employeeName, reportingManager: item.reportingManager, department: item.department, effectiveDate: item.effectiveDate });
      if (item.department) {
        fetchEmployeesByDepartment(item.department);
      }
      setShowReportModal(true);
    }
  };

  const handleDelete = (id: string, type: string) => {
    setDeleteDialog({ open: true, id, type });
  };

  const confirmDelete = async () => {
    const { id, type } = deleteDialog;
    try {
      if (type === 'department') {
        await organizationService.deleteDepartment(id);
        setDepartments(prev => prev.filter(d => d._id !== id));
      } else if (type === 'designation') {
        await organizationService.deleteDesignation(id);
        setDesignations(prev => prev.filter(d => d._id !== id));
      } else if (type === 'reporting') {
        await organizationService.deleteReportingManager(id);
        setReportingManagers(prev => prev.filter(r => r._id !== id));
      }
      setDeleteDialog({ open: false, id: '', type: '' });
      toast({
        title: "Success",
        description: "Item deleted successfully.",
      });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403) {
        toast({
          title: "Permission Denied",
          description: "You do not have permission to delete this item.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete item. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleStatus = async (id: string, type: string) => {
    try {
      if (type === 'department') {
        const department = departments.find(d => d._id === id);
        if (department) {
          const newStatus = department.status === 'Active' ? 'Inactive' : 'Active';
          const response = await organizationService.updateDepartment(id, { status: newStatus });
          if (response.data.success) {
            setDepartments(prev => prev.map(d => d._id === id ? response.data.data : d));
          }
        }
      } else if (type === 'designation') {
        const designation = designations.find(d => d._id === id);
        if (designation) {
          const newStatus = designation.status === 'Active' ? 'Inactive' : 'Active';
          const response = await organizationService.updateDesignation(id, { status: newStatus });
          if (response.data.success) {
            setDesignations(prev => prev.map(d => d._id === id ? response.data.data : d));
          }
        }
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800 border-0' : 'bg-red-100 text-red-800 border-0';
  };

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === '' || statusFilter === 'all' || d.status === statusFilter)
  );

  const filteredDesignations = designations.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === '' || statusFilter === 'all' || d.status === statusFilter)
  );

  const filteredReporting = reportingManagers.filter(r => 
    r.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // KPI Data
  const kpiData = [
    {
      title: 'Total Departments',
      value: departments.length.toString(),
      icon: Building2,
      color: 'bg-blue-50'
    },
    {
      title: 'Total Designations',
      value: designations.length.toString(),
      icon: Users,
      color: 'bg-purple-50'
    },
    {
      title: 'Reporting Relations',
      value: reportingManagers.length.toString(),
      icon: UserCheck,
      color: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading organization data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Organization</h2>
          <p className="text-gray-600 mt-1">Manage departments, designations, and reporting structure</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                  </div>
                  <div className={`p-3 ${kpi.color} rounded-lg`}>
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="departments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Building2 className="h-4 w-4 mr-2" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="designations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="h-4 w-4 mr-2" />
            Designations
          </TabsTrigger>
          <TabsTrigger value="reporting" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <UserCheck className="h-4 w-4 mr-2" />
            Reporting Managers
          </TabsTrigger>
        </TabsList>

        {/* Departments Tab */}
        <TabsContent value="departments">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-900">Departments</CardTitle>
                <Dialog open={showDeptModal} onOpenChange={setShowDeptModal}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => { 
                        setEditingItem(null); 
                        setDeptForm({ name: '', code: '', head: '', status: 'Active' }); 
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Edit Department' : 'Add Department'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Department Name *</Label>
                        <Input 
                          value={deptForm.name} 
                          onChange={(e) => setDeptForm({...deptForm, name: e.target.value})} 
                          placeholder="Enter department name"
                        />
                      </div>
                      <div>
                        <Label>Department Code *</Label>
                        <Input 
                          value={deptForm.code} 
                          onChange={(e) => setDeptForm({...deptForm, code: e.target.value})} 
                          placeholder="Enter department code"
                        />
                      </div>
                      <div>
                        <Label>Department Head</Label>
                        <Input 
                          value={deptForm.head} 
                          onChange={(e) => setDeptForm({...deptForm, head: e.target.value})} 
                          placeholder="Enter department head"
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select value={deptForm.status} onValueChange={(value: 'Active' | 'Inactive') => setDeptForm({...deptForm, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddDepartment} className="w-full bg-blue-600 hover:bg-blue-700">
                        {editingItem ? 'Update' : 'Add'} Department
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search departments..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-10" 
                  />
                </div>
                <Select value={statusFilter || undefined} onValueChange={(value) => setStatusFilter(value || '')}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDepartments.map((dept) => (
                      <tr key={dept._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{dept.code}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{dept.head}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{dept.employeeCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={`${getStatusColor(dept.status)} cursor-pointer hover:opacity-80`}
                            onClick={() => toggleStatus(dept._id, 'department')}
                          >
                            {dept.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(dept, 'department')}
                              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(dept._id, 'department')}
                              className="text-red-600 hover:text-red-900 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </TabsContent>

        {/* Designations Tab */}
        <TabsContent value="designations">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-900">Designations</CardTitle>
                <Dialog open={showDesigModal} onOpenChange={setShowDesigModal}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => { 
                        setEditingItem(null); 
                        setDesigForm({ name: '', department: '', status: 'Active' }); 
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Designation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Edit Designation' : 'Add Designation'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Designation Name *</Label>
                        <Input 
                          value={desigForm.name} 
                          onChange={(e) => setDesigForm({...desigForm, name: e.target.value})} 
                          placeholder="Enter designation name"
                        />
                      </div>
                      <div>
                        <Label>Department</Label>
                        <Select value={desigForm.department} onValueChange={(value) => setDesigForm({...desigForm, department: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept._id} value={dept.name}>{dept.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select value={desigForm.status} onValueChange={(value: 'Active' | 'Inactive') => setDesigForm({...desigForm, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddDesignation} className="w-full bg-blue-600 hover:bg-blue-700">
                        {editingItem ? 'Update' : 'Add'} Designation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search designations..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-10" 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDesignations.map((designation) => (
                      <tr key={designation._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{designation.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{designation.department || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{designation.employeeCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={`${getStatusColor(designation.status)} cursor-pointer hover:opacity-80`}
                            onClick={() => toggleStatus(designation._id, 'designation')}
                          >
                            {designation.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(designation, 'designation')}
                              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(designation._id, 'designation')}
                              className="text-red-600 hover:text-red-900 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </TabsContent>

        {/* Reporting Managers Tab */}
        <TabsContent value="reporting">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-900">Reporting Managers</CardTitle>
                <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => { 
                        setEditingItem(null); 
                        setReportForm({ department: '', employeeName: '', reportingManager: '', effectiveDate: '' }); 
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Reporting Relationship
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Edit Reporting Relationship' : 'Add Reporting Relationship'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Department</Label>
                        <Select
                          value={reportForm.department}
                          onValueChange={(value) => {
                            setReportForm({...reportForm, department: value, employeeName: '', reportingManager: ''});
                            fetchEmployeesByDepartment(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept._id} value={dept.name}>{dept.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Employee Name *</Label>
                        <Select
                          value={reportForm.employeeName}
                          onValueChange={(value) => setReportForm({...reportForm, employeeName: value})}
                          disabled={!reportForm.department}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentEmployees.map(employee => (
                              <SelectItem key={employee._id} value={`${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`}>
                                {`${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Reporting Manager *</Label>
                        <Select
                          value={reportForm.reportingManager}
                          onValueChange={(value) => setReportForm({...reportForm, reportingManager: value})}
                          disabled={!reportForm.department}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Reporting Manager" />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentEmployees.map(employee => (
                              <SelectItem key={employee._id} value={`${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`}>
                                {`${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Effective Date *</Label>
                        <Input
                          type="date"
                          value={reportForm.effectiveDate}
                          onChange={(e) => setReportForm({...reportForm, effectiveDate: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleAddReporting} className="w-full bg-blue-600 hover:bg-blue-700">
                        {editingItem ? 'Update' : 'Add'} Reporting Relationship
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search reporting relationships..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-10" 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporting Manager</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReporting.map((reporting) => (
                      <tr key={reporting._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{reporting.employeeName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{reporting.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{reporting.reportingManager}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{reporting.effectiveDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(reporting, 'reporting')}
                              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(reporting._id, 'reporting')}
                              className="text-red-600 hover:text-red-900 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Organization;