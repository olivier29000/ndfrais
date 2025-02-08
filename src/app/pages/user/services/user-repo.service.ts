import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { DayApp } from 'src/app/models/day-app.model';
import { Action } from 'src/app/models/action.model';

const URL_BACKEND = environment.urlBackEnd;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class UserRepoService {
  constructor(private http: HttpClient) {}
  askActionList(action: Action): Observable<DayApp[]> {
    return this.http
      .post<
        DayApp[]
      >(`${URL_BACKEND}/day-app-action/user-ask-day-app-action-list`, action, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserDayAppListByContratId(contratId: string): Observable<DayApp[]> {
    return this.http
      .get<
        DayApp[]
      >(`${URL_BACKEND}/day-app/get-user-day-app-list-by-contrat-id/${contratId}`, httpOptions)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 409) {
      // Conflict: User already exists
      return throwError(error.error);
    }
    // Generic error handling
    return throwError("Une erreur inconnue s'est produite");
  }
}
