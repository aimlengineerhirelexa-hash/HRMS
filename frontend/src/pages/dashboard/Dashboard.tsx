import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, UserX, Calendar, UserCheck, Clock, Target, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/api';

// Type definitions for dashboard data
interface WorkforceItem {
  label: string;
  value: number;
  color: string; 
}

interface DistributionItem {
  label: string;
  value: number;
  color: string;
}

interface RecruitmentFunnelItem {
  stage: string;
  count: number;
  percentage: number;
}

interface ComplianceItem {
  title: string;
  value: string | number;
  color: string;
  icon: string;
}

interface ComplianceItemWithIcon {
  title: string;
  value: string | number;
  color: string;
  icon: React.ComponentType<any>;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [distributionFilter, setDistributionFilter] = useState('location');
  const [hoveredSegment, setHoveredSegment] = useState<{label: string, value: number, count: number} | null>(null);
const [dashboardData, setDashboardData] = useState({
  kpiData: {
    totalEmployees: { value: 0, change: '0%', trend: 'up' },
    totalPresent: { value: 0, change: '0%', trend: 'up' },
    totalAbsenties: { value: 0, change: '0%', trend: 'up' },
    onLeave: { value: 0, change: '0%', trend: 'up' }
  },
  locationData: [],
  departmentData: [],
  workforceData: [],
  attendanceData: [],
  recruitmentFunnelData: [],
  attritionData: [],
  performanceData: [],
  complianceData: [],
  totalEmployeesCount: 0
});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data from database...');
        const response = await dashboardService.getFullDashboardData();
        console.log('Dashboard data fetched from database:', response.data);
        setDashboardData(response.data.data); // Fix: access the inner data property
      } catch (error) {
        console.error('Failed to fetch dashboard data from database:', error);
        setError('Failed to load dashboard data. Please run: npm run seed:dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (!user || loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  if (!dashboardData) return <div className="flex items-center justify-center min-h-screen">No dashboard data available.</div>;

  const { kpiData, locationData, departmentData, workforceData, attendanceData, recruitmentFunnelData, attritionData, performanceData, complianceData, totalEmployeesCount } = dashboardData;

  const distributionData = distributionFilter === 'location' ? locationData : departmentData;

  // HRMS KPI Data with icons
  const kpiDataWithIcons = [
    {
      title: 'Total Employees',
      value: kpiData.totalEmployees.value,
      change: kpiData.totalEmployees.change,
      icon: Users,
      tooltip: 'Active employees count vs last month'
    },
    {
      title: 'Total Present',
      value: kpiData.totalPresent.value,
      change: kpiData.totalPresent.change,
      icon: UserCheck,
      tooltip: 'Employees present today'
    },
    {
      title: 'Total Absenties',
      value: kpiData.totalAbsenties.value,
      change: kpiData.totalAbsenties.change,
      icon: UserX,
      tooltip: 'Employees absent today'
    },
    {
      title: 'On Leave',
      value: kpiData.onLeave.value,
      change: kpiData.onLeave.change,
      icon: Calendar,
      tooltip: 'Employees currently on leave'
    }
  ];

  // Map compliance data with icons
  const complianceDataWithIcons = complianceData.map((item: any) => {
    let IconComponent;
    switch (item.icon) {
      case 'FileText': IconComponent = FileText; break;
      case 'Target': IconComponent = Target; break;
      case 'Clock': IconComponent = Clock; break;
      default: IconComponent = FileText;
    }
    return { ...item, icon: IconComponent };
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Super Admin Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Organization-wide HRMS overview and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-purple-100 text-purple-800 border-0">
            Super Admin
          </Badge>
          <span className="text-sm text-gray-600">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </div>
      
      {/* KPI Cards Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiDataWithIcons.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow" title={kpi.tooltip}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Workforce Distribution */}
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Workforce Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center relative">
              <div className="w-32 h-32 rounded-full border-8 border-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{totalEmployeesCount}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {workforceData.map((item: WorkforceItem, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee Distribution by Location & Department */}
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Employee Distribution</CardTitle>
              <select 
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setDistributionFilter(e.target.value)}
                value={distributionFilter}
              >
                <option value="location">By Location</option>
                <option value="department">By Department</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center relative mb-6">
              <svg className="w-48 h-48" viewBox="0 0 200 200">
                {distributionData.map((item: DistributionItem, index: number) => {
                  const startAngle = index === 0 ? 0 : distributionData.slice(0, index).reduce((sum: number, d: DistributionItem) => sum + (d.value / 100) * 360, 0);
                  const endAngle = startAngle + (item.value / 100) * 360;
                  const largeArcFlag = item.value > 50 ? 1 : 0;
                  
                  const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
                  
                  return (
                    <path
                      key={index}
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={item.color}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                      onMouseEnter={() => setHoveredSegment({label: item.label, value: item.value, count: Math.round((item.value / 100) * totalEmployeesCount)})}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  );
                })}
                <circle cx="100" cy="100" r="40" fill="white" />
                {hoveredSegment ? (
                  <>
                    <text x="100" y="90" textAnchor="middle" className="text-xs font-medium fill-gray-700">{hoveredSegment.label}</text>
                    <text x="100" y="105" textAnchor="middle" className="text-lg font-bold fill-gray-900">{hoveredSegment.count}</text>
                    <text x="100" y="118" textAnchor="middle" className="text-xs fill-gray-600">({hoveredSegment.value}%)</text>
                  </>
                ) : (
                  <>
                    <text x="100" y="95" textAnchor="middle" className="text-2xl font-bold fill-gray-900">{totalEmployeesCount}</text>
                    <text x="100" y="110" textAnchor="middle" className="text-sm fill-gray-600">Total</text>
                  </>
                )}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Recruitment Funnel */}
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Recruitment Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recruitmentFunnelData.map((item: RecruitmentFunnelItem, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{item.stage}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      <span className="text-xs text-gray-500 ml-1">({item.percentage}%)</span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Attendance & Overtime */}
        {/* <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Weekly Attendance & Overtime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceData.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 w-12">{day.day}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(day.regular / 10) * 100}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${(day.overtime / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <div>R: {day.regular}h</div>
                    <div>O: {day.overtime}h</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                <span className="text-gray-600">Regular Hours</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
                <span className="text-gray-600">Overtime</span>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Performance Reviews */}
        {/* <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Performance Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((employee, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.department} • {employee.cycle}</p>
                    </div>
                  </div>
                  <Badge className={`${employee.statusColor} border-0 text-xs`}>
                    {employee.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Attrition Trend */}
      {/* <Card className="bg-white shadow-sm border-0 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Attrition Trend (Monthly)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between space-x-2 h-32">
            {attritionData.map((month, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex flex-col items-center justify-end h-24 mb-2">
                  <div 
                    className={`w-6 rounded-t ${getRiskColor(month.risk)} transition-all hover:opacity-80`}
                    style={{ height: `${(month.value / 20) * 100}%` }}
                    title={`${month.month}: ${month.value}% (${month.risk} risk)`}
                  />
                </div>
                <span className="text-xs text-gray-600">{month.month}</span>
                <span className="text-xs font-medium text-gray-900">{month.value}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <span className="text-gray-600">Low Risk</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
              <span className="text-gray-600">Medium Risk</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              <span className="text-gray-600">High Risk</span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Training & Compliance Snapshot */}
      <Card className="bg-white shadow-sm border-0 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Compliance Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {complianceDataWithIcons.map((item: ComplianceItemWithIcon, index: number) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${item.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{item.title}</p>
                    <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;