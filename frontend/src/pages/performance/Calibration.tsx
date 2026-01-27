import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  TrendingUp, Search, Users, Edit, 
  CheckCircle, AlertCircle, Eye, MessageSquare, Lock
} from 'lucide-react';

interface CalibrationRecord {
  _id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  manager: string;
  originalRating: number;
  calibratedRating: number;
  justification: string;
  calibrationStatus: 'pending' | 'in-review' | 'approved' | 'rejected';
  reviewCycle: string;
  lastModified: string;
}

interface CalibrationSession {
  _id: string;
  sessionName: string;
  department: string;
  reviewCycle: string;
  participants: string[];
  totalEmployees: number;
  calibratedCount: number;
  status: 'scheduled' | 'in-progress' | 'completed';
  scheduledDate: string;
}

const Calibration = () => {
  const [activeView, setActiveView] = useState<'sessions' | 'records'>('sessions');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<CalibrationRecord | null>(null);

  const [justificationForm, setJustificationForm] = useState({
    calibratedRating: '',
    justification: ''
  });

  const sessions: CalibrationSession[] = [
    {
      _id: '1',
      sessionName: 'Engineering Team Calibration - Q4 2024',
      department: 'Engineering',
      reviewCycle: 'Annual 2024',
      participants: ['Sarah Wilson (Manager)', 'Robert Lee (Director)', 'HR Team'],
      totalEmployees: 45,
      calibratedCount: 45,
      status: 'completed',
      scheduledDate: '2024-12-20'
    },
    {
      _id: '2',
      sessionName: 'Sales Team Calibration - Q4 2024',
      department: 'Sales',
      reviewCycle: 'Annual 2024',
      participants: ['Mike Johnson (Manager)', 'Emily Davis (VP Sales)', 'HR Team'],
      totalEmployees: 30,
      calibratedCount: 18,
      status: 'in-progress',
      scheduledDate: '2024-12-22'
    },
    {
      _id: '3',
      sessionName: 'Product Team Calibration - Q4 2024',
      department: 'Product',
      reviewCycle: 'Annual 2024',
      participants: ['David Brown (Manager)', 'Jane Smith (Director)', 'HR Team'],
      totalEmployees: 25,
      calibratedCount: 0,
      status: 'scheduled',
      scheduledDate: '2024-12-28'
    }
  ];

  const records: CalibrationRecord[] = [
    {
      _id: '1',
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      department: 'Engineering',
      manager: 'Sarah Wilson',
      originalRating: 4.2,
      calibratedRating: 4.4,
      justification: 'Exceptional performance in Q4 projects. Led critical infrastructure improvements.',
      calibrationStatus: 'approved',
      reviewCycle: 'Annual 2024',
      lastModified: '2024-12-20'
    },
    {
      _id: '2',
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      department: 'Product',
      manager: 'David Brown',
      originalRating: 4.6,
      calibratedRating: 4.6,
      justification: 'Rating maintained. Consistent high performance across all metrics.',
      calibrationStatus: 'approved',
      reviewCycle: 'Annual 2024',
      lastModified: '2024-12-20'
    },
    {
      _id: '3',
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      department: 'Sales',
      manager: 'Emily Davis',
      originalRating: 4.0,
      calibratedRating: 3.8,
      justification: 'Adjusted to align with team distribution. Performance good but not exceptional compared to peers.',
      calibrationStatus: 'in-review',
      reviewCycle: 'Annual 2024',
      lastModified: '2024-12-22'
    },
    {
      _id: '4',
      employeeName: 'Sarah Wilson',
      employeeId: 'EMP004',
      department: 'Engineering',
      manager: 'Robert Lee',
      originalRating: 4.8,
      calibratedRating: 4.9,
      justification: 'Outstanding leadership and technical contributions. Mentored 5 junior engineers.',
      calibrationStatus: 'approved',
      reviewCycle: 'Annual 2024',
      lastModified: '2024-12-20'
    },
    {
      _id: '5',
      employeeName: 'David Brown',
      employeeId: 'EMP005',
      department: 'Operations',
      manager: 'Lisa Anderson',
      originalRating: 4.2,
      calibratedRating: 4.2,
      justification: 'Rating maintained. Performance aligns with expectations and peer comparison.',
      calibrationStatus: 'pending',
      reviewCycle: 'Annual 2024',
      lastModified: '2024-12-23'
    }
  ];

  const handleCalibrate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Calibrating rating:', justificationForm);
    setIsDialogOpen(false);
    setSelectedRecord(null);
    resetForm();
  };

  const resetForm = () => {
    setJustificationForm({
      calibratedRating: '',
      justification: ''
    });
  };

  const openCalibrationDialog = (record: CalibrationRecord) => {
    setSelectedRecord(record);
    setJustificationForm({
      calibratedRating: record.calibratedRating.toString(),
      justification: record.justification
    });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'scheduled': 'bg-blue-100 text-blue-800 border-0',
      'in-progress': 'bg-orange-100 text-orange-800 border-0',
      'completed': 'bg-green-100 text-green-800 border-0',
      'pending': 'bg-yellow-100 text-yellow-800 border-0',
      'in-review': 'bg-blue-100 text-blue-800 border-0',
      'approved': 'bg-green-100 text-green-800 border-0',
      'rejected': 'bg-red-100 text-red-800 border-0'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status.replace('-', ' ')}</Badge>;
  };

  const getRatingChange = (original: number, calibrated: number) => {
    const diff = calibrated - original;
    if (diff > 0) {
      return <span className="text-green-600 font-medium">+{diff.toFixed(1)}</span>;
    } else if (diff < 0) {
      return <span className="text-red-600 font-medium">{diff.toFixed(1)}</span>;
    }
    return <span className="text-gray-600 font-medium">No change</span>;
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'all' || record.department === filterDept;
    const matchesStatus = filterStatus === 'all' || record.calibrationStatus === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const stats = {
    totalCalibrated: records.filter(r => r.calibrationStatus === 'approved').length,
    pending: records.filter(r => r.calibrationStatus === 'pending').length,
    ratingIncreased: records.filter(r => r.calibratedRating > r.originalRating).length,
    ratingDecreased: records.filter(r => r.calibratedRating < r.originalRating).length
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Total Calibrated</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalCalibrated}</p>
            <p className="text-sm text-gray-500 mt-1">Approved ratings</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Pending Review</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pending}</p>
            <p className="text-sm text-gray-500 mt-1">Awaiting calibration</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Rating Increased</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.ratingIncreased}</p>
            <p className="text-sm text-gray-500 mt-1">Upward adjustments</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Rating Decreased</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.ratingDecreased}</p>
            <p className="text-sm text-gray-500 mt-1">Downward adjustments</p>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-3">
        <Button 
          variant={activeView === 'sessions' ? 'default' : 'outline'}
          onClick={() => setActiveView('sessions')}
          className={activeView === 'sessions' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : ''}
        >
          <Users className="h-4 w-4 mr-2" />Calibration Sessions
        </Button>
        <Button 
          variant={activeView === 'records' ? 'default' : 'outline'}
          onClick={() => setActiveView('records')}
          className={activeView === 'records' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : ''}
        >
          <TrendingUp className="h-4 w-4 mr-2" />Calibration Records
        </Button>
      </div>

      {/* Calibration Sessions View */}
      {activeView === 'sessions' && (
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Calibration Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Session Name</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Review Cycle</TableHead>
                  <TableHead className="font-semibold">Participants</TableHead>
                  <TableHead className="font-semibold">Progress</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Scheduled Date</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{session.sessionName}</TableCell>
                    <TableCell>{session.department}</TableCell>
                    <TableCell>{session.reviewCycle}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {session.participants.map((participant, idx) => (
                          <div key={idx} className="text-gray-700">{participant}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{session.calibratedCount}</span> / {session.totalEmployees}
                        <div className="text-gray-500">
                          {Math.round((session.calibratedCount / session.totalEmployees) * 100)}% complete
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                    <TableCell>{new Date(session.scheduledDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="View Session">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {session.status === 'completed' && (
                          <Button variant="ghost" size="sm" title="Lock Session">
                            <Lock className="h-4 w-4" />
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
      )}

      {/* Calibration Records View */}
      {activeView === 'records' && (
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Calibration Records</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search employees..." 
                    className="pl-10 w-64" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterDept} onValueChange={setFilterDept}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Employee</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="font-semibold">Manager</TableHead>
                  <TableHead className="font-semibold">Original Rating</TableHead>
                  <TableHead className="font-semibold">Calibrated Rating</TableHead>
                  <TableHead className="font-semibold">Change</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{record.employeeName}</div>
                        <div className="text-sm text-gray-500">{record.employeeId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.manager}</TableCell>
                    <TableCell>
                      <span className="text-lg font-semibold text-gray-700">{record.originalRating.toFixed(1)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-lg font-semibold text-blue-600">{record.calibratedRating.toFixed(1)}</span>
                    </TableCell>
                    <TableCell>{getRatingChange(record.originalRating, record.calibratedRating)}</TableCell>
                    <TableCell>{getStatusBadge(record.calibrationStatus)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Edit Calibration"
                          onClick={() => openCalibrationDialog(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="View Justification">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        {record.calibrationStatus === 'approved' && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Calibration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Calibrate Rating - {selectedRecord?.employeeName}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCalibrate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Original Rating</Label>
                <Input value={selectedRecord?.originalRating.toFixed(1)} disabled />
              </div>
              <div className="space-y-2">
                <Label>Calibrated Rating *</Label>
                <Input 
                  type="number" 
                  step="0.1"
                  min="1"
                  max="5"
                  value={justificationForm.calibratedRating} 
                  onChange={(e) => setJustificationForm({...justificationForm, calibratedRating: e.target.value})} 
                  placeholder="Enter calibrated rating"
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Justification *</Label>
                <Textarea 
                  value={justificationForm.justification} 
                  onChange={(e) => setJustificationForm({...justificationForm, justification: e.target.value})} 
                  placeholder="Provide detailed justification for the rating adjustment"
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Save Calibration
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calibration;
