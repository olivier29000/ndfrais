import { Injectable, signal, WritableSignal } from '@angular/core';
import { DAY_STATE, DayApp, WORK_STATE } from '../models/day-app.model';
import { DayBdd } from '../models/day-bdd.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ContratEmploye } from '../models/contrat-employe.model';
import { UserApp } from '../models/user.model';
import { UserConnected } from '../models/user-connected.model';

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
export class RepoService {
  constructor(private http: HttpClient) {}

  createContrat(contratEmploye: ContratEmploye): Observable<ContratEmploye[]> {
    return this.http
      .post<
        ContratEmploye[]
      >(`${URL_BACKEND}/user/create-contrat`, contratEmploye, httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateContrat(contratEmploye: ContratEmploye): Observable<ContratEmploye[]> {
    return this.http
      .post<
        ContratEmploye[]
      >(`${URL_BACKEND}/user/update-contrat`, contratEmploye, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getContratListByUserId(userAppId: string): Observable<ContratEmploye[]> {
    return this.http
      .get<
        ContratEmploye[]
      >(`${URL_BACKEND}/user/get-contrat-list-by-user-id/${userAppId}`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  createUserApp(userApp: UserApp): Observable<UserApp[]> {
    return this.http
      .post<
        UserApp[]
      >(`${URL_BACKEND}/user/create-user-app`, userApp, httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateUserApp(userApp: UserApp): Observable<UserApp[]> {
    return this.http
      .post<
        UserApp[]
      >(`${URL_BACKEND}/user/update-user-app`, userApp, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserAppList(): Observable<UserApp[]> {
    return this.http
      .get<UserApp[]>(`${URL_BACKEND}/user/get-user-app-list`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserConnected(): Observable<UserConnected> {
    return this.http
      .get<UserConnected>(`${URL_BACKEND}/user/get-user-connected`, httpOptions)
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
