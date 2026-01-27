import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Plus, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const AttendanceTracking: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    reason: '',
    checkInTime: '',
    checkOutTime: ''
  });

  // Sample attendance data
  const attendanceData: Record<string, { status: string; checkIn: string | null; checkOut: string | null }> = {
    '2024-01-15': { status: 'present', checkIn: '09:00', checkOut: '18:00' },
    '2024-01-16': { status: 'present', checkIn: '09:15', checkOut: '18:30' },
    '2024-01-17': { status: 'absent', checkIn: null, checkOut: null },
    '2024-01-18': { status: 'present', checkIn: '08:45', checkOut: '17:45' },
    '2024-01-19': { status: 'leave', checkIn: null, checkOut: null },
    '2024-01-22': { status: 'present', checkIn: '09:00', checkOut: '18:00' },
    '2024-01-23': { status: 'present', checkIn: '09:30', checkOut: '18:15' },
    '2024-01-24': { status: 'present', checkIn: '09:00', checkOut: '18:00' },
    '2024-01-25': { status: 'present', checkIn: '08:50', checkOut: '17:50' },
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (day: number, month: number, year: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getAttendanceStatus = (day: number) => {
    const dateStr = formatDate(day, selectedMonth, selectedYear);
    return attendanceData[dateStr] || null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'absent': return 'bg-red-500';
      case 'leave': return 'bg-blue-500';
      case 'holiday': return 'bg-purple-500';
      default: return 'bg-gray-300';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attendance request submitted:', formData);
    setIsDialogOpen(false);
    setFormData({ date: '', type: '', reason: '', checkInTime: '', checkOutTime: '' });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const attendance = getAttendanceStatus(day);
      const isToday = day === new Date().getDate() && 
                     selectedMonth === new Date().getMonth() && 
                     selectedYear === new Date().getFullYear();

      days.push(
        <div key={day} className={`h-12 border border-gray-200 flex items-center justify-center relative cursor-pointer hover:bg-gray-50 transition-colors ${
          isToday ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
        }`}>
          <span className={`text-sm font-medium ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>{day}</span>
          {attendance && (
            <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${getStatusColor(attendance.status)}`}></div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Attendance Tracking</h2>
          <p className="text-gray-600 mt-1">View daily attendance records and calendar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Calendar */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Attendance Calendar
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium min-w-[160px] text-center">
                    {months[selectedMonth]} {selectedYear}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="h-10 bg-gray-100 border-r border-gray-200 last:border-r-0 flex items-center justify-center font-medium text-gray-700 text-sm">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Leave</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Holiday</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Punch In/Out Section */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Time Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 mb-3">Punch In/Out</h3>
                <div className="space-y-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Clock className="h-4 w-4 mr-2" />
                    Punch In - 09:00 AM
                  </Button>
                  <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50">
                    <Clock className="h-4 w-4 mr-2" />
                    Punch Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance Requests */}
      <Card className="bg-white shadow-sm border-0 rounded-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-900">Attendance Requests</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>New Attendance Request</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Request Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regularization">Regularization</SelectItem>
                        <SelectItem value="missed-punch">Missed Punch In/Out</SelectItem>
                        <SelectItem value="early-departure">Early Departure</SelectItem>
                        <SelectItem value="late-arrival">Late Arrival</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.type === 'regularization' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="checkIn">Check In Time</Label>
                          <Input
                            id="checkIn"
                            type="time"
                            value={formData.checkInTime}
                            onChange={(e) => setFormData({...formData, checkInTime: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="checkOut">Check Out Time</Label>
                          <Input
                            id="checkOut"
                            type="time"
                            value={formData.checkOutTime}
                            onChange={(e) => setFormData({...formData, checkOutTime: e.target.value})}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please provide a reason for your request"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">2024-01-15</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Regularization</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Forgot to punch in</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceTracking;