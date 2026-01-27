// import React, { useState, useEffect } from 'react';
// import { Upload, FileText, Download, Trash2, Eye, Users } from 'lucide-react';
// import { documentService } from '@/services/api';
// import { employeeService } from '@/services/api';

// interface Employee {
//   _id: string;
//   employeeId: string;
//   personalInfo: {
//     firstName: string;
//     lastName: string;
//   };
// }

// interface Document {
//   _id: string;
//   title: string;
//   documentType: string;
//   fileName: string;
//   fileSize: number;
//   mimeType: string;
//   uploadedDate: string;
//   status: string;
//   employeeId?: {
//     personalInfo: {
//       firstName: string;
//       lastName: string;
//     };
//   };
// }

// const EmployeeDocuments: React.FC = () => {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [selectedEmployee, setSelectedEmployee] = useState('');
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState('');

//   const documentCategories = [
//     'Identity Documents',
//     'Address Proof',
//     'Educational Certificates',
//     'Experience Letters',
//     'Bank Documents',
//     'Other'
//   ];

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const response = await employeeService.getAll();
//         setEmployees(response.data.data);
//       } catch (error) {
//         console.error('Failed to fetch employees:', error);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       setLoading(true);
//       try {
//         const params: any = {};
//         if (selectedEmployee) params.employeeId = selectedEmployee;
//         if (selectedCategory) params.documentType = selectedCategory.toLowerCase().replace(' ', '_');

//         const response = await documentService.getAll(params);
//         setDocuments(response.data.data);
//       } catch (error) {
//         console.error('Failed to fetch documents:', error);
//         setDocuments([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDocuments();
//   }, [selectedEmployee, selectedCategory]);

//   return (
//     <div className="space-y-6">
//       {/* Upload Section */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Documents</h3>

//         {/* File Upload Area */}
//         <div className="mt-6">
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
//             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//             <div className="mt-4">
//               <p className="text-sm text-gray-600">
//                 <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
//                   Click to upload
//                 </span>{' '}
//                 or drag and drop
//               </p>
//               <p className="text-xs text-gray-500 mt-1">
//                 PDF, DOC, DOCX, JPG, PNG up to 10MB
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end mt-4">
//           <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//             <Upload className="w-4 h-4" />
//             <span>Upload Document</span>
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default EmployeeDocuments;