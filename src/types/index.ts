export type SubjectId = 'physics' | 'chemistry' | 'mathematics' | 'biology';

export type BoardClass = '11' | '12';

export type CategoryType = 'notes' | 'pyq' | 'important_questions' | 'mcq' | 'revision';

export interface PracticeMCQ {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface PYQExamHit {
  year: string;
  question: string;
  marks: number;
}

export interface NoteItem {
  id: string;
  title: string;
  class: BoardClass;
  subject: SubjectId;
  chapter: string;
  category: CategoryType;
  description: string;
  pdfUrl: string;
  thumbnailUrl: string;
  isPremium: boolean;
  pages: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  downloadsCount: number;
  sampleContent: {
    keyPoints: string[];
    formulaeSheet?: string[];
    pyqExamHits?: PYQExamHit[];
    summaryNotes: string;
    practiceMcqs?: PracticeMCQ[];
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  premiumStatus: boolean;
  premiumExpiresAt?: string;
  purchasedItems: string[];
  bookmarks: string[];
  recentNotes: { noteId: string; viewedAt: string }[];
  studyStreakDays: number;
  completedChapters: string[];
}

export interface StudyTip {
  id: string;
  title: string;
  tip: string;
  subject: string;
}

export interface DailyQuestion {
  id: string;
  subject: SubjectId;
  chapter: string;
  marks: number;
  boardYear: string;
  question: string;
  solution: string;
}

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  code: string;
  tagline: string;
  image: string;
  accentColor: string;
  chaptersCount: number;
}
