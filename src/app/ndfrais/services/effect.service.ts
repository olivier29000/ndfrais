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
    effect(
      () => {
        this.getAllTicketByYearMonth(this.store.currentDate());
        this.getAllTrajetByYearMonth(this.store.currentDate());
      },
      {
        allowSignalWrites: true
      }
    );
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

  createTrajetModal() {
    this.store.currentTrajet.set({
      titre: '',
      dateTrajet: new Date(),
      dateCreation: new Date(),
      nbkm: 0,
      depart: {
        lat: 0,
        lon: 0,
        displayed: ''
      },
      arrive: {
        lat: 1,
        lon: 1,
        displayed: ''
      }
    });

    this.dialog
      .open(UpdateTrajetModal)
      .afterClosed()
      .subscribe((createdTrajet) => {
        if (createdTrajet) {
          this.createTrajet(createdTrajet);
        }
      });
  }
  updateTrajetModal(trajet: Trajet) {
    this.store.currentTrajet.set(trajet);
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

  getAllTicketByYearMonth(date: Date): void {
    this.store.isLoading.set(true);
    this.repo.getAllTicketByYearMonth(date).subscribe((ticketList) => {
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

  getAllTrajetByYearMonth(date: Date): void {
    this.store.isLoading.set(true);
    this.repo.getAllTrajetByYearMonth(date).subscribe((trajetList) => {
      console.log(trajetList);
      this.store.isLoading.set(false);
      this.store.trajetList.set(
        trajetList.map((t) => ({ ...t, dateTrajet: new Date(t.dateTrajet) }))
      );
    });
  }
  createTrajet(trajet: Trajet) {
    this.store.isLoading.set(true);
    this.repo
      .createTrajet(trajet, this.store.currentDate())
      .subscribe((trajetList) => {
        this.store.isLoading.set(false);
        this.store.trajetList.set(trajetList);
      });
  }
  updateTrajet(trajet: Trajet) {
    this.store.isLoading.set(true);
    this.repo
      .updateTrajet(trajet, this.store.currentDate())
      .subscribe((trajetList) => {
        this.store.isLoading.set(false);
        this.store.trajetList.set(trajetList);
      });
  }
  deleteTrajet(trajet: Trajet) {
    this.store.isLoading.set(true);
    this.repo
      .deleteTrajet(trajet, this.store.currentDate())
      .subscribe((trajetList) => {
        this.store.isLoading.set(false);
        this.store.trajetList.set(trajetList);
      });
  }
}
