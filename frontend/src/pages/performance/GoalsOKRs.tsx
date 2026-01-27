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
import { Progress } from '@/components/ui/progress';
import { 
  Target, Plus, Search, Filter, Edit, Trash2, 
  MessageSquare, History, Eye, TrendingUp, Users, Building2
} from 'lucide-react';

interface Goal {
  _id: string;
  title: string;
  type: 'objective' | 'key-result';
  description: string;
  owner: string;
  department?: string;
  startDate: string;
  endDate: string;
  weightage: number;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  alignment?: string;
  visibility: 'public' | 'private' | 'team';
  comments: number;
}

const GoalsOKRs = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [goalForm, setGoalForm] = useState({
    title: '',
    type: 'objective',
    description: '',
    owner: '',
    department: '',
    startDate: '',
    endDate: '',
    weightage: '',
    alignment: '',
    visibility: 'public'
  });

  const goals: Goal[] = [
    {
      _id: '1',
      title: 'Increase Revenue by 30%',
      type: 'objective',
      description: 'Drive revenue growth through new customer acquisition',
      owner: 'John Doe',
      department: 'Sales',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      weightage: 40,
      progress: 65,
      status: 'in-progress',
      alignment: 'Company Goal',
      visibility: 'public',
      comments: 5
    },
    {
      _id: '2',
      title: 'Launch 3 New Products',
      type: 'key-result',
      description: 'Successfully launch and market 3 new product lines',
      owner: 'Jane Smith',
      department: 'Product',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      weightage: 35,
      progress: 33,
      status: 'in-progress',
      alignment: 'Increase Revenue by 30%',
      visibility: 'team',
      comments: 12
    },
    {
      _id: '3',
      title: 'Improve Customer Satisfaction Score',
      type: 'objective',
      description: 'Achieve NPS score of 70+',
      owner: 'Mike Johnson',
      department: 'Customer Success',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      weightage: 25,
      progress: 80,
      status: 'in-progress',
      alignment: 'Company Goal',
      visibility: 'public',
      comments: 8
    },
    {
      _id: '4',
      title: 'Reduce Operational Costs by 15%',
      type: 'objective',
      description: 'Optimize processes and reduce unnecessary expenses',
      owner: 'Sarah Wilson',
      department: 'Operations',
      startDate: '2024-01-01',
      endDate: '2024-09-30',
      weightage: 30,
      progress: 100,
      status: 'completed',
      alignment: 'Company Goal',
      visibility: 'public',
      comments: 3
    },
    {
      _id: '5',
      title: 'Hire 50 New Engineers',
      type: 'key-result',
      description: 'Scale engineering team to support growth',
      owner: 'David Brown',
      department: 'Engineering',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      weightage: 20,
      progress: 45,
      status: 'in-progress',
      alignment: 'Scale Operations',
      visibility: 'team',
      comments: 15
    }
  ];

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating goal:', goalForm);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setGoalForm({
      title: '',
      type: 'objective',
      description: '',
      owner: '',
      department: '',
      startDate: '',
      endDate: '',
      weightage: '',
      alignment: '',
      visibility: 'public'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'not-started': 'bg-gray-100 text-gray-800 border-0',
      'in-progress': 'bg-blue-100 text-blue-800 border-0',
      'completed': 'bg-green-100 text-green-800 border-0',
      'objective': 'bg-purple-100 text-purple-800 border-0',
      'key-result': 'bg-orange-100 text-orange-800 border-0',
      'public': 'bg-green-100 text-green-800 border-0',
      'private': 'bg-red-100 text-red-800 border-0',
      'team': 'bg-blue-100 text-blue-800 border-0'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status.replace('-', ' ')}</Badge>;
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
    const matchesType = filterType === 'all' || goal.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = [
    { label: 'Total Goals', value: goals.length, color: 'text-blue-600' },
    { label: 'In Progress', value: goals.filter(g => g.status === 'in-progress').length, color: 'text-orange-600' },
    { label: 'Completed', value: goals.filter(g => g.status === 'completed').length, color: 'text-green-600' },
    { label: 'Avg Progress', value: `${Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)}%`, color: 'text-purple-600' }
  ];

  return (
    <div className="space-y-4 mt-4">
      {/* Stats */}
      <div className="grid gap-3 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white shadow-sm border-5 rounded-xl hover:shadow-lg hover:scale-90 transition-all duration-200 cursor-pointer">
            <CardContent className="p-8">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-4`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card className="bg-white shadow-sm border-0 rounded-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Goals & OKRs</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search goals..." 
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
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="objective">Objective</SelectItem>
                  <SelectItem value="key-result">Key Result</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <Plus className="h-4 w-4 mr-2" />Create Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Goal</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateGoal} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label>Goal Title *</Label>
                        <Input 
                          value={goalForm.title} 
                          onChange={(e) => setGoalForm({...goalForm, title: e.target.value})} 
                          placeholder="Enter goal title"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Goal Type *</Label>
                        <Select value={goalForm.type} onValueChange={(value) => setGoalForm({...goalForm, type: value})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="objective">Objective</SelectItem>
                            <SelectItem value="key-result">Key Result</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Owner *</Label>
                        <Select value={goalForm.owner} onValueChange={(value) => setGoalForm({...goalForm, owner: value})}>
                          <SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="john">John Doe</SelectItem>
                            <SelectItem value="jane">Jane Smith</SelectItem>
                            <SelectItem value="mike">Mike Johnson</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Select value={goalForm.department} onValueChange={(value) => setGoalForm({...goalForm, department: value})}>
                          <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Alignment</Label>
                        <Select value={goalForm.alignment} onValueChange={(value) => setGoalForm({...goalForm, alignment: value})}>
                          <SelectTrigger><SelectValue placeholder="Align to parent goal" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="company">Company Goal</SelectItem>
                            <SelectItem value="dept">Department Goal</SelectItem>
                            <SelectItem value="none">No Alignment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Description *</Label>
                        <Textarea 
                          value={goalForm.description} 
                          onChange={(e) => setGoalForm({...goalForm, description: e.target.value})} 
                          placeholder="Describe the goal"
                          rows={3}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date *</Label>
                        <Input 
                          type="date" 
                          value={goalForm.startDate} 
                          onChange={(e) => setGoalForm({...goalForm, startDate: e.target.value})} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date *</Label>
                        <Input 
                          type="date" 
                          value={goalForm.endDate} 
                          onChange={(e) => setGoalForm({...goalForm, endDate: e.target.value})} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Weightage (%) *</Label>
                        <Input 
                          type="number" 
                          value={goalForm.weightage} 
                          onChange={(e) => setGoalForm({...goalForm, weightage: e.target.value})} 
                          placeholder="0-100"
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Visibility *</Label>
                        <Select value={goalForm.visibility} onValueChange={(value) => setGoalForm({...goalForm, visibility: value})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="team">Team Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                      <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        Create Goal
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Goal</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Owner</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Progress</TableHead>
                <TableHead className="font-semibold">Weightage</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Timeline</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGoals.map((goal) => (
                <TableRow key={goal._id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{goal.title}</div>
                      {goal.alignment && (
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3" />
                          {goal.alignment}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(goal.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      {goal.owner}
                    </div>
                  </TableCell>
                  <TableCell>
                    {goal.department && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        {goal.department}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>{goal.weightage}%</TableCell>
                  <TableCell>{getStatusBadge(goal.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(goal.startDate).toLocaleDateString()}</div>
                      <div className="text-gray-500">to {new Date(goal.endDate).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Edit Goal">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Comments">
                        <MessageSquare className="h-4 w-4" />
                        {goal.comments > 0 && <span className="text-xs ml-1">{goal.comments}</span>}
                      </Button>
                      <Button variant="ghost" size="sm" title="History">
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsOKRs;
