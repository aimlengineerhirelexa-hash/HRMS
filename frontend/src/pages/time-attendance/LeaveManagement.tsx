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
import { Calendar, Plus, CheckCircle, XCircle, Clock, Settings, History, FileCheck } from 'lucide-react';

const LeaveManagement: React.FC = () => {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employee: 'John Smith', dateRange: 'Jan 20 - Jan 22', type: 'Annual Leave', days: 3, reason: 'Family vacation', status: 'pending' },
    { id: 2, employee: 'Sarah Johnson', dateRange: 'Feb 05 - Feb 05', type: 'Sick Leave', days: 1, reason: 'Medical appointment', status: 'approved' }
  ]);
  
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    type: '',
    reason: '',
    days: 0
  });

  const [policyForm, setPolicyForm] = useState({
    type: '',
    totalDays: '',
    carryForward: '',
    minNotice: '',
    maxConsecutive: ''
  });

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest = {
      id: leaveRequests.length + 1,
      employee: 'Current User',
      dateRange: `${leaveForm.startDate} - ${leaveForm.endDate}`,
      type: leaveForm.type,
      days: leaveForm.days,
      reason: leaveForm.reason,
      status: 'pending'
    };
    setLeaveRequests([...leaveRequests, newRequest]);
    setIsLeaveDialogOpen(false);
    setLeaveForm({ startDate: '', endDate: '', type: '', reason: '', days: 0 });
  };

  const handlePolicySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Policy created:', policyForm);
    setIsPolicyDialogOpen(false);
    setPolicyForm({ type: '', totalDays: '', carryForward: '', minNotice: '', maxConsecutive: '' });
  };

  const handleApproval = (id: number, action: 'approve' | 'reject') => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, status: action === 'approve' ? 'approved' : 'rejected' }
          : request
      )
    );
  };

  const calculateDays = () => {
    if (leaveForm.startDate && leaveForm.endDate) {
      const start = new Date(leaveForm.startDate);
      const end = new Date(leaveForm.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setLeaveForm({...leaveForm, days: diffDays});
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Leave Management</h2>
          <p className="text-gray-600 mt-1">Manage employee leave requests, balances, and approvals</p>
        </div>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="requests">
            <Calendar className="h-4 w-4 mr-2" />
            Leave Requests
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Leave History
          </TabsTrigger>
          <TabsTrigger value="approvals">
            <FileCheck className="h-4 w-4 mr-2" />
            Approvals
          </TabsTrigger>
          <TabsTrigger value="policies">
            <Settings className="h-4 w-4 mr-2" />
            Policies
          </TabsTrigger>
        </TabsList>

        {/* Leave Requests */}
        <TabsContent value="requests">
          <div className="grid gap-6">
            {/* Leave Balance Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-4 bg-blue-50 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-800">Annual Leave</h3>
                    <p className="text-2xl font-bold text-blue-900 mt-1">12</p>
                    <p className="text-sm text-blue-600">Days remaining</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </Card>
              <Card className="p-4 bg-green-50 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-green-800">Sick Leave</h3>
                    <p className="text-2xl font-bold text-green-900 mt-1">8</p>
                    <p className="text-sm text-green-600">Days remaining</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </Card>
              <Card className="p-4 bg-purple-50 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-purple-800">Personal Leave</h3>
                    <p className="text-2xl font-bold text-purple-900 mt-1">5</p>
                    <p className="text-sm text-purple-600">Days remaining</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </Card>
              <Card className="p-4 bg-orange-50 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-orange-800">Comp Off</h3>
                    <p className="text-2xl font-bold text-orange-900 mt-1">3</p>
                    <p className="text-sm text-orange-600">Days available</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
              </Card>
            </div>

            {/* Leave Requests */}
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-gray-900">My Leave Requests</CardTitle>
                  <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Apply Leave
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Apply for Leave</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleLeaveSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={leaveForm.startDate}
                              onChange={(e) => {
                                setLeaveForm({...leaveForm, startDate: e.target.value});
                                setTimeout(calculateDays, 100);
                              }}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={leaveForm.endDate}
                              onChange={(e) => {
                                setLeaveForm({...leaveForm, endDate: e.target.value});
                                setTimeout(calculateDays, 100);
                              }}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Leave Type</Label>
                          <Select value={leaveForm.type} onValueChange={(value) => setLeaveForm({...leaveForm, type: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="annual">Annual Leave</SelectItem>
                              <SelectItem value="sick">Sick Leave</SelectItem>
                              <SelectItem value="personal">Personal Leave</SelectItem>
                              <SelectItem value="comp-off">Comp Off</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="days">Total Days</Label>
                          <Input
                            id="days"
                            type="number"
                            value={leaveForm.days}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reason">Reason</Label>
                          <Textarea
                            id="reason"
                            placeholder="Please provide reason for leave"
                            value={leaveForm.reason}
                            onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                            required
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Apply Leave
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Range</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {leaveRequests.filter(req => req.employee === 'Current User' || req.employee === 'John Smith').map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 text-sm text-gray-900">{request.dateRange}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{request.type}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{request.days}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{request.reason}</td>
                          <td className="px-6 py-4">
                            <Badge className={`border-0 ${
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                              {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
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

        {/* Leave History */}
        <TabsContent value="history">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Leave History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carried Forward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">2024</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Annual Leave</td>
                      <td className="px-6 py-4 text-sm text-gray-600">21</td>
                      <td className="px-6 py-4 text-sm text-gray-600">9</td>
                      <td className="px-6 py-4 text-sm text-gray-600">12</td>
                      <td className="px-6 py-4 text-sm text-gray-600">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">2023</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Annual Leave</td>
                      <td className="px-6 py-4 text-sm text-gray-600">21</td>
                      <td className="px-6 py-4 text-sm text-gray-600">18</td>
                      <td className="px-6 py-4 text-sm text-gray-600">3</td>
                      <td className="px-6 py-4 text-sm text-gray-600">3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Approvals */}
        <TabsContent value="approvals">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Leave Approvals (Manager View)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Range</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaveRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">{request.employee}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{request.dateRange}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{request.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{request.days}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{request.reason}</td>
                        <td className="px-6 py-4">
                          <Badge className={`border-0 ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproval(request.id, 'approve')}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-300 text-red-700 hover:bg-red-50"
                                onClick={() => handleApproval(request.id, 'reject')}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                          {request.status !== 'pending' && (
                            <span className="text-sm text-gray-500">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Policies */}
        <TabsContent value="policies">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-900">Leave Policies Configuration</CardTitle>
                <Dialog open={isPolicyDialogOpen} onOpenChange={setIsPolicyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Policy
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create Leave Policy</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePolicySubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="policyType">Leave Type</Label>
                        <Select value={policyForm.type} onValueChange={(value) => setPolicyForm({...policyForm, type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annual">Annual Leave</SelectItem>
                            <SelectItem value="sick">Sick Leave</SelectItem>
                            <SelectItem value="personal">Personal Leave</SelectItem>
                            <SelectItem value="maternity">Maternity Leave</SelectItem>
                            <SelectItem value="paternity">Paternity Leave</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalDays">Total Days per Year</Label>
                        <Input
                          id="totalDays"
                          type="number"
                          value={policyForm.totalDays}
                          onChange={(e) => setPolicyForm({...policyForm, totalDays: e.target.value})}
                          placeholder="21"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="carryForward">Carry Forward Days</Label>
                        <Input
                          id="carryForward"
                          type="number"
                          value={policyForm.carryForward}
                          onChange={(e) => setPolicyForm({...policyForm, carryForward: e.target.value})}
                          placeholder="5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minNotice">Minimum Notice (days)</Label>
                        <Input
                          id="minNotice"
                          type="number"
                          value={policyForm.minNotice}
                          onChange={(e) => setPolicyForm({...policyForm, minNotice: e.target.value})}
                          placeholder="2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxConsecutive">Max Consecutive Days</Label>
                        <Input
                          id="maxConsecutive"
                          type="number"
                          value={policyForm.maxConsecutive}
                          onChange={(e) => setPolicyForm({...policyForm, maxConsecutive: e.target.value})}
                          placeholder="15"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsPolicyDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          Create Policy
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Annual Leave Policy</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 21 days per year</li>
                      <li>• Can carry forward 5 days</li>
                      <li>• Minimum 2 days advance notice</li>
                      <li>• Maximum 15 consecutive days</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Sick Leave Policy</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 12 days per year</li>
                      <li>• Medical certificate required for 3+ days</li>
                      <li>• Cannot be carried forward</li>
                      <li>• No advance notice required</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Personal Leave Policy</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 7 days per year</li>
                      <li>• 1 week advance notice required</li>
                      <li>• Subject to manager approval</li>
                      <li>• Cannot be carried forward</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Comp Off Policy</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Earned for overtime work</li>
                      <li>• Must be used within 90 days</li>
                      <li>• Cannot exceed 10 days</li>
                      <li>• Manager approval required</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveManagement;