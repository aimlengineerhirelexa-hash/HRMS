import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserMinus, AlertTriangle, Plus, Search, Filter, Edit, Trash2, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface Resignation {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  resignationDate: string;
  lastWorkingDay: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface Termination {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  terminationDate: string;
  reason: string;
  remarks: string;
  status: 'Draft' | 'Submitted' | 'Approved';
}

const ExitManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showResignModal, setShowResignModal] = useState(false);
  const [showTermModal, setShowTermModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [resignations, setResignations] = useState<Resignation[]>([
    {
      id: '1',
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      department: 'Engineering',
      resignationDate: '2024-01-15',
      lastWorkingDay: '2024-02-15',
      reason: 'Better opportunity',
      status: 'Pending'
    },
    {
      id: '2',
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      department: 'Marketing',
      resignationDate: '2024-01-10',
      lastWorkingDay: '2024-02-10',
      reason: 'Personal reasons',
      status: 'Approved'
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      department: 'HR',
      resignationDate: '2024-01-20',
      lastWorkingDay: '2024-02-20',
      reason: 'Career change',
      status: 'Rejected'
    }
  ]);

  const [terminations, setTerminations] = useState<Termination[]>([
    {
      id: '1',
      employeeName: 'Bob Wilson',
      employeeId: 'EMP004',
      department: 'Finance',
      terminationDate: '2024-01-20',
      reason: 'Performance issues',
      remarks: 'Multiple warnings issued',
      status: 'Draft'
    },
    {
      id: '2',
      employeeName: 'Carol Brown',
      employeeId: 'EMP005',
      department: 'Operations',
      terminationDate: '2024-01-25',
      reason: 'Policy violation',
      remarks: 'Serious misconduct',
      status: 'Submitted'
    }
  ]);

  const [resignForm, setResignForm] = useState<{
    employeeName: string;
    employeeId: string;
    department: string;
    resignationDate: string;
    lastWorkingDay: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
  }>({
    employeeName: '', employeeId: '', department: '', resignationDate: '', 
    lastWorkingDay: '', reason: '', status: 'Pending'
  });

  const [termForm, setTermForm] = useState<{
    employeeName: string;
    employeeId: string;
    department: string;
    terminationDate: string;
    reason: string;
    remarks: string;
    status: 'Draft' | 'Submitted' | 'Approved';
  }>({
    employeeName: '', employeeId: '', department: '', terminationDate: '', 
    reason: '', remarks: '', status: 'Draft'
  });

  const handleAddResignation = () => {
    if (editingItem) {
      setResignations(prev => prev.map(r => r.id === editingItem.id ? { ...r, ...resignForm } : r));
    } else {
      const newResign: Resignation = {
        id: Date.now().toString(),
        ...resignForm
      };
      setResignations(prev => [...prev, newResign]);
    }
    setResignForm({ employeeName: '', employeeId: '', department: '', resignationDate: '', lastWorkingDay: '', reason: '', status: 'Pending' });
    setEditingItem(null);
    setShowResignModal(false);
  };

  const handleAddTermination = () => {
    if (editingItem) {
      setTerminations(prev => prev.map(t => t.id === editingItem.id ? { ...t, ...termForm } : t));
    } else {
      const newTerm: Termination = {
        id: Date.now().toString(),
        ...termForm
      };
      setTerminations(prev => [...prev, newTerm]);
    }
    setTermForm({ employeeName: '', employeeId: '', department: '', terminationDate: '', reason: '', remarks: '', status: 'Draft' });
    setEditingItem(null);
    setShowTermModal(false);
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item);
    if (type === 'resignation') {
      setResignForm({
        employeeName: item.employeeName,
        employeeId: item.employeeId,
        department: item.department,
        resignationDate: item.resignationDate,
        lastWorkingDay: item.lastWorkingDay,
        reason: item.reason,
        status: item.status
      });
      setShowResignModal(true);
    } else if (type === 'termination') {
      setTermForm({
        employeeName: item.employeeName,
        employeeId: item.employeeId,
        department: item.department,
        terminationDate: item.terminationDate,
        reason: item.reason,
        remarks: item.remarks,
        status: item.status
      });
      setShowTermModal(true);
    }
  };

  const handleDelete = (id: string, type: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      if (type === 'resignation') {
        setResignations(prev => prev.filter(r => r.id !== id));
      } else if (type === 'termination') {
        setTerminations(prev => prev.filter(t => t.id !== id));
      }
    }
  };

  const updateStatus = (id: string, newStatus: string, type: string) => {
    if (type === 'resignation') {
      setResignations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
    } else if (type === 'termination') {
      setTerminations(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
    }
  };

  const getResignationStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-0';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-0';
      case 'Rejected': return 'bg-red-100 text-red-800 border-0';
      default: return 'bg-gray-100 text-gray-800 border-0';
    }
  };

  const getTerminationStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-red-100 text-red-800 border-0';
      case 'Submitted': return 'bg-orange-100 text-orange-800 border-0';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-0';
      default: return 'bg-gray-100 text-gray-800 border-0';
    }
  };

  const filteredResignations = resignations.filter(r => 
    r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === '' || statusFilter === 'all' || r.status === statusFilter)
  );

  const filteredTerminations = terminations.filter(t => 
    t.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === '' || statusFilter === 'all' || t.status === statusFilter)
  );

  // KPI Data
  const kpiData = [
    {
      title: 'Total Resignations',
      value: resignations.length.toString(),
      icon: UserMinus,
      color: 'bg-blue-50'
    },
    {
      title: 'Pending Approvals',
      value: resignations.filter(r => r.status === 'Pending').length.toString(),
      icon: Clock,
      color: 'bg-yellow-50'
    },
    {
      title: 'Total Terminations',
      value: terminations.length.toString(),
      icon: AlertTriangle,
      color: 'bg-red-50'
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Exit Management</h2>
          <p className="text-gray-600 mt-1">Manage employee resignations and terminations</p>
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

      <Tabs defaultValue="resignations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="resignations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <UserMinus className="h-4 w-4 mr-2" />
            Resignations
          </TabsTrigger>
          <TabsTrigger value="terminations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Terminations
          </TabsTrigger>
        </TabsList>

        {/* Resignations Tab */}
        <TabsContent value="resignations">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-900">Resignations</CardTitle>
                <Dialog open={showResignModal} onOpenChange={setShowResignModal}>
                  <DialogTrigger asChild>
                    {/* <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => { 
                        setEditingItem(null); 
                        setResignForm({ employeeName: '', employeeId: '', department: '', resignationDate: '', lastWorkingDay: '', reason: '', status: 'Pending' }); 
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Resignation
                    </Button> */}
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Edit Resignation' : 'Add Resignation'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Employee Name *</Label>
                        <Input 
                          value={resignForm.employeeName} 
                          onChange={(e) => setResignForm({...resignForm, employeeName: e.target.value})} 
                          placeholder="Enter employee name"
                        />
                      </div>
                      <div>
                        <Label>Employee ID *</Label>
                        <Input 
                          value={resignForm.employeeId} 
                          onChange={(e) => setResignForm({...resignForm, employeeId: e.target.value})} 
                          placeholder="Enter employee ID"
                        />
                      </div>
                      <div>
                        <Label>Department *</Label>
                        <Input 
                          value={resignForm.department} 
                          onChange={(e) => setResignForm({...resignForm, department: e.target.value})} 
                          placeholder="Enter department"
                        />
                      </div>
                      <div>
                        <Label>Resignation Date *</Label>
                        <Input 
                          type="date" 
                          value={resignForm.resignationDate} 
                          onChange={(e) => setResignForm({...resignForm, resignationDate: e.target.value})} 
                        />
                      </div>
                      <div>
                        <Label>Last Working Day *</Label>
                        <Input 
                          type="date" 
                          value={resignForm.lastWorkingDay} 
                          onChange={(e) => setResignForm({...resignForm, lastWorkingDay: e.target.value})} 
                        />
                      </div>
                      <div>
                        <Label>Reason</Label>
                        <Textarea 
                          value={resignForm.reason} 
                          onChange={(e) => setResignForm({...resignForm, reason: e.target.value})} 
                          placeholder="Enter reason for resignation"
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select value={resignForm.status} onValueChange={(value: 'Pending' | 'Approved' | 'Rejected') => setResignForm({...resignForm, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddResignation} className="w-full bg-blue-600 hover:bg-blue-700">
                        {editingItem ? 'Update' : 'Add'} Resignation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search resignations..." 
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
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resignation Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Working Day</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResignations.map((resignation) => (
                      <tr key={resignation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{resignation.employeeName}</div>
                            <div className="text-sm text-gray-500">{resignation.employeeId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{resignation.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{resignation.resignationDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{resignation.lastWorkingDay}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{resignation.reason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Select value={resignation.status} onValueChange={(value) => updateStatus(resignation.id, value, 'resignation')}>
                            <SelectTrigger className="w-32">
                              <Badge className={getResignationStatusColor(resignation.status)}>
                                {resignation.status === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                                {resignation.status === 'Approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                                {resignation.status === 'Rejected' && <XCircle className="h-3 w-3 mr-1" />}
                                {resignation.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(resignation, 'resignation')}
                              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(resignation.id, 'resignation')}
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

        {/* Terminations Tab */}
        <TabsContent value="terminations">
          {/* Warning Banner */}
          <Card className="bg-orange-50 border-orange-200 shadow-sm border rounded-xl mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <h3 className="text-sm font-medium text-orange-800">Important Notice</h3>
                  <p className="text-sm text-orange-700 mt-1">
                    Termination actions require careful consideration and proper documentation. Ensure all policies are followed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Terminations
                </CardTitle>
                <Dialog open={showTermModal} onOpenChange={setShowTermModal}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => { 
                        setEditingItem(null); 
                        setTermForm({ employeeName: '', employeeId: '', department: '', terminationDate: '', reason: '', remarks: '', status: 'Draft' }); 
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Termination
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Edit Termination' : 'Add Termination'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Employee Name *</Label>
                        <Input 
                          value={termForm.employeeName} 
                          onChange={(e) => setTermForm({...termForm, employeeName: e.target.value})} 
                          placeholder="Enter employee name"
                        />
                      </div>
                      <div>
                        <Label>Employee ID *</Label>
                        <Input 
                          value={termForm.employeeId} 
                          onChange={(e) => setTermForm({...termForm, employeeId: e.target.value})} 
                          placeholder="Enter employee ID"
                        />
                      </div>
                      <div>
                        <Label>Department *</Label>
                        <Input 
                          value={termForm.department} 
                          onChange={(e) => setTermForm({...termForm, department: e.target.value})} 
                          placeholder="Enter department"
                        />
                      </div>
                      <div>
                        <Label>Termination Date *</Label>
                        <Input 
                          type="date" 
                          value={termForm.terminationDate} 
                          onChange={(e) => setTermForm({...termForm, terminationDate: e.target.value})} 
                        />
                      </div>
                      <div>
                        <Label>Reason *</Label>
                        <Textarea 
                          value={termForm.reason} 
                          onChange={(e) => setTermForm({...termForm, reason: e.target.value})} 
                          placeholder="Enter reason for termination"
                        />
                      </div>
                      <div>
                        <Label>Remarks</Label>
                        <Textarea 
                          value={termForm.remarks} 
                          onChange={(e) => setTermForm({...termForm, remarks: e.target.value})} 
                          placeholder="Additional remarks"
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select value={termForm.status} onValueChange={(value: 'Draft' | 'Submitted' | 'Approved') => setTermForm({...termForm, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Submitted">Submitted</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddTermination} className="w-full bg-red-600 hover:bg-red-700">
                        {editingItem ? 'Update' : 'Add'} Termination
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search terminations..." 
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
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Termination Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTerminations.map((termination) => (
                      <tr key={termination.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{termination.employeeName}</div>
                            <div className="text-sm text-gray-500">{termination.employeeId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{termination.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{termination.terminationDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{termination.reason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Select value={termination.status} onValueChange={(value) => updateStatus(termination.id, value, 'termination')}>
                            <SelectTrigger className="w-32">
                              <Badge className={getTerminationStatusColor(termination.status)}>
                                {termination.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Draft">Draft</SelectItem>
                              <SelectItem value="Submitted">Submitted</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(termination, 'termination')}
                              className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(termination.id, 'termination')}
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
    </div>
  );
};

export default ExitManagement;