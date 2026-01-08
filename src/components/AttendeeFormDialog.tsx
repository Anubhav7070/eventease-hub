import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendeeSchema, AttendeeFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AttendeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AttendeeFormData) => void;
  isSubmitting?: boolean;
  eventTitle: string;
  spotsRemaining: number;
}

export function AttendeeFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  eventTitle,
  spotsRemaining,
}: AttendeeFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AttendeeFormData>({
    resolver: zodResolver(attendeeSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const handleFormSubmit = (data: AttendeeFormData) => {
    onSubmit(data);
    reset();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  const isFull = spotsRemaining <= 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register Attendee</DialogTitle>
          <DialogDescription>
            Add a new attendee to "{eventTitle}".
            {!isFull && (
              <span className="block mt-1 text-muted-foreground">
                {spotsRemaining} spots remaining
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isFull ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">
              This event is at full capacity. No more registrations are available.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter attendee name"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
