import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, UserX, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: 'Active' | 'Inactive' | 'Onboarding';
  joinDate: string;
  reportingManager: string;
  source?: 'direct' | 'onboarding';
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+91 9876543210',
    department: 'Engineering',
    designation: 'Senior Developer',
    status: 'Active',
    joinDate: '2023-01-15',
    reportingManager: 'Jane Smith',
    source: 'direct'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    phone: '+91 9876543211',
    department: 'Marketing',
    designation: 'Marketing Manager',
    status: 'Active',
    joinDate: '2023-02-20',
    reportingManager: 'Mike Johnson',
    source: 'direct'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    phone: '+91 9876543212',
    department: 'Engineering',
    designation: 'Software Engineer',
    status: 'Onboarding',
    joinDate: '2024-02-01',
    reportingManager: 'John Doe',
    source: 'onboarding'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'Bob Wilson',
    email: 'bob.wilson@company.com',
    phone: '+91 9876543213',
    department: 'Marketing',
    designation: 'Marketing Specialist',
    status: 'Onboarding',
    joinDate: '2024-02-05',
    reportingManager: 'Jane Smith',
    source: 'onboarding'
  }
];

const EmployeeDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    navigate('/core-hr/employees/profile/new');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-0';
      case 'Onboarding':
        return 'bg-blue-100 text-blue-800 border-0';
      default:
        return 'bg-red-100 text-red-800 border-0';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockEmployees.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <UserX className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockEmployees.filter(e => e.status === 'Active').length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <UserX className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Onboarding</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockEmployees.filter(e => e.status === 'Onboarding').length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{new Set(mockEmployees.map(e => e.department)).size}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Filter className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      

      {/* Actions Bar */}
      <Card className="bg-white shadow-sm border-0 rounded-xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>

              {/* Department Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            {/* Add Employee Button */}
            <Button onClick={handleAddEmployee} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card className="bg-white shadow-sm border-0 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{employee.email}</div>
                        <div className="text-sm text-gray-500">{employee.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{employee.department}</div>
                        <div className="text-sm text-gray-500">{employee.designation}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                      {employee.source === 'onboarding' && (
                        <Badge className="ml-2 bg-purple-100 text-purple-800 border-0 text-xs">
                          From Onboarding
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded">
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDirectory;