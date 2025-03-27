import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { environment } from 'src/environment/environment';
import { Image } from '../models/image.model';
import { Trajet } from '../models/trajet.model';
const URL_BACKEND = environment.urlBackEnd;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
    // Autres headers si besoin
  }),
  withCredentials: true
};
@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class RepoService {
  constructor(private http: HttpClient) {}

  uploadTicket(file: File): Observable<Ticket> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Ticket>(
      `${URL_BACKEND}/ticket/upload-image`,
      formData,
      { withCredentials: true }
    );
  }

  updateTicket(ticket: Ticket, date: Date): Observable<Ticket[]> {
    ticket = { ...ticket, dateTicket: this.getDateUTC(ticket.dateTicket) };
    const monthStr: string =
      (date.getMonth() < 9
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      date.getFullYear();
    return this.http.post<Ticket[]>(
      `${URL_BACKEND}/ticket/update-ticket/${monthStr}`,
      ticket,
      httpOptions
    );
  }

  deleteTicket(ticket: Ticket, date: Date): Observable<Ticket[]> {
    const monthStr: string =
      (date.getMonth() < 9
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      date.getFullYear();
    return this.http.get<Ticket[]>(
      `${URL_BACKEND}/ticket/delete-by-id/${ticket.id}/${monthStr}`,
      httpOptions
    );
  }

  createTrajet(trajet: Trajet, date: Date): Observable<Trajet[]> {
    const monthStr: string =
      (date.getMonth() < 9
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      date.getFullYear();
    return this.http.post<Trajet[]>(
      `${URL_BACKEND}/trajet/create-trajet/${monthStr}`,
      trajet,
      httpOptions
    );
  }

  deleteTrajet(trajet: Trajet, date: Date): Observable<Trajet[]> {
    const monthStr: string =
      (date.getMonth() < 9
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      date.getFullYear();
    return this.http.get<Trajet[]>(
      `${URL_BACKEND}/trajet/delete-by-id/${trajet.id}/${monthStr}`,
      httpOptions
    );
  }

  updateTrajet(trajet: Trajet, date: Date): Observable<Trajet[]> {
    const monthStr: string =
      (date.getMonth() < 9
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      date.getFullYear();
    return this.http.post<Trajet[]>(
      `${URL_BACKEND}/trajet/update-trajet/${monthStr}`,
      trajet,
      httpOptions
    );
  }

  getImageByTicketId(ticketId: number): Observable<Image> {
    return this.http.get<Image>(
      `${URL_BACKEND}/ticket/get-image-by-ticket-id/${ticketId}`,
      httpOptions
    );
  }

  getAllTicketByYearMonth(date: Date): Observable<Ticket[]> {
    const monthStr: string =
      (date.getMonth() < 9
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      date.getFullYear();
    return this.http.get<Ticket[]>(
      `${URL_BACKEND}/ticket/get-all-by-year-month/${monthStr}`,
      httpOptions
    );
  }

  getAllTrajetByYearMonth(date: Date): Observable<Trajet[]> {
    const monthStr: string =
      (date.getMonth() < 9
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      date.getFullYear();
    return this.http.get<Trajet[]>(
      `${URL_BACKEND}/trajet/get-all-by-year-month/${monthStr}`,
      httpOptions
    );
  }

  getDateUTC(date: Date): Date {
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );
  }
}
