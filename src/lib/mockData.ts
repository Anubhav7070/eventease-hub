import { Event, Attendee } from '@/types';

// Mock data for demo purposes - will be replaced with Supabase
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    description: 'Annual technology conference featuring the latest innovations in AI, cloud computing, and software development.',
    date: '2024-03-15T09:00:00',
    capacity: 500,
    created_at: '2024-01-01T00:00:00',
  },
  {
    id: '2',
    title: 'Design Workshop',
    description: 'Hands-on workshop covering UI/UX design principles, prototyping, and user research methodologies.',
    date: '2024-03-20T14:00:00',
    capacity: 30,
    created_at: '2024-01-05T00:00:00',
  },
  {
    id: '3',
    title: 'Startup Networking Night',
    description: 'Connect with fellow entrepreneurs, investors, and industry leaders in an informal setting.',
    date: '2024-03-25T18:00:00',
    capacity: 100,
    created_at: '2024-01-10T00:00:00',
  },
];

export const mockAttendees: Attendee[] = [
  {
    id: '1',
    event_id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    registered_at: '2024-01-15T10:00:00',
  },
  {
    id: '2',
    event_id: '1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    registered_at: '2024-01-16T11:00:00',
  },
  {
    id: '3',
    event_id: '2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    registered_at: '2024-01-17T09:00:00',
  },
];
