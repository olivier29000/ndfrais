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
import { DayApp } from 'src/app/models/day-app.model';

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
  getPdfById(idPdf: number): Observable<Blob> {
    return this.http
      .get<Blob>(`${URL_BACKEND}/day-app-action/get-pdf-by-id/${idPdf}`, {
        withCredentials: true,
        responseType: 'blob' as 'json'
      })
      .pipe(catchError(this.handleError));
  }
  getAllContratUserApp(): Observable<ContratUserApp[]> {
    return this.http
      .get<
        ContratUserApp[]
      >(`${URL_BACKEND}/contrat-user-app/get-all-contrat`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  managerGetHistoriqueActionList(dateStr: number): Observable<Action[]> {
    return this.http
      .get<
        Action[]
      >(`${URL_BACKEND}/day-app-action/get-historique/${dateStr}`, httpOptions)
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
  getRecap(
    dateStr: string
  ): Observable<{ contrat: ContratUserApp; dayAppList: DayApp[] }[]> {
    return this.http
      .get<
        { contrat: ContratUserApp; dayAppList: DayApp[] }[]
      >(`${URL_BACKEND}/day-app/get-recap/${dateStr}`, httpOptions)
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
