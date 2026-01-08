import { format } from 'date-fns';
import { Trash2, ArrowLeft, UserPlus, Calendar, Users, MapPin } from 'lucide-react';
import { EventWithAttendees, Attendee } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { EmptyState } from './EmptyState';
import { TableRowSkeleton } from './ui/loading-skeleton';

interface EventDetailViewProps {
  event: EventWithAttendees;
  attendees: Attendee[];
  isLoading?: boolean;
  onBack: () => void;
  onAddAttendee: () => void;
  onDeleteAttendee: (id: string) => void;
}

export function EventDetailView({
  event,
  attendees,
  isLoading,
  onBack,
  onAddAttendee,
  onDeleteAttendee,
}: EventDetailViewProps) {
  const spotsRemaining = event.capacity - attendees.length;
  const isFull = spotsRemaining <= 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Events
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{event.title}</h1>
            <p className="text-muted-foreground max-w-2xl">{event.description}</p>
          </div>
          <Badge 
            variant={isFull ? 'destructive' : 'default'}
            className={!isFull ? 'bg-success text-success-foreground' : ''}
          >
            {isFull ? 'Full' : `${spotsRemaining} spots remaining`}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy · h:mm a')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{attendees.length} / {event.capacity} registered</span>
          </div>
        </div>
      </div>

      {/* Attendees Section */}
      <div className="bg-card rounded-lg border shadow-card">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Registered Attendees</h2>
          <Button onClick={onAddAttendee} size="sm" disabled={isFull} className="gap-1.5">
            <UserPlus className="w-4 h-4" />
            Add Attendee
          </Button>
        </div>

        {isLoading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </TableBody>
          </Table>
        ) : attendees.length === 0 ? (
          <EmptyState
            type="attendees"
            action={
              <Button onClick={onAddAttendee} disabled={isFull} className="gap-1.5">
                <UserPlus className="w-4 h-4" />
                Add First Attendee
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendees.map((attendee) => (
                <TableRow key={attendee.id} className="animate-fade-in">
                  <TableCell className="font-medium">{attendee.name}</TableCell>
                  <TableCell className="text-muted-foreground">{attendee.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(attendee.registered_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Attendee</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {attendee.name} from this event?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteAttendee(attendee.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
