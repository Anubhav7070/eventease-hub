import { Event, Attendee, EventWithAttendees } from '@/types';
import { mockEvents, mockAttendees } from './mockData';

// In-memory store for demo - simulates database operations
let events: Event[] = [...mockEvents];
let attendees: Attendee[] = [...mockAttendees];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const eventStore = {
  // Events
  async getEvents(): Promise<EventWithAttendees[]> {
    await delay(300);
    return events.map(event => ({
      ...event,
      attendees: attendees.filter(a => a.event_id === event.id),
      attendee_count: attendees.filter(a => a.event_id === event.id).length,
    }));
  },

  async getEvent(id: string): Promise<EventWithAttendees | null> {
    await delay(200);
    const event = events.find(e => e.id === id);
    if (!event) return null;
    return {
      ...event,
      attendees: attendees.filter(a => a.event_id === event.id),
      attendee_count: attendees.filter(a => a.event_id === event.id).length,
    };
  },

  async createEvent(data: Omit<Event, 'id' | 'created_at'>): Promise<Event> {
    await delay(300);
    const newEvent: Event = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    events = [...events, newEvent];
    return newEvent;
  },

  async updateEvent(id: string, data: Partial<Omit<Event, 'id' | 'created_at'>>): Promise<Event | null> {
    await delay(300);
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return null;
    events[index] = { ...events[index], ...data };
    return events[index];
  },

  async deleteEvent(id: string): Promise<boolean> {
    await delay(300);
    const initialLength = events.length;
    events = events.filter(e => e.id !== id);
    attendees = attendees.filter(a => a.event_id !== id);
    return events.length < initialLength;
  },

  // Attendees
  async getAttendees(eventId: string): Promise<Attendee[]> {
    await delay(200);
    return attendees.filter(a => a.event_id === eventId);
  },

  async createAttendee(data: Omit<Attendee, 'id' | 'registered_at'>): Promise<Attendee> {
    await delay(300);
    const event = events.find(e => e.id === data.event_id);
    const currentCount = attendees.filter(a => a.event_id === data.event_id).length;
    
    if (event && currentCount >= event.capacity) {
      throw new Error('Event is at full capacity');
    }

    const newAttendee: Attendee = {
      ...data,
      id: crypto.randomUUID(),
      registered_at: new Date().toISOString(),
    };
    attendees = [...attendees, newAttendee];
    return newAttendee;
  },

  async deleteAttendee(id: string): Promise<boolean> {
    await delay(300);
    const initialLength = attendees.length;
    attendees = attendees.filter(a => a.id !== id);
    return attendees.length < initialLength;
  },
};
