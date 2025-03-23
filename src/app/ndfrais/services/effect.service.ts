import { effect, Injectable } from '@angular/core';
import { RepoService } from './repo.service';
import { StoreService } from './store.service';
import { Ticket } from '../models/ticket.model';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTicketModal } from '../modals/update-ticket.modal';
import { Trajet } from '../models/trajet.model';
import { UpdateTrajetModal } from '../modals/update-trajet.modal';

@Injectable({
  providedIn: 'root'
})
export class EffectService {
  constructor(
    private dialog: MatDialog,
    private store: StoreService,
    private repo: RepoService
  ) {
    effect(() => this.getAllByYearMonth(this.store.currentDate()), {
      allowSignalWrites: true
    });
  }

  uploadTicket(file: File): void {
    this.store.isLoading.set(true);
    this.repo.uploadTicket(file).subscribe((ticket) => {
      this.store.isLoading.set(false);
      this.updateTicketModal(ticket);
    });
  }

  updateTicketModal(ticket: Ticket) {
    this.store.currentTicket.set(ticket);
    this.dialog
      .open(UpdateTicketModal)
      .afterClosed()
      .subscribe((updatedTicket) => {
        if (updatedTicket) {
          this.updateTicket(updatedTicket);
        }
      });
  }

  updateTrajetModal(trajet?: Trajet) {
    if (trajet) {
      this.store.currentTrajet.set(trajet);
    } else {
      this.store.currentTrajet.set({
        titre: '',
        dateTrajet: new Date(),
        dateCreation: new Date(),
        nbkm: 0,
        depart: {
          lat: 0,
          lon: 0
        },
        arrive: {
          lat: 1,
          lon: 1
        }
      });
    }
    console.log('UpdateTrajetModal');
    this.dialog
      .open(UpdateTrajetModal)
      .afterClosed()
      .subscribe((updatedTrajet) => {
        if (updatedTrajet) {
          // this.updateTicket(updatedTicket);
        }
      });
  }

  getImageByTicketId(ticketId: number) {
    this.repo.getImageByTicketId(ticketId).subscribe((image) => {
      this.store.currentTicket.update((currentTicket) => {
        if (currentTicket) {
          return { ...currentTicket, image };
        } else {
          return undefined;
        }
      });
    });
  }

  getAllByYearMonth(date: Date): void {
    this.store.isLoading.set(true);
    this.repo.getAllByYearMonth(date).subscribe((ticketList) => {
      console.log(ticketList);
      this.store.isLoading.set(false);
      this.store.ticketList.set(ticketList);
    });
  }

  updateTicket(ticket: Ticket) {
    this.store.isLoading.set(true);
    this.repo
      .updateTicket(ticket, this.store.currentDate())
      .subscribe((ticketList) => {
        this.store.isLoading.set(false);
        this.store.ticketList.set(ticketList);
      });
  }
}
