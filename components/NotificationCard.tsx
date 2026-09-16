import React from 'react';
import { Notification, NotificationType, NotificationPriority } from '@/types/notification';

// Simple date formatter function
const formatTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return past.toLocaleDateString();
};

import { 
  FaShoppingCart, 
  FaCreditCard, 
  FaTag, 
  FaExclamationTriangle,
  FaCheck,
  FaTrash,
  FaCircle 
} from 'react-icons/fa';

interface NotificationCardProps {
  notification: Notification;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.ORDER_UPDATE:
      return <FaShoppingCart className="text-blue-400" />;
    case NotificationType.PAYMENT_STATUS:
      return <FaCreditCard className="text-emerald-400" />;
    case NotificationType.PROMOTION:
      return <FaTag className="text-purple-400" />;
    case NotificationType.SYSTEM_ALERT:
      return <FaExclamationTriangle className="text-rose-400" />;
    default:
      return <FaCircle className="text-slate-400" />;
  }
};

const getTypeColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.ORDER_UPDATE:
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case NotificationType.PAYMENT_STATUS:
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case NotificationType.PROMOTION:
      return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    case NotificationType.SYSTEM_ALERT:
      return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
    default:
      return 'bg-slate-700/60 text-slate-400 border border-slate-700';
  }
};

const getPriorityBadge = (priority: NotificationPriority) => {
  const priorityStyles = {
    [NotificationPriority.LOW]: 'bg-slate-700/60 text-slate-400 border border-slate-700',
    [NotificationPriority.NORMAL]: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    [NotificationPriority.HIGH]: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    [NotificationPriority.URGENT]: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
  };

  const priorityLabels = {
    [NotificationPriority.LOW]: 'Low',
    [NotificationPriority.NORMAL]: 'Normal',
    [NotificationPriority.HIGH]: 'High',
    [NotificationPriority.URGENT]: 'Urgent'
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityStyles[priority]}`}>
      {priorityLabels[priority]}
    </span>
  );
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isSelected,
  onToggleSelect,
  onMarkAsRead,
  onDelete
}) => {
    const timeAgo = formatTimeAgo(notification.createdAt);

  return (
    <div className={`
      rounded-xl p-4 transition-all duration-200 border backdrop-blur-sm
      ${notification.isRead 
        ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' 
        : 'bg-slate-800/80 border-cyan-500/20 shadow-lg shadow-cyan-500/5'}
      ${isSelected ? 'ring-1 ring-cyan-500 border-cyan-500/40' : ''}
    `}>
      <div className="flex items-start space-x-3">
        {/* Selection Checkbox */}
        <div className="flex items-center pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(notification.id)}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 accent-cyan-500"
            aria-label={`Select notification: ${notification.title}`}
          />
        </div>

        {/* Type Icon */}
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center mt-0.5 border border-slate-700/50">
          {getTypeIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className={`text-sm font-semibold truncate ${
                notification.isRead ? 'text-slate-300' : 'text-slate-100'
              }`}>
                {notification.title}
              </h3>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0 shadow-[0_0_6px_rgba(34,211,238,0.8)]" aria-label="Unread notification" />
              )}
            </div>

            {/* Priority Badge */}
            <div className="flex-shrink-0 ml-2">
              {getPriorityBadge(notification.priority)}
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-slate-400 mb-3 line-clamp-2">
            {notification.message}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Type Badge */}
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                {notification.type.replace('_', ' ')}
              </span>
              
              {/* Timestamp */}
              <span className="text-xs text-slate-500" title={new Date(notification.createdAt).toLocaleString()}>
                {timeAgo}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {!notification.isRead && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-200"
                  aria-label="Mark as read"
                >
                  <FaCheck className="w-3 h-3" />
                  Mark Read
                </button>
              )}
              
              <button
                onClick={() => onDelete(notification.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg hover:bg-rose-500/20 hover:text-rose-300 transition-all duration-200"
                aria-label="Delete notification"
              >
                <FaTrash className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;