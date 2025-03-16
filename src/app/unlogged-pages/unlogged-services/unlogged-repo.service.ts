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

const URL_BACKEND = environment.urlBackEnd + '/employe';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class UnloggedRepoService {
  constructor(
    private http: HttpClient,
    private utils: UtilsService
  ) {}

  getRecapContratBytokenContrat(
    dateStrList: string[],
    tokenContrat: string
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
        `${URL_BACKEND}/get-recap-contrat/${tokenContrat}`,
        dateStrList,
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getAllEventBytokenContratAndPeriod(
    start: Date,
    end: Date,
    tokenContrat: string
  ): Observable<CalendarEvent[]> {
    return this.http
      .get<
        CalendarEvent[]
      >(`${URL_BACKEND}/get-all-event-by-contrat-id-and-period/${tokenContrat}/${this.utils.getDateString(start) + '-00-00'}/${this.utils.getDateString(end) + '-23-59'}`, httpOptions)
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
