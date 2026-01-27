import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Target, TrendingUp, Users, Award, Calendar, 
  BarChart3, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import GoalsOKRs from './GoalsOKRs';
import PerformanceReviews from './PerformanceReviews';
import RatingsScores from './RatingsScores';
import Calibration from './Calibration';

// Import your custom images
// import targetIcon from '@/assets/icons/target.png';
// import clockIcon from '@/assets/icons/clock.png';
// import checkIcon from '@/assets/icons/check.png';
// import awardIcon from '@/assets/icons/award.png';

const PerformanceManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { title: 'Active Goals', value: 245, icon: Target, iconImage: null, color: 'text-blue-600', bgColor: 'bg-blue-50', change: '+12%' },
    { title: 'Pending Reviews', value: 18, icon: Clock, iconImage: null, color: 'text-orange-600', bgColor: 'bg-orange-50', change: '-5%' },
    { title: 'Completed Reviews', value: 132, icon: CheckCircle, iconImage: null, color: 'text-green-600', bgColor: 'bg-green-50', change: '+8%' },
    { title: 'Avg Rating', value: '4.2', icon: Award, iconImage: null, color: 'text-purple-600', bgColor: 'bg-purple-50', change: '+0.3' }
  ];
  // To use custom images, replace null with your imported image:
  // { title: 'Active Goals', value: 245, icon: Target, iconImage: targetIcon, ... }

  const recentActivity = [
    { action: 'Q2 2024 Review Cycle Started', time: '2 hours ago', type: 'review', status: 'active' },
    { action: 'John Doe completed self-review', time: '5 hours ago', type: 'submission', status: 'completed' },
    { action: 'New OKR created for Engineering', time: '1 day ago', type: 'goal', status: 'new' },
    { action: 'Calibration session scheduled', time: '2 days ago', type: 'calibration', status: 'scheduled' }
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Performance Management</h2>
          <p className="text-gray-600 mt-1">Track goals, conduct reviews, and manage employee performance</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
          <Calendar className="h-4 w-4 mr-2" />Start Review Cycle
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white rounded-xl p-2 shadow-sm border-0">
          <TabsList className="grid w-full grid-cols-5 bg-transparent p-0 h-auto gap-2">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <BarChart3 className="h-4 w-4 mr-2" />Dashboard
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Target className="h-4 w-4 mr-2" />Goals & OKRs
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Users className="h-4 w-4 mr-2" />Reviews
            </TabsTrigger>
            <TabsTrigger value="ratings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <Award className="h-4 w-4 mr-2" />Ratings
            </TabsTrigger>
            <TabsTrigger value="calibration" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-3 px-4 font-medium transition-all">
              <TrendingUp className="h-4 w-4 mr-2" />Calibration
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                      </div>
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        {stat.iconImage ? (
                          <img src={stat.iconImage} alt={stat.title} className="h-6 w-6" />
                        ) : (
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="mt-1">
                        {activity.type === 'review' && <Calendar className="h-5 w-5 text-blue-600" />}
                        {activity.type === 'submission' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {activity.type === 'goal' && <Target className="h-5 w-5 text-purple-600" />}
                        {activity.type === 'calibration' && <TrendingUp className="h-5 w-5 text-orange-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                      <Badge className={
                        activity.status === 'active' ? 'bg-blue-100 text-blue-800 border-0' :
                        activity.status === 'completed' ? 'bg-green-100 text-green-800 border-0' :
                        activity.status === 'new' ? 'bg-purple-100 text-purple-800 border-0' :
                        'bg-orange-100 text-orange-800 border-0'
                      }>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white shadow-sm border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Target className="h-4 w-4 mr-2" />Create New Goal
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />Schedule Review Cycle
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />Assign Reviewers
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />View Ratings Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />Start Calibration
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sub-component tabs */}
        <TabsContent value="goals">
          <GoalsOKRs />
        </TabsContent>
        <TabsContent value="reviews">
          <PerformanceReviews />
        </TabsContent>
        <TabsContent value="ratings">
          <RatingsScores />
        </TabsContent>
        <TabsContent value="calibration">
          <Calibration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceManagement;
