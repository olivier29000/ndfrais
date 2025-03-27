import { Injectable, signal, WritableSignal } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { Trajet } from '../models/trajet.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  constructor() {}
  currentDate: WritableSignal<Date> = signal(new Date());
  isLoading: WritableSignal<boolean> = signal(false);
  ticketList: WritableSignal<Ticket[]> = signal([]);
  trajetList: WritableSignal<Trajet[]> = signal([]);
  currentTicket: WritableSignal<Ticket | undefined> = signal(undefined);
  currentTrajet: WritableSignal<Trajet | undefined> = signal(undefined);
}
