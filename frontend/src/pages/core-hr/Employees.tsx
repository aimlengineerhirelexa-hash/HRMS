import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CoreHRLayout from './CoreHRLayout';
import EmployeeDirectory from './Employees/EmployeeDirectory';
import EmployeeProfile from './Employees/EmployeeProfile';

const EMPLOYEE_TABS = [
  { id: 'directory', label: 'Directory', path: '/core-hr/employees/directory' },
  { id: 'profile', label: 'Profile', path: '/core-hr/employees/profile' },
  { id: 'documents', label: 'Documents', path: '/core-hr/employees/documents' },
];

const Employees: React.FC = () => {
  return (
    <CoreHRLayout title="Employees" tabs={EMPLOYEE_TABS}>
      <Routes>
        <Route path="/" element={<Navigate to="directory" replace />} />
        <Route path="/directory" element={<EmployeeDirectory />} />
        <Route path="/profile" element={<EmployeeProfile />} />
        <Route path="/profile/new" element={<EmployeeProfile />} />
        <Route path="/profile/:id" element={<EmployeeProfile />} />
      </Routes>
    </CoreHRLayout>
  );
};

export default Employees;