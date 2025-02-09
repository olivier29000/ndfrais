import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { Action } from 'src/app/models/action.model';

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

  validAction(action: Action): Observable<Action[]> {
    return this.http
      .post<
        Action[]
      >(`${URL_BACKEND}/day-app-action/valid-action`, action, httpOptions)
      .pipe(catchError(this.handleError));
  }

  refuseAction(action: Action): Observable<Action[]> {
    return this.http
      .post<
        Action[]
      >(`${URL_BACKEND}/day-app-action/refuse-action`, action, httpOptions)
      .pipe(catchError(this.handleError));
  }
  getActionListByUserApp(): Observable<Action[]> {
    return this.http
      .get<
        Action[]
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
