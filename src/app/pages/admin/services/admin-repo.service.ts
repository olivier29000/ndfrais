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
import { Action } from 'src/app/models/action.model';
import { DayApp } from 'src/app/models/day-app.model';
import { CalendarEvent } from 'angular-calendar';
import { UtilsService } from 'src/app/services/utils.service';
import { Abonnement, UserConnected } from 'src/app/models/user-connected.model';
import { Tag } from 'src/app/models/tag.model';

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
  constructor(
    private http: HttpClient,
    private utils: UtilsService
  ) {}

  addTag(tag: Tag): Observable<Record<string, Tag[]>> {
    return this.http
      .post<
        Record<string, Tag[]>
      >(`${URL_BACKEND}/event/post-tag`, tag, httpOptions)
      .pipe(catchError(this.handleError));
  }
  getTagMap(): Observable<Record<string, Tag[]>> {
    return this.http
      .get<
        Record<string, Tag[]>
      >(`${URL_BACKEND}/event/get-tag-list-map`, httpOptions)
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
  sendEmailContact(contact: string): Observable<void> {
    return this.http
      .get<void>(
        `${URL_BACKEND}/user-app/send-email-contact/${contact}`,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  verifDispoPseudo(pseudo: string): Observable<void> {
    return this.http
      .get<void>(`${URL_BACKEND}/user-app/verif-pseudo/${pseudo}`, httpOptions)
      .pipe(catchError(this.handleError));
  }
  selectAbonnement(abonnement: Abonnement): Observable<UserConnected> {
    return this.http
      .get<UserConnected>(
        `${environment.urlBackEnd}/user/select-abonnement/${abonnement}`,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  createNewEvent(
    calendarEvent: CalendarEvent,
    contratId: string
  ): Observable<CalendarEvent[]> {
    return this.http
      .post<
        CalendarEvent[]
      >(`${URL_BACKEND}/event/create-event/${contratId}`, calendarEvent, httpOptions)
      .pipe(catchError(this.handleError));
  }
  copyPasteWeek(
    dateToCopy: Date,
    dateToPaste: Date,
    contratId: string
  ): Observable<void> {
    return this.http
      .get<void>(
        `${URL_BACKEND}/event/copy-paste-week/${this.utils.getDateString(dateToCopy)}/${this.utils.getDateString(dateToPaste)}/${contratId}`,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  deleteEvent(calendarEvent: CalendarEvent): Observable<void> {
    return this.http
      .get<void>(
        `${URL_BACKEND}/event/delete-event-by-id/${calendarEvent.id}`,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getAllEventByContratIdListAndPeriod(
    start: Date,
    end: Date,
    contratIdList: number[]
  ): Observable<CalendarEvent[]> {
    return this.http
      .post<
        CalendarEvent[]
      >(`${URL_BACKEND}/event/get-all-event-by-contrat-id-list-and-period/${this.utils.getDateString(start) + '-00-00'}/${this.utils.getDateString(end) + '-23-59'}`, contratIdList, httpOptions)
      .pipe(catchError(this.handleError));
  }
  getAllEventByContratIdAndPeriod(
    start: Date,
    end: Date,
    contratId: string
  ): Observable<CalendarEvent[]> {
    return this.http
      .get<
        CalendarEvent[]
      >(`${URL_BACKEND}/event/get-all-event-by-contrat-id-and-period/${contratId}/${this.utils.getDateString(start) + '-00-00'}/${this.utils.getDateString(end) + '-23-59'}`, httpOptions)
      .pipe(catchError(this.handleError));
  }
  getDayAppListByContratId(contratId: string): Observable<DayApp[]> {
    return this.http
      .get<
        DayApp[]
      >(`${URL_BACKEND}/day-app/get-all-by-contrat-id/${contratId}`, httpOptions)
      .pipe(catchError(this.handleError));
  }
  getActionList(): Observable<Action[]> {
    return this.http
      .get<Action[]>(`${URL_BACKEND}/day-app-action/get-all`, httpOptions)
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
  getRecap(
    dateStr: string
  ): Observable<
    { contrat: ContratUserApp; dayAppList: DayApp[]; nbHours: number }[]
  > {
    return this.http
      .get<
        { contrat: ContratUserApp; dayAppList: DayApp[]; nbHours: number }[]
      >(`${URL_BACKEND}/day-app/get-recap/${dateStr}`, httpOptions)
      .pipe(catchError(this.handleError));
  }
  getExcelRecap(dateStr: string): Observable<Blob> {
    return this.http
      .get(`${URL_BACKEND}/day-app/get-excel-recap/${dateStr}`, {
        ...httpOptions,
        responseType: 'blob'
      })
      .pipe(catchError(this.handleError));
  }
  adminGetHistoriqueActionList(dateStr: number): Observable<Action[]> {
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
  createContrat(contratEmploye: ContratUserApp): Observable<ContratUserApp[]> {
    contratEmploye = {
      ...contratEmploye,
      dateBegin: this.utils.getDateUTC(contratEmploye.dateBegin),
      dateEnd: this.utils.getDateUTC(contratEmploye.dateEnd)
    };
    return this.http
      .post<
        ContratUserApp[]
      >(`${URL_BACKEND}/contrat-user-app/create-contrat`, contratEmploye, httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateContrat(contratEmploye: ContratUserApp): Observable<ContratUserApp[]> {
    contratEmploye = {
      ...contratEmploye,
      dateBegin: this.utils.getDateUTC(contratEmploye.dateBegin),
      dateEnd: this.utils.getDateUTC(contratEmploye.dateEnd)
    };
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
    userApp.contratUserApp = {
      ...userApp.contratUserApp,
      dateBegin: this.utils.getDateUTC(userApp.contratUserApp.dateBegin),
      dateEnd: this.utils.getDateUTC(userApp.contratUserApp.dateEnd)
    };
    return this.http
      .post<
        UserApp[]
      >(`${URL_BACKEND}/user-app/create-user-app`, userApp, httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateUserApp(userApp: UserApp): Observable<UserApp[]> {
    userApp.contratUserApp = {
      ...userApp.contratUserApp,
      dateBegin: this.utils.getDateUTC(userApp.contratUserApp.dateBegin),
      dateEnd: this.utils.getDateUTC(userApp.contratUserApp.dateEnd)
    };
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
