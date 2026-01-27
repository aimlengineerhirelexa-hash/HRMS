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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, Search, Calendar, Users, FileText, 
  Edit, Eye, Lock, MessageSquare, Send, Clock
} from 'lucide-react';

interface ReviewCycle {
  _id: string;
  cycleName: string;
  reviewPeriod: string;
  reviewType: 'annual' | 'quarterly' | 'mid-year';
  template: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'locked';
  totalReviewees: number;
  completedReviews: number;
  selfReviewEnabled: boolean;
}

interface Review {
  _id: string;
  reviewCycle: string;
  reviewee: string;
  revieweeDept: string;
  reviewers: string[];
  selfReviewStatus: 'pending' | 'submitted' | 'not-required';
  managerReviewStatus: 'pending' | 'submitted';
  overallStatus: 'not-started' | 'in-progress' | 'completed' | 'locked';
  dueDate: string;
  submittedDate?: string;
}

const PerformanceReviews = () => {
  const [activeView, setActiveView] = useState<'cycles' | 'reviews'>('cycles');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [cycleForm, setCycleForm] = useState({
    cycleName: '',
    reviewPeriod: '',
    reviewType: 'annual',
    template: '',
    startDate: '',
    endDate: '',
    selfReviewEnabled: true
  });

  const reviewCycles: ReviewCycle[] = [
    {
      _id: '1',
      cycleName: 'Annual Performance Review 2024',
      reviewPeriod: 'Jan 2024 - Dec 2024',
      reviewType: 'annual',
      template: 'Standard Annual Template',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      status: 'active',
      totalReviewees: 150,
      completedReviews: 45,
      selfReviewEnabled: true
    },
    {
      _id: '2',
      cycleName: 'Q2 2024 Review',
      reviewPeriod: 'Apr 2024 - Jun 2024',
      reviewType: 'quarterly',
      template: 'Quarterly Check-in Template',
      startDate: '2024-06-15',
      endDate: '2024-06-30',
      status: 'completed',
      totalReviewees: 150,
      completedReviews: 150,
      selfReviewEnabled: true
    },
    {
      _id: '3',
      cycleName: 'Mid-Year Review 2024',
      reviewPeriod: 'Jan 2024 - Jun 2024',
      reviewType: 'mid-year',
      template: 'Mid-Year Assessment Template',
      startDate: '2024-07-01',
      endDate: '2024-07-15',
      status: 'draft',
      totalReviewees: 155,
      completedReviews: 0,
      selfReviewEnabled: false
    }
  ];

  const reviews: Review[] = [
    {
      _id: '1',
      reviewCycle: 'Annual Performance Review 2024',
      reviewee: 'John Doe',
      revieweeDept: 'Engineering',
      reviewers: ['Sarah Wilson (Manager)', 'Mike Johnson (Peer)'],
      selfReviewStatus: 'submitted',
      managerReviewStatus: 'pending',
      overallStatus: 'in-progress',
      dueDate: '2024-12-31'
    },
    {
      _id: '2',
      reviewCycle: 'Annual Performance Review 2024',
      reviewee: 'Jane Smith',
      revieweeDept: 'Product',
      reviewers: ['David Brown (Manager)'],
      selfReviewStatus: 'pending',
      managerReviewStatus: 'pending',
      overallStatus: 'not-started',
      dueDate: '2024-12-31'
    },
    {
      _id: '3',
      reviewCycle: 'Annual Performance Review 2024',
      reviewee: 'Mike Johnson',
      revieweeDept: 'Sales',
      reviewers: ['Emily Davis (Manager)', 'John Doe (Peer)'],
      selfReviewStatus: 'submitted',
      managerReviewStatus: 'submitted',
      overallStatus: 'completed',
      dueDate: '2024-12-31',
      submittedDate: '2024-12-15'
    },
    {
      _id: '4',
      reviewCycle: 'Q2 2024 Review',
      reviewee: 'Sarah Wilson',
      revieweeDept: 'Engineering',
      reviewers: ['Robert Lee (Manager)'],
      selfReviewStatus: 'submitted',
      managerReviewStatus: 'submitted',
      overallStatus: 'locked',
      dueDate: '2024-06-30',
      submittedDate: '2024-06-28'
    }
  ];

  const handleCreateCycle = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating review cycle:', cycleForm);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCycleForm({
      cycleName: '',
      reviewPeriod: '',
      reviewType: 'annual',
      template: '',
      startDate: '',
      endDate: '',
      selfReviewEnabled: true
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'draft': 'bg-gray-100 text-gray-800 border-0',
      'active': 'bg-blue-100 text-blue-800 border-0',
      'completed': 'bg-green-100 text-green-800 border-0',
      'locked': 'bg-purple-100 text-purple-800 border-0',
      'pending': 'bg-yellow-100 text-yellow-800 border-0',
      'submitted': 'bg-green-100 text-green-800 border-0',
      'not-required': 'bg-gray-100 text-gray-800 border-0',
      'not-started': 'bg-red-100 text-red-800 border-0',
      'in-progress': 'bg-orange-100 text-orange-800 border-0',
      'annual': 'bg-purple-100 text-purple-800 border-0',
      'quarterly': 'bg-blue-100 text-blue-800 border-0',
      'mid-year': 'bg-teal-100 text-teal-800 border-0'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status.replace('-', ' ')}</Badge>;
  };

  const filteredCycles = reviewCycles.filter(cycle => {
    const matchesSearch = cycle.cycleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cycle.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.reviewee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewCycle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || review.overallStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 mt-6">
      {/* View Toggle */}
      <div className="flex items-center gap-3">
        <Button 
          variant={activeView === 'cycles' ? 'default' : 'outline'}
          onClick={() => setActiveView('cycles')}
          className={activeView === 'cycles' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : ''}
        >
          <Calendar className="h-4 w-4 mr-2" />Review Cycles
        </Button>
        <Button 
          variant={activeView === 'reviews' ? 'default' : 'outline'}
          onClick={() => setActiveView('reviews')}
          className={activeView === 'reviews' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : ''}
        >
          <Users className="h-4 w-4 mr-2" />Individual Reviews
        </Button>
      </div>

      {/* Review Cycles View */}
      {activeView === 'cycles' && (
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Review Cycles</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search cycles..." 
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <Plus className="h-4 w-4 mr-2" />Create Cycle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Review Cycle</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateCycle} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                          <Label>Cycle Name *</Label>
                          <Input 
                            value={cycleForm.cycleName} 
                            onChange={(e) => setCycleForm({...cycleForm, cycleName: e.target.value})} 
                            placeholder="e.g., Annual Performance Review 2024"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Review Period *</Label>
                          <Input 
                            value={cycleForm.reviewPeriod} 
                            onChange={(e) => setCycleForm({...cycleForm, reviewPeriod: e.target.value})} 
                            placeholder="e.g., Jan 2024 - Dec 2024"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Review Type *</Label>
                          <Select value={cycleForm.reviewType} onValueChange={(value) => setCycleForm({...cycleForm, reviewType: value as any})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="annual">Annual</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="mid-year">Mid-Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>Review Template *</Label>
                          <Select value={cycleForm.template} onValueChange={(value) => setCycleForm({...cycleForm, template: value})}>
                            <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard Annual Template</SelectItem>
                              <SelectItem value="quarterly">Quarterly Check-in Template</SelectItem>
                              <SelectItem value="360">360 Degree Feedback Template</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date *</Label>
                          <Input 
                            type="date" 
                            value={cycleForm.startDate} 
                            onChange={(e) => setCycleForm({...cycleForm, startDate: e.target.value})} 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date *</Label>
                          <Input 
                            type="date" 
                            value={cycleForm.endDate} 
                            onChange={(e) => setCycleForm({...cycleForm, endDate: e.target.value})} 
                            required
                          />
                        </div>
                        <div className="col-span-2 flex items-center space-x-2">
                          <Checkbox 
                            id="selfReview" 
                            checked={cycleForm.selfReviewEnabled}
                            onCheckedChange={(checked) => setCycleForm({...cycleForm, selfReviewEnabled: checked as boolean})}
                          />
                          <Label htmlFor="selfReview" className="cursor-pointer">Enable Self Review</Label>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                          Create Cycle
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Cycle Name</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Period</TableHead>
                  <TableHead className="font-semibold">Timeline</TableHead>
                  <TableHead className="font-semibold">Progress</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCycles.map((cycle) => (
                  <TableRow key={cycle._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{cycle.cycleName}</div>
                        <div className="text-sm text-gray-500">{cycle.template}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(cycle.reviewType)}</TableCell>
                    <TableCell>{cycle.reviewPeriod}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(cycle.startDate).toLocaleDateString()}</div>
                        <div className="text-gray-500">to {new Date(cycle.endDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{cycle.completedReviews}</span> / {cycle.totalReviewees}
                        <div className="text-gray-500">
                          {Math.round((cycle.completedReviews / cycle.totalReviewees) * 100)}% complete
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(cycle.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {cycle.status === 'draft' && (
                          <Button variant="ghost" size="sm" title="Edit Cycle">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {cycle.status === 'active' && (
                          <Button variant="ghost" size="sm" title="Send Reminders">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {cycle.status === 'completed' && (
                          <Button variant="ghost" size="sm" title="Lock Cycle">
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

      {/* Individual Reviews View */}
      {activeView === 'reviews' && (
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Individual Reviews</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search reviews..." 
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
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Employee</TableHead>
                  <TableHead className="font-semibold">Review Cycle</TableHead>
                  <TableHead className="font-semibold">Reviewers</TableHead>
                  <TableHead className="font-semibold">Self Review</TableHead>
                  <TableHead className="font-semibold">Manager Review</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{review.reviewee}</div>
                        <div className="text-sm text-gray-500">{review.revieweeDept}</div>
                      </div>
                    </TableCell>
                    <TableCell>{review.reviewCycle}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {review.reviewers.map((reviewer, idx) => (
                          <div key={idx} className="text-gray-700">{reviewer}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(review.selfReviewStatus)}</TableCell>
                    <TableCell>{getStatusBadge(review.managerReviewStatus)}</TableCell>
                    <TableCell>{getStatusBadge(review.overallStatus)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {new Date(review.dueDate).toLocaleDateString()}
                        </div>
                        {review.submittedDate && (
                          <div className="text-green-600 text-xs mt-1">
                            Submitted: {new Date(review.submittedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="View Review">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {review.overallStatus !== 'locked' && (
                          <Button variant="ghost" size="sm" title="Edit Review">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" title="Comments">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceReviews;
