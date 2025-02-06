import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { DayAppAction } from 'src/app/models/day-app-action.model';

const URL_BACKEND = environment.urlBackEnd + '/manager';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class ManagerRepoService {
  constructor(private http: HttpClient) {}

  getAllContratUserApp(): Observable<ContratUserApp[]> {
    return this.http
      .get<
        ContratUserApp[]
      >(`${URL_BACKEND}/contrat-user-app/get-all-contrat`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  validDayAppActionList(
    dayAppActionList: DayAppAction[]
  ): Observable<DayAppAction[]> {
    return this.http
      .post<
        DayAppAction[]
      >(`${URL_BACKEND}/day-app-action/valid-day-app-action-list`, dayAppActionList, httpOptions)
      .pipe(catchError(this.handleError));
  }

  refuseDayAppActionList(
    dayAppActionList: DayAppAction[]
  ): Observable<DayAppAction[]> {
    return this.http
      .post<
        DayAppAction[]
      >(`${URL_BACKEND}/day-app-action/refuse-day-app-action-list`, dayAppActionList, httpOptions)
      .pipe(catchError(this.handleError));
  }
  getDayAppActionListByUserApp(): Observable<DayAppAction[]> {
    return this.http
      .get<
        DayAppAction[]
      >(`${URL_BACKEND}/day-app-action/get-all-by-user-app`, httpOptions)
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
