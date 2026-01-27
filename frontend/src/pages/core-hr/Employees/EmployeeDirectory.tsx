import React, { useState, useEffect } from 'react';
import { Search, Filter, Building, Plus, Eye, Edit, UserX, UserPlus, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../../services/api';

interface Employee {
  _id?: string;
  tenantId: string;
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    gender?: string;
    maritalStatus?: string;
  };
  workInfo: {
    department: string;
    designation: string;
    managerId?: string;
    hireDate: Date;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
    workLocation: 'office' | 'remote' | 'hybrid';
    probationPeriod: number;
    salary?: number;
  };
  status: 'active' | 'inactive' | 'onboarding' | 'terminated';
  source: 'direct' | 'onboarding';
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeDirectory: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  console.log('this is the fetching data of employee directory', employees);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getAll();
        setEmployees(response.data.data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

const departments = Array.from(
  new Set(employees.map(e => e.workInfo.department).filter(Boolean))
);


  const handleAddEmployee = () => {
    navigate('/core-hr/employees/profile/new');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-0';
      case 'onboarding':
        return 'bg-blue-100 text-blue-800 border-0';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-0';
      case 'terminated':
        return 'bg-red-100 text-red-800 border-0';
      default:
        return 'bg-gray-100 text-gray-800 border-0';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading employees...</div>
      </div>
    );
  }

  const filteredEmployees = employees.filter((employee) => {
  const matchesSearch =
    `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesDepartment =
    !selectedDepartment ||
    employee.workInfo.department === selectedDepartment;

  return matchesSearch && matchesDepartment;
});


  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{employees.length}</p>
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
                <p className="text-2xl font-bold text-gray-900 mt-1">{employees.filter(e => e.status === 'active').length}</p>
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
                <p className="text-2xl font-bold text-gray-900 mt-1">{employees.filter(e => e.status === 'onboarding').length}</p>
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
                <p className="text-2xl font-bold text-gray-900 mt-1">{new Set(employees.map(e => e.workInfo.department)).size}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Building2 className="h-6 w-6 text-orange-600" />
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

                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
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
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{`${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`}</div>
                        <div className="text-sm text-gray-500">{employee.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{employee.personalInfo.email}</div>
                        <div className="text-sm text-gray-500">{employee.personalInfo.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{employee.workInfo.department}</div>
                        <div className="text-sm text-gray-500">{employee.workInfo.designation}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(employee.workInfo.hireDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
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