import { Injectable, signal, WritableSignal } from '@angular/core';
import { WEEK_STATE, DayApp, WORK_STATE } from '../models/day-app.model';
import { DayBdd } from '../models/day-bdd.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ContratUserApp } from '../models/contrat-employe.model';
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
  verifAuthenticate(): Observable<UserConnected> {
    return this.http.get<UserConnected>(
      `${URL_BACKEND}/user/verifAuthenticate`,
      httpOptions
    );
  }

  authentification(email: string, password: string): Observable<UserConnected> {
    return this.http
      .post<UserConnected>(
        URL_BACKEND + '/user/login',
        {
          email,
          password
        },
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  creationCompte(
    email: string,
    entreprise: string,
    password: string
  ): Observable<void> {
    return this.http
      .post<void>(
        URL_BACKEND + '/user/creation-compte',
        {
          email,
          entreprise,
          password
        },
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  logout(): Observable<void> {
    return this.http.get<void>(`${URL_BACKEND}/logout`, {
      withCredentials: true
    });
  }

  fetchUserConnected(avaibilityUrl: string): Observable<UserConnected> {
    return this.http
      .get<UserConnected>(
        `${URL_BACKEND}/user/fetch-user-connected/${avaibilityUrl}`
      )
      .pipe(catchError(this.handleError));
  }

  createContrat(contratEmploye: ContratUserApp): Observable<ContratUserApp[]> {
    return this.http
      .post<
        ContratUserApp[]
      >(`${URL_BACKEND}/contrat-user-app/create-contrat`, contratEmploye, httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateContrat(contratEmploye: ContratUserApp): Observable<ContratUserApp[]> {
    return this.http
      .post<
        ContratUserApp[]
      >(`${URL_BACKEND}/contrat-user-app/update-contrat`, contratEmploye, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getContratListByUserId(userAppId: string): Observable<ContratUserApp[]> {
    return this.http
      .get<
        ContratUserApp[]
      >(`${URL_BACKEND}/contrat-user-app/get-contrat-list-by-user-app-id/${userAppId}`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllContrat(): Observable<ContratUserApp[]> {
    return this.http
      .get<
        ContratUserApp[]
      >(`${URL_BACKEND}/contrat-user-app/get-all-contrat`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserContratList(): Observable<ContratUserApp[]> {
    return this.http
      .get<
        ContratUserApp[]
      >(`${URL_BACKEND}/contrat-user-app/get-user-contrat-list`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  createUserApp(userApp: UserApp): Observable<UserApp[]> {
    return this.http
      .post<
        UserApp[]
      >(`${URL_BACKEND}/user-app/create-user-app`, userApp, httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateUserApp(userApp: UserApp): Observable<UserApp[]> {
    return this.http
      .post<
        UserApp[]
      >(`${URL_BACKEND}/user-app/update-user-app`, userApp, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUserAppList(): Observable<UserApp[]> {
    return this.http
      .get<UserApp[]>(`${URL_BACKEND}/user-app/get-user-app-list`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getDayAppListByContratId(contratId: string): Observable<DayApp[]> {
    return this.http
      .get<
        DayApp[]
      >(`${URL_BACKEND}/day-app/get-all-by-contrat-id/${contratId}`, httpOptions)
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
