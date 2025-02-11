import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { catchError, Observable, throwError } from 'rxjs';
import { UserApp } from 'src/app/models/user.model';

const URL_BACKEND = environment.urlBackEnd + '/admin';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class AdminRepoService {
  constructor(private http: HttpClient) {}

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

  getAllContrat(): Observable<ContratUserApp[]> {
    return this.http
      .get<
        ContratUserApp[]
      >(`${URL_BACKEND}/contrat-user-app/get-all-contrat`, httpOptions)
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
