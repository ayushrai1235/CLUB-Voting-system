import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';

// Admin sub-pages
import AdminOverview from './admin/AdminOverview';
import ManagePositions from './admin/ManagePositions';
import ManageCandidates from './admin/ManageCandidates';
import ManageElections from './admin/ManageElections';
import AdminStatistics from './admin/AdminStatistics';
import ManageVoters from './admin/ManageVoters';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/positions" element={<ManagePositions />} />
        <Route path="/candidates" element={<ManageCandidates />} />
        <Route path="/elections" element={<ManageElections />} />
        <Route path="/users" element={<ManageVoters />} />
        <Route path="/statistics" element={<AdminStatistics />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;

