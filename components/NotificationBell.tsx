'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaBell } from 'react-icons/fa6';
import { useUnreadCount } from '@/hooks/useNotifications';
import { useSession } from 'next-auth/react';

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className = "" }) => {
  const { data: session } = useSession();
  const { unreadCount } = useUnreadCount();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't show notification bell if user is not logged in
  if (!session?.user) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative p-2 text-slate-200 hover:text-cyan-400 hover:bg-slate-800/60 rounded-xl transition-all duration-200 focus:outline-none"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <FaBell className="w-5 h-5" />
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden text-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-950/50">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/50">
            <div className="flex space-x-2">
              <Link
                href="/notifications"
                onClick={() => setIsDropdownOpen(false)}
                className="flex-1 px-3 py-1.5 text-xs font-semibold text-center text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
              >
                View All
              </Link>
              
              {unreadCount > 0 && (
                <button
                  className="flex-1 px-3 py-1.5 text-xs font-semibold text-center text-slate-400 bg-slate-800/60 border border-slate-700/60 rounded-lg hover:bg-slate-800 transition-colors"
                  onClick={() => {
                    setIsDropdownOpen(false);
                  }}
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {/* Notification Preview */}
          <div className="max-h-64 overflow-y-auto">
            {unreadCount === 0 ? (
              <div className="p-6 text-center">
                <FaBell className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-slate-400 text-xs font-medium">No new notifications</p>
                <p className="text-slate-500 text-[11px] mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <div className="text-center">
                  <p className="text-xs text-slate-300 mb-2">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                  <Link
                    href="/notifications"
                    onClick={() => setIsDropdownOpen(false)}
                    className="inline-flex items-center px-3 py-1 text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-full hover:bg-cyan-500/20 transition-colors"
                  >
                    View in Notification Center →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsDropdownOpen(false)}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-medium"
            >
              Go to Notification Center
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;