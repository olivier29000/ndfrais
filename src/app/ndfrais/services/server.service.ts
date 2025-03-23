import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { EffectService } from './effect.service';
import { Ticket } from '../models/ticket.model';
import { Trajet } from '../models/trajet.model';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  constructor(
    private store: StoreService,
    private effect: EffectService
  ) {}
  currentTicket = this.store.currentTicket;
  currentTrajet = this.store.currentTrajet;
  currentDate = this.store.currentDate;
  ticketList = this.store.ticketList;
  uploadTicket(file: File): void {
    this.effect.uploadTicket(file);
  }

  updateTicketModal(ticket: Ticket) {
    this.effect.updateTicketModal(ticket);
  }

  updateTrajetModal(trajet?: Trajet) {
    this.effect.updateTrajetModal(trajet);
  }

  getImageByTicketId(ticketId: number) {
    this.effect.getImageByTicketId(ticketId);
  }
}
