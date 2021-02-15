import { Event } from './event.model';

export interface Notification extends Event {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}
