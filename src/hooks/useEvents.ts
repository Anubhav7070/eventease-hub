import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventStore } from '@/lib/eventStore';
import { Event } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => eventStore.getEvents(),
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventStore.getEvent(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Event, 'id' | 'created_at'>) => eventStore.createEvent(data),
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: ['events'] });
      const previousEvents = queryClient.getQueryData(['events']);

      // Optimistic update
      queryClient.setQueryData(['events'], (old: any) => {
        const optimisticEvent = {
          ...newEvent,
          id: 'temp-' + Date.now(),
          created_at: new Date().toISOString(),
          attendees: [],
          attendee_count: 0,
        };
        return old ? [...old, optimisticEvent] : [optimisticEvent];
      });

      return { previousEvents };
    },
    onError: (err, newEvent, context) => {
      queryClient.setQueryData(['events'], context?.previousEvents);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Event created successfully!',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Event, 'id' | 'created_at'>> }) =>
      eventStore.updateEvent(id, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Event updated successfully!',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update event. Please try again.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventStore.deleteEvent(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['events'] });
      const previousEvents = queryClient.getQueryData(['events']);

      // Optimistic update
      queryClient.setQueryData(['events'], (old: any) =>
        old?.filter((event: any) => event.id !== deletedId)
      );

      return { previousEvents };
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(['events'], context?.previousEvents);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Event deleted successfully!',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
