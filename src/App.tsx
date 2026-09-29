import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { HomeScreen } from './components/home/HomeScreen';
import { NotesLibrary } from './components/notes/NotesLibrary';
import { PremiumScreen } from './components/premium/PremiumScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { NoteReaderModal } from './components/notes/NoteReaderModal';
import { PremiumModal } from './components/premium/PremiumModal';

const AppContent: React.FC = () => {
  const { activeTab, activeReadingNote, closeNoteReader } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main View Port */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'library' && <NotesLibrary />}
        {activeTab === 'premium' && <PremiumScreen />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'profile' && <ProfileScreen />}
      </main>

      {/* Interactive In-App Note Reader Modal */}
      {activeReadingNote && (
        <NoteReaderModal note={activeReadingNote} onClose={closeNoteReader} />
      )}

      {/* Premium Upgrade Modal */}
      <PremiumModal />

      {/* Mobile-first Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
