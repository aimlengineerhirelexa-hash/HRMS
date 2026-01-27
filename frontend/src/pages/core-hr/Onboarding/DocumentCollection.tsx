import React, { useState } from 'react';
import { Search, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface DocumentRequirement {
  id: string;
  name: string;
  required: boolean;
  status: 'Pending' | 'Submitted' | 'Verified' | 'Rejected';
}

interface EmployeeDocuments {
  id: string;
  employeeName: string;
  email: string;
  joinDate: string;
  documents: DocumentRequirement[];
  overallProgress: number;
}

const mockEmployeeDocuments: EmployeeDocuments[] = [
  {
    id: '1',
    employeeName: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    joinDate: '2024-02-01',
    overallProgress: 75,
    documents: [
      { id: '1', name: 'Aadhaar Card', required: true, status: 'Verified' },
      { id: '2', name: 'PAN Card', required: true, status: 'Verified' },
      { id: '3', name: 'Address Proof', required: true, status: 'Submitted' },
      { id: '4', name: 'Educational Certificates', required: true, status: 'Pending' },
    ]
  },
  {
    id: '2',
    employeeName: 'Bob Wilson',
    email: 'bob.wilson@company.com',
    joinDate: '2024-02-05',
    overallProgress: 25,
    documents: [
      { id: '1', name: 'Aadhaar Card', required: true, status: 'Submitted' },
      { id: '2', name: 'PAN Card', required: true, status: 'Pending' },
      { id: '3', name: 'Address Proof', required: true, status: 'Pending' },
      { id: '4', name: 'Educational Certificates', required: true, status: 'Pending' },
    ]
  }
];

const DocumentCollection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Submitted':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Rejected':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
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

      {/* Employee Document Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Document Collection Status</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockEmployeeDocuments.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${employee.overallProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{employee.overallProgress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {employee.documents.slice(0, 4).map((doc) => (
                        <div key={doc.id} className="flex items-center">
                          {getStatusIcon(doc.status)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedEmployee(selectedEmployee === employee.id ? null : employee.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Details Modal/Expanded View */}
      {selectedEmployee && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Document Details - {mockEmployeeDocuments.find(e => e.id === selectedEmployee)?.employeeName}
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockEmployeeDocuments
                .find(e => e.id === selectedEmployee)
                ?.documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getStatusIcon(doc.status)}
                      <span className="ml-2 font-medium text-gray-900">{doc.name}</span>
                      {doc.required && (
                        <span className="ml-2 text-xs text-red-500">*Required</span>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    {doc.status === 'Submitted' && (
                      <>
                        <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                          Reject
                        </button>
                      </>
                    )}
                    {doc.status === 'Pending' && (
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                        Send Reminder
                      </button>
                    )}
                    {doc.status === 'Verified' && (
                      <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                        View Document
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCollection;