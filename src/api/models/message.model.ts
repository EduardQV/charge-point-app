export interface Event {
  event: EventType;
  message: string;
}

export enum EventType {
  Connection = 'new_connection',
  ChargePointStatusChange = 'chargepoint_status_change'
}
