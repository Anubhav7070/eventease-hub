import { format } from 'date-fns';
import { Calendar, Users, Trash2, Eye } from 'lucide-react';
import { EventWithAttendees } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface EventCardProps {
  event: EventWithAttendees;
  onView: (event: EventWithAttendees) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function EventCard({ event, onView, onDelete, isDeleting }: EventCardProps) {
  const spotsRemaining = event.capacity - event.attendee_count;
  const isFull = spotsRemaining <= 0;
  const isAlmostFull = spotsRemaining <= 5 && spotsRemaining > 0;

  return (
    <div className="group rounded-lg border bg-card p-6 shadow-card hover:shadow-card-hover transition-all duration-200 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-card-foreground line-clamp-1 pr-4">
          {event.title}
        </h3>
        <Badge 
          variant={isFull ? 'destructive' : isAlmostFull ? 'secondary' : 'default'}
          className={!isFull && !isAlmostFull ? 'bg-success text-success-foreground' : ''}
        >
          {isFull ? 'Full' : `${spotsRemaining} spots`}
        </Badge>
      </div>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {event.description}
      </p>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{event.attendee_count} / {event.capacity}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => onView(event)}
          className="gap-1.5"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Event</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{event.title}"? This will also remove all registered attendees. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(event.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
