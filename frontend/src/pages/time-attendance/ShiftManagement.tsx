import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer, Plus, Settings, Users, RotateCcw, FileText, CheckCircle, XCircle } from 'lucide-react';

const ShiftManagement: React.FC = () => {
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isChangeRequestDialogOpen, setIsChangeRequestDialogOpen] = useState(false);
  
  const [shiftForm, setShiftForm] = useState({
    name: '',
    type: '',
    startTime: '',
    endTime: '',
    breakDuration: '',
    status: 'active'
  });

  const [assignForm, setAssignForm] = useState({
    department: '',
    employee: '',
    shift: '',
    startDate: '',
    endDate: ''
  });

  const [changeRequestForm, setChangeRequestForm] = useState({
    currentShift: '',
    requestedShift: '',
    dateRange: '',
    reason: ''
  });

  const handleShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Shift created:', shiftForm);
    setIsShiftDialogOpen(false);
    setShiftForm({ name: '', type: '', startTime: '', endTime: '', breakDuration: '', status: 'active' });
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Shift assigned:', assignForm);
    setIsAssignDialogOpen(false);
    setAssignForm({ department: '', employee: '', shift: '', startDate: '', endDate: '' });
  };

  const handleChangeRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Change request submitted:', changeRequestForm);
    setIsChangeRequestDialogOpen(false);
    setChangeRequestForm({ currentShift: '', requestedShift: '', dateRange: '', reason: '' });
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Shift Management</h2>
          <p className="text-gray-600 mt-1">Configure and manage employee work shifts and schedules</p>
        </div>
      </div>

      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="configuration">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="assignment">
            <Users className="h-4 w-4 mr-2" />
            Assignment
          </TabsTrigger>

          <TabsTrigger value="requests">
            <FileText className="h-4 w-4 mr-2" />
            Change Requests
          </TabsTrigger>
          <TabsTrigger value="approvals">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approvals
          </TabsTrigger>
        </TabsList>

        {/* Shift Configuration */}
        <TabsContent value="configuration">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-900">Shift Configuration</CardTitle>
                <Dialog open={isShiftDialogOpen} onOpenChange={setIsShiftDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Shift
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Shift</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleShiftSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="shiftName">Shift Name</Label>
                        <Input
                          id="shiftName"
                          value={shiftForm.name}
                          onChange={(e) => setShiftForm({...shiftForm, name: e.target.value})}
                          placeholder="e.g., Morning Shift"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shiftType">Shift Type</Label>
                        <Select value={shiftForm.type} onValueChange={(value) => setShiftForm({...shiftForm, type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shift type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed</SelectItem>
                            <SelectItem value="rotational">Rotational</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={shiftForm.startTime}
                            onChange={(e) => setShiftForm({...shiftForm, startTime: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={shiftForm.endTime}
                            onChange={(e) => setShiftForm({...shiftForm, endTime: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                        <Input
                          id="breakDuration"
                          type="number"
                          value={shiftForm.breakDuration}
                          onChange={(e) => setShiftForm({...shiftForm, breakDuration: e.target.value})}
                          placeholder="60"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={shiftForm.status} onValueChange={(value) => setShiftForm({...shiftForm, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsShiftDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          Create Shift
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">Morning Shift</h3>
                    <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">09:00 AM - 06:00 PM</p>
                  <p className="text-xs text-gray-500 mb-3">Break: 60 minutes | Type: Fixed</p>
                  <Button variant="ghost" size="sm">Edit</Button>
                </Card>
                <Card className="p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">Evening Shift</h3>
                    <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">02:00 PM - 11:00 PM</p>
                  <p className="text-xs text-gray-500 mb-3">Break: 45 minutes | Type: Fixed</p>
                  <Button variant="ghost" size="sm">Edit</Button>
                </Card>
                <Card className="p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">Night Shift</h3>
                    <Badge className="bg-yellow-100 text-yellow-800 border-0">Rotational</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">11:00 PM - 08:00 AM</p>
                  <p className="text-xs text-gray-500 mb-3">Break: 60 minutes | Type: Rotational</p>
                  <Button variant="ghost" size="sm">Edit</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shift Assignment */}
        <TabsContent value="assignment">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-900">Shift Assignment</CardTitle>
                <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Assign Shift
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Assign Shift to Employee</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAssignSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select value={assignForm.department} onValueChange={(value) => setAssignForm({...assignForm, department: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="hr">Human Resources</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employee">Employee</Label>
                        <Select value={assignForm.employee} onValueChange={(value) => setAssignForm({...assignForm, employee: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="john-smith">John Smith</SelectItem>
                            <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                            <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shift">Shift</Label>
                        <Select value={assignForm.shift} onValueChange={(value) => setAssignForm({...assignForm, shift: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning Shift</SelectItem>
                            <SelectItem value="evening">Evening Shift</SelectItem>
                            <SelectItem value="night">Night Shift</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Effective Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={assignForm.startDate}
                            onChange={(e) => setAssignForm({...assignForm, startDate: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">Effective End Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={assignForm.endDate}
                            onChange={(e) => setAssignForm({...assignForm, endDate: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          Assign Shift
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Shift</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">John Smith</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Engineering</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Morning Shift</td>
                      <td className="px-6 py-4 text-sm text-gray-600">2024-01-01</td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm">Change</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shift Rotation */}
        <TabsContent value="rotation">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Shift Rotation Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-3">Night Shift Rotation</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Pattern:</span>
                      <p className="font-medium">Weekly Rotation</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Frequency:</span>
                      <p className="font-medium">Every 7 days</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Auto Move:</span>
                      <Badge className="bg-green-100 text-green-800 border-0">Enabled</Badge>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Week</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Week</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rotation Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">Mike Wilson</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Night Shift</td>
                        <td className="px-6 py-4 text-sm text-gray-600">Morning Shift</td>
                        <td className="px-6 py-4 text-sm text-gray-600">2024-01-29</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Change Requests */}
        <TabsContent value="requests">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-900">Shift Change Requests</CardTitle>
                <Dialog open={isChangeRequestDialogOpen} onOpenChange={setIsChangeRequestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Request Change
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Shift Change Request</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleChangeRequestSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentShift">Current Shift</Label>
                        <Select value={changeRequestForm.currentShift} onValueChange={(value) => setChangeRequestForm({...changeRequestForm, currentShift: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select current shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning Shift</SelectItem>
                            <SelectItem value="evening">Evening Shift</SelectItem>
                            <SelectItem value="night">Night Shift</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="requestedShift">Requested Shift</Label>
                        <Select value={changeRequestForm.requestedShift} onValueChange={(value) => setChangeRequestForm({...changeRequestForm, requestedShift: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select requested shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning Shift</SelectItem>
                            <SelectItem value="evening">Evening Shift</SelectItem>
                            <SelectItem value="night">Night Shift</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateRange">Date Range</Label>
                        <Input
                          id="dateRange"
                          value={changeRequestForm.dateRange}
                          onChange={(e) => setChangeRequestForm({...changeRequestForm, dateRange: e.target.value})}
                          placeholder="e.g., 2024-02-01 to 2024-02-07"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                          id="reason"
                          value={changeRequestForm.reason}
                          onChange={(e) => setChangeRequestForm({...changeRequestForm, reason: e.target.value})}
                          placeholder="Please provide reason for shift change"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsChangeRequestDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          Submit Request
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Shift</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested Shift</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Range</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Sarah Johnson</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Evening Shift</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Morning Shift</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Feb 1-7, 2024</td>
                      <td className="px-6 py-4">
                        <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals */}
        <TabsContent value="approvals">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Shift Change Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Sarah Johnson</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Evening → Morning</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Personal reasons</td>
                      <td className="px-6 py-4">
                        <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
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

export default ShiftManagement;