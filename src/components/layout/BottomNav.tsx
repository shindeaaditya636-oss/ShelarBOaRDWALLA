import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, BookOpen, Crown, Shield, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'library' as const, label: 'Notes', icon: BookOpen },
    { id: 'premium' as const, label: 'Premium', icon: Crown, highlight: !currentUser.premiumStatus },
    ...(currentUser.role === 'admin'
      ? [{ id: 'admin' as const, label: 'Admin', icon: Shield, badge: 'Staff' }]
      : []),
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors pb-safe"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-4 sm:grid-cols-5 items-center h-15 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] py-1 transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110' : 'scale-100'
                  } ${item.id === 'premium' && !isActive ? 'text-amber-500' : ''}`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 line-clamp-1">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-4 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
