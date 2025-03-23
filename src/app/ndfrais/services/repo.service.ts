import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { environment } from 'src/environment/environment';
import { Image } from '../models/image.model';
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

  getImageByTicketId(ticketId: number): Observable<Image> {
    return this.http.get<Image>(
      `${URL_BACKEND}/ticket/get-image-by-ticket-id/${ticketId}`,
      httpOptions
    );
  }

  getAllByYearMonth(date: Date): Observable<Ticket[]> {
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
