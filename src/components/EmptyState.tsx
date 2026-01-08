import { Calendar, Users, Inbox } from 'lucide-react';

interface EmptyStateProps {
  type: 'events' | 'attendees';
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const defaultContent = {
    events: {
      icon: Calendar,
      title: 'No events yet',
      description: 'Create your first event to get started managing registrations.',
    },
    attendees: {
      icon: Users,
      title: 'No attendees registered',
      description: 'Share your event to start receiving registrations.',
    },
  };

  const content = defaultContent[type];
  const Icon = content.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title || content.title}
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        {description || content.description}
      </p>
      {action}
    </div>
  );
}
