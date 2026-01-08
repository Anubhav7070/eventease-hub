import { useState } from 'react';
import { Plus, Calendar, Users, TrendingUp } from 'lucide-react';
import { useEvents, useCreateEvent, useDeleteEvent } from '@/hooks/useEvents';
import { useAttendees, useCreateAttendee, useDeleteAttendee } from '@/hooks/useAttendees';
import { EventWithAttendees } from '@/types';
import { EventFormData, AttendeeFormData } from '@/lib/validations';
import { Header } from '@/components/Header';
import { EventCard } from '@/components/EventCard';
import { EventFormDialog } from '@/components/EventFormDialog';
import { AttendeeFormDialog } from '@/components/AttendeeFormDialog';
import { EventDetailView } from '@/components/EventDetailView';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { EventCardSkeleton } from '@/components/ui/loading-skeleton';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventWithAttendees | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isAttendeeDialogOpen, setIsAttendeeDialogOpen] = useState(false);

  // Queries
  const { data: events, isLoading, isError, refetch } = useEvents();
  const { data: attendees, isLoading: isLoadingAttendees } = useAttendees(selectedEvent?.id || '');

  // Mutations
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const createAttendee = useCreateAttendee();
  const deleteAttendee = useDeleteAttendee();

  const handleCreateEvent = (data: EventFormData) => {
    createEvent.mutate({
      title: data.title,
      description: data.description,
      date: data.date,
      capacity: data.capacity,
    }, {
      onSuccess: () => setIsEventDialogOpen(false),
    });
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent.mutate(id);
  };

  const handleViewEvent = (event: EventWithAttendees) => {
    setSelectedEvent(event);
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
  };

  const handleAddAttendee = (data: AttendeeFormData) => {
    if (!selectedEvent) return;
    createAttendee.mutate(
      { 
        name: data.name,
        email: data.email,
        event_id: selectedEvent.id 
      },
      {
        onSuccess: () => setIsAttendeeDialogOpen(false),
      }
    );
  };

  const handleDeleteAttendee = (id: string) => {
    if (!selectedEvent) return;
    deleteAttendee.mutate({ id, eventId: selectedEvent.id });
  };

  // Stats
  const totalEvents = events?.length || 0;
  const totalAttendees = events?.reduce((acc, e) => acc + e.attendee_count, 0) || 0;
  const totalCapacity = events?.reduce((acc, e) => acc + e.capacity, 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedEvent ? (
          <>
            <EventDetailView
              event={selectedEvent}
              attendees={attendees || []}
              isLoading={isLoadingAttendees}
              onBack={handleBackToEvents}
              onAddAttendee={() => setIsAttendeeDialogOpen(true)}
              onDeleteAttendee={handleDeleteAttendee}
            />
            <AttendeeFormDialog
              open={isAttendeeDialogOpen}
              onOpenChange={setIsAttendeeDialogOpen}
              onSubmit={handleAddAttendee}
              isSubmitting={createAttendee.isPending}
              eventTitle={selectedEvent.title}
              spotsRemaining={selectedEvent.capacity - (attendees?.length || 0)}
            />
          </>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-lg border p-4 shadow-card animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalEvents}</p>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border p-4 shadow-card animate-slide-up" style={{ animationDelay: '50ms' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalAttendees}</p>
                    <p className="text-sm text-muted-foreground">Registered</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border p-4 shadow-card animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {totalCapacity > 0 ? Math.round((totalAttendees / totalCapacity) * 100) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Fill Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Events</h2>
                <p className="text-sm text-muted-foreground">Manage your events and registrations</p>
              </div>
              <Button onClick={() => setIsEventDialogOpen(true)} className="gap-1.5">
                <Plus className="w-4 h-4" />
                Create Event
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <ErrorState onRetry={() => refetch()} />
            ) : events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event, index) => (
                  <div key={event.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <EventCard
                      event={event}
                      onView={handleViewEvent}
                      onDelete={handleDeleteEvent}
                      isDeleting={deleteEvent.isPending}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                type="events"
                action={
                  <Button onClick={() => setIsEventDialogOpen(true)} className="gap-1.5">
                    <Plus className="w-4 h-4" />
                    Create Your First Event
                  </Button>
                }
              />
            )}

            <EventFormDialog
              open={isEventDialogOpen}
              onOpenChange={setIsEventDialogOpen}
              onSubmit={handleCreateEvent}
              isSubmitting={createEvent.isPending}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
