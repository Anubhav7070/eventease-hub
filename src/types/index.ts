export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  capacity: number;
  created_at: string;
}

export interface Attendee {
  id: string;
  event_id: string;
  name: string;
  email: string;
  registered_at: string;
}

export interface EventWithAttendees extends Event {
  attendees: Attendee[];
  attendee_count: number;
}
