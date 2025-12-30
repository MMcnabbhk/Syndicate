
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


import ReaderProfileSetup from './pages/ReaderProfileSetup';
import CreatorProfileSetup from './pages/CreatorProfileSetup';
import SyndicateWorkSetup from './pages/SyndicateWorkSetup';
import ContentSyndication from './pages/ContentSyndication';

import AudioBooks from './pages/AudioBooks';
import AudioBooksList from './pages/AudioBooksList';
import PoetryCollections from './pages/PoetryCollections';
import Discover from './pages/Discover';
import AuthorProfile from './pages/AuthorProfile';
import AuthorContribution from './pages/AuthorContribution';
import { StoreProvider } from './context/StoreContext';

function App() {
  console.log('App component rendering');
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="discover" element={<Discover />} />
            <Route path="audiobooks" element={<AudioBooks />} />
            <Route path="audiobooks-list" element={<AudioBooksList />} />
            <Route path="stories" element={<Stories />} />
            <Route path="poetry" element={<Poetry />} />
            <Route path="poetry-collections" element={<PoetryCollections />} />
            <Route path="setup-profile" element={<ReaderProfileSetup />} />
            <Route path="creator-setup" element={<CreatorProfileSetup />} />
            <Route path="syndicate-work" element={<SyndicateWorkSetup />} />
            <Route path="syndicate-content" element={<ContentSyndication />} />
            <Route path="profile" element={<div className="container py-10 text-white">Profile Placeholder</div>} />
            <Route path="book/:id" element={<BookProfile />} />
            <Route path="book/:id/contribute" element={<AuthorContribution />} />
            <Route path="author/:id" element={<AuthorProfile />} />
            <Route path="read/:bookId/:chapterId" element={<Reader />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="library" element={<Library />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
