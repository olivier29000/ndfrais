import { Injectable, signal, WritableSignal } from '@angular/core';
import { WEEK_STATE, DayApp, WORK_STATE } from '../models/day-app.model';
import { DayBdd } from '../models/day-bdd.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() {}

  getWeekState(
    date: Date,
    ferieList: Date[],
    weekendDays: number[]
  ): WEEK_STATE {
    if (ferieList.some((d) => d.getTime() === date.getTime())) {
      return WEEK_STATE.FERIE;
    }
    if (weekendDays.includes(date.getDay())) {
      return WEEK_STATE.WEEK_END;
    }
    return WEEK_STATE.NORMAL;
  }

  getWorkState(
    date: Date,
    ferieList: Date[],
    weekendDays: number[],
    dayListBdd: DayBdd[]
  ): WORK_STATE {
    if (ferieList.some((d) => d.getTime() === date.getTime())) {
      return WORK_STATE.REPOS;
    }
    if (weekendDays.includes(date.getDay())) {
      return WORK_STATE.REPOS;
    }
    return WORK_STATE.TRAVAIL;
  }
}
