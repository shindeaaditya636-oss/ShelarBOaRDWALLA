import React, { createContext, useContext, useState, useEffect } from 'react';
import { NoteItem, User, BoardClass, SubjectId, CategoryType } from '../types';
import { INITIAL_NOTES, INITIAL_USER, ADMIN_USER } from '../data/initialData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: 'student' | 'admin') => void;
  notes: NoteItem[];
  addNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt' | 'downloadsCount'>) => void;
  updateNote: (id: string, updatedFields: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  togglePublishNote: (id: string) => void;
  selectedClass: BoardClass;
  setSelectedClass: (cls: BoardClass) => void;
  activeTab: 'home' | 'library' | 'premium' | 'admin' | 'profile';
  setActiveTab: (tab: 'home' | 'library' | 'premium' | 'admin' | 'profile') => void;
  selectedSubjectFilter: SubjectId | 'all';
  setSelectedSubjectFilter: (sub: SubjectId | 'all') => void;
  selectedCategoryFilter: CategoryType | 'all';
  setSelectedCategoryFilter: (cat: CategoryType | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeReadingNote: NoteItem | null;
  openNoteReader: (note: NoteItem) => void;
  closeNoteReader: () => void;
  toggleBookmark: (noteId: string) => void;
  isBookmarked: (noteId: string) => boolean;
  unlockPremiumForUser: (planName: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  openAuthModal: boolean;
  setOpenAuthModal: (open: boolean) => void;
  openPremiumModal: boolean;
  setOpenPremiumModal: (open: boolean) => void;
  hasAccessToNote: (note: NoteItem) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_NOTES_KEY = 'sbw_notes_data_v1';
const LOCAL_STORAGE_USER_KEY = 'sbw_current_user_v1';
const LOCAL_STORAGE_THEME_KEY = 'sbw_theme_mode_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    return saved ? JSON.parse(saved) : false;
  });

  // Current User
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  // Notes Library
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_NOTES;
      }
    }
    return INITIAL_NOTES;
  });

  // Navigation and Filter state
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'premium' | 'admin' | 'profile'>('home');
  const [selectedClass, setSelectedClass] = useState<BoardClass>('12');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<SubjectId | 'all'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Reader
  const [activeReadingNote, setActiveReadingNote] = useState<NoteItem | null>(null);
  const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
  const [openPremiumModal, setOpenPremiumModal] = useState<boolean>(false);

  // Sync dark mode class
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync user and notes to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const switchUserRole = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(ADMIN_USER);
    } else {
      setCurrentUser(INITIAL_USER);
    }
  };

  const addNote = (newNoteData: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt' | 'downloadsCount'>) => {
    if (currentUser.role !== 'admin') {
      alert('Security Notice: Only authorized administrators can add notes.');
      return;
    }
    const id = `note-${newNoteData.subject.slice(0, 3)}-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const newNote: NoteItem = {
      ...newNoteData,
      id,
      createdAt: today,
      updatedAt: today,
      downloadsCount: 1,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, updatedFields: Partial<NoteItem>) => {
    if (currentUser.role !== 'admin') {
      alert('Security Notice: Only authorized administrators can update notes.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    setNotes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields, updatedAt: today } : item))
    );
    if (activeReadingNote && activeReadingNote.id === id) {
      setActiveReadingNote((prev) => (prev ? { ...prev, ...updatedFields, updatedAt: today } : null));
    }
  };

  const deleteNote = (id: string) => {
    if (currentUser.role !== 'admin') {
      alert('Security Notice: Only authorized administrators can delete notes.');
      return;
    }
    setNotes((prev) => prev.filter((item) => item.id !== id));
    if (activeReadingNote?.id === id) {
      setActiveReadingNote(null);
    }
  };

  const togglePublishNote = (id: string) => {
    if (currentUser.role !== 'admin') {
      alert('Security Notice: Only authorized administrators can publish or unpublish notes.');
      return;
    }
    setNotes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPublished: !item.isPublished } : item))
    );
  };

  const openNoteReader = (note: NoteItem) => {
    setActiveReadingNote(note);
    // Add to recently viewed notes
    setCurrentUser((prev) => {
      const filtered = prev.recentNotes.filter((r) => r.noteId !== note.id);
      return {
        ...prev,
        recentNotes: [{ noteId: note.id, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 10),
      };
    });
  };

  const closeNoteReader = () => {
    setActiveReadingNote(null);
  };

  const toggleBookmark = (noteId: string) => {
    setCurrentUser((prev) => {
      const exists = prev.bookmarks.includes(noteId);
      const updatedBookmarks = exists
        ? prev.bookmarks.filter((id) => id !== noteId)
        : [...prev.bookmarks, noteId];
      return {
        ...prev,
        bookmarks: updatedBookmarks,
      };
    });
  };

  const isBookmarked = (noteId: string) => {
    return currentUser.bookmarks.includes(noteId);
  };

  const hasAccessToNote = (note: NoteItem) => {
    if (!note.isPremium) return true;
    if (currentUser.role === 'admin') return true;
    if (currentUser.premiumStatus) return true;
    return currentUser.purchasedItems.includes(note.id);
  };

  const unlockPremiumForUser = (planName: string) => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setCurrentUser((prev) => ({
      ...prev,
      premiumStatus: true,
      premiumExpiresAt: nextYear.toISOString().split('T')[0],
      purchasedItems: [...new Set([...prev.purchasedItems, planName, 'all_premium_notes'])],
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        notes,
        addNote,
        updateNote,
        deleteNote,
        togglePublishNote,
        selectedClass,
        setSelectedClass,
        activeTab,
        setActiveTab,
        selectedSubjectFilter,
        setSelectedSubjectFilter,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        activeReadingNote,
        openNoteReader,
        closeNoteReader,
        toggleBookmark,
        isBookmarked,
        unlockPremiumForUser,
        isDarkMode,
        toggleDarkMode,
        openAuthModal,
        setOpenAuthModal,
        openPremiumModal,
        setOpenPremiumModal,
        hasAccessToNote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
