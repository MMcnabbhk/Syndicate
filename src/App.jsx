
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BookProfile from './pages/BookProfile';
import Reader from './pages/Reader';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Stories from './pages/Stories';
import Poetry from './pages/Poetry';
import VisualArts from './pages/VisualArts';
import Manifesto from './pages/Manifesto';


import ReaderProfileSetup from './pages/ReaderProfileSetup';
import CreatorProfileSetup from './pages/CreatorProfileSetup';
import SyndicateWorkSetup from './pages/SyndicateWorkSetup';
import NewWork from './pages/NewWork';

import AudioBooks from './pages/AudioBooks';
import AudioBooksList from './pages/AudioBooksList';
import PoetryCollections from './pages/PoetryCollections';
import Discover from './pages/Discover';
import AuthorProfile from './pages/AuthorProfile';
import AuthorContribution from './pages/AuthorContribution';
import ManageWorks from './pages/ManageWorks';
import EditChapter from './pages/EditChapter';
import CreatorProfile from './pages/CreatorProfile';
import FansAndContributors from './pages/FansAndContributors';
import Money from './pages/Money';
import ManageInvites from './pages/ManageInvites';
import Notifications from './pages/Notifications';

import Settings from './pages/Settings';
import SubscribedWorks from './pages/SubscribedWorks';
import FollowingCreators from './pages/FollowingCreators';
import ReaderContributions from './pages/ReaderContributions';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminMessaging from './pages/AdminMessaging';
import AdminFinancials from './pages/AdminFinancials';
import { StoreProvider } from './context/StoreContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  console.log('App component rendering');
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <StoreProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="discover" element={<Discover />} />
              <Route path="audiobooks" element={<AudioBooks />} />
              <Route path="audiobooks-list" element={<AudioBooksList />} />
              <Route path="stories" element={<Stories />} />
              <Route path="poetry" element={<Poetry />} />
              <Route path="visual-arts" element={<VisualArts />} />
              <Route path="poetry-collections" element={<PoetryCollections />} />
              <Route path="setup-profile" element={<ReaderProfileSetup />} />
              <Route path="creator-setup" element={<CreatorProfileSetup />} />
              <Route path="syndicate-work" element={<SyndicateWorkSetup />} />
              <Route path="new-work" element={<NewWork />} />
              <Route path="profile" element={<div className="container py-10 text-white">Profile Placeholder</div>} />
              <Route path="book/:id" element={<BookProfile />} />
              <Route path="book/:id/contribute" element={<AuthorContribution />} />

              <Route path="author/:id" element={<AuthorProfile />} />
              <Route path="author/:id/contribute" element={<AuthorContribution />} />
              <Route path="read/:bookId/:chapterId" element={<Reader />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="author/:id/manage-works" element={<ManageWorks />} />
              <Route path="author/:authorId/work/:workId/chapter/:chapterId/edit" element={<EditChapter />} />
              <Route path="manage-profile" element={<CreatorProfile />} />
              <Route path="community" element={<FansAndContributors />} />
              <Route path="invites" element={<ManageInvites />} />
              <Route path="money" element={<Money />} />
              <Route path="notifications" element={<Notifications />} />

              <Route path="settings" element={<Settings />} />
              <Route path="subscribed-works" element={<SubscribedWorks />} />
              <Route path="following-creators" element={<FollowingCreators />} />
              <Route path="reader-contributions" element={<ReaderContributions />} />

              {/* Admin Routes */}
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/users" element={<AdminUsers />} />
              <Route path="admin/messages" element={<AdminMessaging />} />
              <Route path="admin/financials" element={<AdminFinancials />} />

              <Route path="library" element={<Library />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="about" element={<About />} />
              <Route path="manifesto" element={<Manifesto />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </StoreProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
