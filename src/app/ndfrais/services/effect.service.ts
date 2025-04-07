import { effect, Injectable } from '@angular/core';
import { RepoService } from './repo.service';
import { StoreService } from './store.service';
import { Ticket } from '../models/ticket.model';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTicketModal } from '../modals/update-ticket.modal';
import { Trajet } from '../models/trajet.model';
import { UpdateTrajetModal } from '../modals/update-trajet.modal';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

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

  currentDateChange(newDate: Date): void {
    this.store.currentDate.set(newDate);
  }

  getExcel(): void {
    this.store.isLoading.set(true);
    this.repo.getExcel(this.store.currentDate()).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download =
          format(Date.now(), 'yyyyMMddHHmmss') + 'ndfrais.pro' + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        this.store.isLoading.set(true);
      },
      (error) => {
        this.store.isLoading.set(true);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error
        });
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
    this.getImageByTicketId(ticket.id);
    this.dialog
      .open(UpdateTicketModal)
      .afterClosed()
      .subscribe((updatedTicket) => {
        if (updatedTicket) {
          this.updateTicket(updatedTicket);
        }
        this.getAllTicketByYearMonth(this.store.currentDate());
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
          this.updateTrajet(updatedTrajet);
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
      this.store.isLoading.set(false);
      this.store.ticketList.set(ticketList.map((t) => ({ ...t, dateTrajet: new Date(t.dateTicket), dateCreation: new Date(t.dateCreation) })));
    });
  }

  updateTicket(ticket: Ticket) {
    this.store.isLoading.set(true);
    this.repo
      .updateTicket(ticket, this.store.currentDate())
      .subscribe(() => {
        this.store.isLoading.set(false);
        this.store.ticketList.set( [...ticketList].map((t) => ({ ...t, dateTrajet: new Date(t.dateTicket), dateCreation: new Date(t.dateCreation) })))
      });
  }

  getAllTrajetByYearMonth(date: Date): void {
    this.store.isLoading.set(true);
    this.repo.getAllTrajetByYearMonth(date).subscribe((trajetList) => {
      this.store.isLoading.set(false);
      this.store.trajetList.set(
        trajetList.map((t) => ({ ...t, dateTrajet: new Date(t.dateTrajet), dateCreation: new Date(t.dateCreation) }))
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

  deleteTicket(ticket: Ticket) {
    this.store.isLoading.set(true);
    this.repo
      .deleteTicket(ticket, this.store.currentDate())
      .subscribe((ticketList) => {
        this.store.isLoading.set(false);
        this.store.ticketList.set(ticketList.map((t) => ({ ...t, dateTrajet: new Date(t.dateTicket), dateCreation: new Date(t.dateCreation) })));
      });
  }
}
