import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CoreHRLayout from './CoreHRLayout';
import NewEmployees from './Onboarding/NewEmployees';
import DocumentCollection from './Onboarding/DocumentCollection';

const ONBOARDING_TABS = [
  { id: 'new-employees', label: 'New Employees', path: '/core-hr/onboarding/new-employees' },
  { id: 'documents', label: 'Document Collection', path: '/core-hr/onboarding/documents' },
];

const Onboarding: React.FC = () => {
  return (
    <CoreHRLayout title="Onboarding" tabs={ONBOARDING_TABS}>
      <Routes>
        <Route path="/" element={<Navigate to="new-employees" replace />} />
        <Route path="/new-employees" element={<NewEmployees />} />
        <Route path="/documents" element={<DocumentCollection />} />
      </Routes>
    </CoreHRLayout>
  );
};

export default Onboarding;