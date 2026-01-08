import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventStore } from '@/lib/eventStore';
import { Attendee } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useAttendees = (eventId: string) => {
  return useQuery({
    queryKey: ['attendees', eventId],
    queryFn: () => eventStore.getAttendees(eventId),
    enabled: !!eventId,
  });
};

export const useCreateAttendee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Attendee, 'id' | 'registered_at'>) => eventStore.createAttendee(data),
    onMutate: async (newAttendee) => {
      await queryClient.cancelQueries({ queryKey: ['attendees', newAttendee.event_id] });
      const previousAttendees = queryClient.getQueryData(['attendees', newAttendee.event_id]);

      // Optimistic update
      queryClient.setQueryData(['attendees', newAttendee.event_id], (old: any) => {
        const optimisticAttendee = {
          ...newAttendee,
          id: 'temp-' + Date.now(),
          registered_at: new Date().toISOString(),
        };
        return old ? [...old, optimisticAttendee] : [optimisticAttendee];
      });

      return { previousAttendees, eventId: newAttendee.event_id };
    },
    onError: (err: Error, newAttendee, context) => {
      queryClient.setQueryData(['attendees', context?.eventId], context?.previousAttendees);
      toast({
        title: 'Error',
        description: err.message || 'Failed to register attendee. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Attendee registered successfully!',
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendees', variables.event_id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useDeleteAttendee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, eventId }: { id: string; eventId: string }) => eventStore.deleteAttendee(id),
    onMutate: async ({ id, eventId }) => {
      await queryClient.cancelQueries({ queryKey: ['attendees', eventId] });
      const previousAttendees = queryClient.getQueryData(['attendees', eventId]);

      // Optimistic update
      queryClient.setQueryData(['attendees', eventId], (old: any) =>
        old?.filter((attendee: any) => attendee.id !== id)
      );

      return { previousAttendees, eventId };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['attendees', context?.eventId], context?.previousAttendees);
      toast({
        title: 'Error',
        description: 'Failed to remove attendee. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Attendee removed successfully!',
      });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendees', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
