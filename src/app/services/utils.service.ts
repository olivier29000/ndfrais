import { Injectable, signal, WritableSignal } from '@angular/core';
import { DAY_STATE, DayApp, WORK_STATE } from '../models/day-app.model';
import { DayBdd } from '../models/day-bdd.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() {}

  getDayState(date: Date, ferieList: Date[], weekendDays: number[]): DAY_STATE {
    if (ferieList.some((d) => d.getTime() === date.getTime())) {
      return DAY_STATE.FERIE;
    }
    if (weekendDays.includes(date.getDay())) {
      return DAY_STATE.WEEK_END;
    }
    return DAY_STATE.NORMAL;
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
