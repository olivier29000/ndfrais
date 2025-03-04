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
import { ContratUserApp } from 'src/app/models/contrat-employe.model';
import { CalendarEvent } from 'angular-calendar';
import { UtilsService } from 'src/app/services/utils.service';

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
  constructor(
    private http: HttpClient,
    private utils: UtilsService
  ) {}
  getAllEventByContratIdAndPeriod(
    start: Date,
    end: Date,
    contratId: string
  ): Observable<CalendarEvent[]> {
    return this.http
      .get<
        CalendarEvent[]
      >(`${URL_BACKEND}/user/event/get-all-event-by-contrat-id-and-period/${contratId}/${this.utils.getDateString(start) + '-00-00'}/${this.utils.getDateString(end) + '-23-59'}`, httpOptions)
      .pipe(catchError(this.handleError));
  }
  userGetHistoriqueActionList(contratId: string): Observable<Action[]> {
    return this.http
      .get<
        Action[]
      >(`${URL_BACKEND}/day-app-action/get-historique-by-contrat-id/${contratId}`, httpOptions)
      .pipe(catchError(this.handleError));
  }
  getPdfById(idPdf: number): Observable<Blob> {
    return this.http
      .get<Blob>(`${URL_BACKEND}/day-app-action/get-pdf-by-id/${idPdf}`, {
        withCredentials: true,
        responseType: 'blob' as 'json'
      })
      .pipe(catchError(this.handleError));
  }

  askAction(action: Action): Observable<Action> {
    return this.http
      .post<Action>(
        `${URL_BACKEND}/day-app-action/user-ask-day-app-action-list`,
        action,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getUserDayAppListByContratId(contratId: string): Observable<DayApp[]> {
    return this.http
      .get<
        DayApp[]
      >(`${URL_BACKEND}/day-app/get-user-day-app-list-by-contrat-id/${contratId}`, httpOptions)
      .pipe(catchError(this.handleError));
  }

  getRecapEquipe(
    dateStr: string,
    idContratUserApp: string
  ): Observable<{ contrat: ContratUserApp; dayAppList: DayApp[] }[]> {
    return this.http
      .get<
        {
          contrat: ContratUserApp;
          dayAppList: DayApp[];
        }[]
      >(
        `${URL_BACKEND}/day-app/get-recap-equipe/${dateStr}/${idContratUserApp}`,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getRecapContrat(
    dateStrList: string[],
    idContratUserApp: string
  ): Observable<
    {
      contrat: ContratUserApp;
      dayAppList: DayApp[];
      nbHours: number;
    }[]
  > {
    return this.http
      .post<
        {
          contrat: ContratUserApp;
          dayAppList: DayApp[];
          nbHours: number;
        }[]
      >(
        `${URL_BACKEND}/day-app/get-recap-contrat/${idContratUserApp}`,
        dateStrList,
        httpOptions
      )
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

  uploadPdf(file: File, idAction: number): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<void>(
      `${URL_BACKEND}/day-app-action/upload-pdf/${idAction}`,
      formData,
      {
        withCredentials: true
      }
    );
  }
}
