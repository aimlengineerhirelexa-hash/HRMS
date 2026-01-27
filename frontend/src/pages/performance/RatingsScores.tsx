import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, Search, TrendingUp, TrendingDown, 
  Eye, Lock, BarChart3, Star
} from 'lucide-react';

interface EmployeeRating {
  _id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  reviewCycle: string;
  competencies: {
    name: string;
    score: number;
    weightage: number;
  }[];
  finalRating: number;
  ratingStatus: 'draft' | 'submitted' | 'approved' | 'locked';
  trend: 'up' | 'down' | 'stable';
  previousRating?: number;
}

const RatingsScores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCycle, setSelectedCycle] = useState('annual-2024');

  const ratings: EmployeeRating[] = [
    {
      _id: '1',
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      department: 'Engineering',
      reviewCycle: 'Annual 2024',
      competencies: [
        { name: 'Technical Skills', score: 4.5, weightage: 30 },
        { name: 'Communication', score: 4.0, weightage: 20 },
        { name: 'Leadership', score: 4.2, weightage: 25 },
        { name: 'Problem Solving', score: 4.8, weightage: 25 }
      ],
      finalRating: 4.4,
      ratingStatus: 'approved',
      trend: 'up',
      previousRating: 4.1
    },
    {
      _id: '2',
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      department: 'Product',
      reviewCycle: 'Annual 2024',
      competencies: [
        { name: 'Product Knowledge', score: 4.7, weightage: 35 },
        { name: 'Strategic Thinking', score: 4.5, weightage: 30 },
        { name: 'Collaboration', score: 4.3, weightage: 20 },
        { name: 'Innovation', score: 4.6, weightage: 15 }
      ],
      finalRating: 4.6,
      ratingStatus: 'locked',
      trend: 'up',
      previousRating: 4.3
    },
    {
      _id: '3',
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      department: 'Sales',
      reviewCycle: 'Annual 2024',
      competencies: [
        { name: 'Sales Performance', score: 3.8, weightage: 40 },
        { name: 'Customer Relations', score: 4.0, weightage: 30 },
        { name: 'Negotiation', score: 3.5, weightage: 20 },
        { name: 'Market Knowledge', score: 3.9, weightage: 10 }
      ],
      finalRating: 3.8,
      ratingStatus: 'submitted',
      trend: 'down',
      previousRating: 4.0
    },
    {
      _id: '4',
      employeeName: 'Sarah Wilson',
      employeeId: 'EMP004',
      department: 'Engineering',
      reviewCycle: 'Annual 2024',
      competencies: [
        { name: 'Technical Skills', score: 4.9, weightage: 30 },
        { name: 'Communication', score: 4.7, weightage: 20 },
        { name: 'Leadership', score: 4.8, weightage: 25 },
        { name: 'Problem Solving', score: 5.0, weightage: 25 }
      ],
      finalRating: 4.9,
      ratingStatus: 'locked',
      trend: 'up',
      previousRating: 4.6
    },
    {
      _id: '5',
      employeeName: 'David Brown',
      employeeId: 'EMP005',
      department: 'Operations',
      reviewCycle: 'Annual 2024',
      competencies: [
        { name: 'Process Management', score: 4.2, weightage: 35 },
        { name: 'Efficiency', score: 4.4, weightage: 30 },
        { name: 'Team Management', score: 4.0, weightage: 20 },
        { name: 'Quality Control', score: 4.3, weightage: 15 }
      ],
      finalRating: 4.2,
      ratingStatus: 'draft',
      trend: 'stable',
      previousRating: 4.2
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'draft': 'bg-gray-100 text-gray-800 border-0',
      'submitted': 'bg-blue-100 text-blue-800 border-0',
      'approved': 'bg-green-100 text-green-800 border-0',
      'locked': 'bg-purple-100 text-purple-800 border-0'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Exceptional';
    if (rating >= 3.5) return 'Exceeds Expectations';
    if (rating >= 2.5) return 'Meets Expectations';
    return 'Needs Improvement';
  };

  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = rating.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rating.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'all' || rating.department === filterDept;
    const matchesStatus = filterStatus === 'all' || rating.ratingStatus === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const avgRating = ratings.reduce((acc, r) => acc + r.finalRating, 0) / ratings.length;
  const ratingDistribution = {
    exceptional: ratings.filter(r => r.finalRating >= 4.5).length,
    exceeds: ratings.filter(r => r.finalRating >= 3.5 && r.finalRating < 4.5).length,
    meets: ratings.filter(r => r.finalRating >= 2.5 && r.finalRating < 3.5).length,
    needs: ratings.filter(r => r.finalRating < 2.5).length
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{avgRating.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">Out of 5.0</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Exceptional</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{ratingDistribution.exceptional}</p>
            <p className="text-sm text-gray-500 mt-1">4.5 - 5.0</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Exceeds Expectations</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{ratingDistribution.exceeds}</p>
            <p className="text-sm text-gray-500 mt-1">3.5 - 4.4</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Meets Expectations</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{ratingDistribution.meets}</p>
            <p className="text-sm text-gray-500 mt-1">2.5 - 3.4</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-white shadow-sm border-0 rounded-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Employee Ratings & Scores</CardTitle>
            <div className="flex items-center gap-3">
              <Select value={selectedCycle} onValueChange={setSelectedCycle}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual-2024">Annual 2024</SelectItem>
                  <SelectItem value="q2-2024">Q2 2024</SelectItem>
                  <SelectItem value="mid-year-2024">Mid-Year 2024</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
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
                <TableHead className="font-semibold">Competencies</TableHead>
                <TableHead className="font-semibold">Final Rating</TableHead>
                <TableHead className="font-semibold">Rating Label</TableHead>
                <TableHead className="font-semibold">Trend</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRatings.map((rating) => (
                <TableRow key={rating._id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{rating.employeeName}</div>
                      <div className="text-sm text-gray-500">{rating.employeeId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{rating.department}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {rating.competencies.map((comp, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-700">{comp.name}</span>
                            <span className="font-medium">{comp.score.toFixed(1)}</span>
                          </div>
                          <Progress value={comp.score * 20} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className={`h-5 w-5 ${getRatingColor(rating.finalRating)}`} />
                      <span className={`text-2xl font-bold ${getRatingColor(rating.finalRating)}`}>
                        {rating.finalRating.toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      rating.finalRating >= 4.5 ? 'bg-green-100 text-green-800 border-0' :
                      rating.finalRating >= 3.5 ? 'bg-blue-100 text-blue-800 border-0' :
                      rating.finalRating >= 2.5 ? 'bg-orange-100 text-orange-800 border-0' :
                      'bg-red-100 text-red-800 border-0'
                    }>
                      {getRatingLabel(rating.finalRating)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {rating.previousRating && (
                      <div className="flex items-center gap-2">
                        {rating.trend === 'up' && (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">
                              +{(rating.finalRating - rating.previousRating).toFixed(1)}
                            </span>
                          </>
                        )}
                        {rating.trend === 'down' && (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-600">
                              {(rating.finalRating - rating.previousRating).toFixed(1)}
                            </span>
                          </>
                        )}
                        {rating.trend === 'stable' && (
                          <span className="text-sm text-gray-600">No change</span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(rating.ratingStatus)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Rating History">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      {rating.ratingStatus === 'locked' && (
                        <Lock className="h-4 w-4 text-purple-600" />
                      )}
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

export default RatingsScores;
