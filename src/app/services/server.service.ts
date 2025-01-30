import { computed, Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { eachDayOfInterval, format } from 'date-fns';
import { DAY_STATE, DayApp, WORK_STATE } from '../models/day-app.model';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  constructor(
    private store: StoreService,
    private utilsService: UtilsService
  ) {}
  userAppList = this.store.userAppList;
  weekendDays = this.store.weekendDays;
  currentYear = this.store.currentYear;
  ferieList = this.store.ferieList;
  dayListBdd = this.store.dayListBdd;
  dayAppMap = computed(() =>
    eachDayOfInterval({
      start: new Date(this.currentYear(), 0, 1),
      end: new Date(this.currentYear(), 11, 31)
    }).reduce(
      (acc, d) => {
        if (acc[format(d, 'yyyy-MM')]) {
          acc[format(d, 'yyyy-MM')].push({
            date: d,
            dayState: this.utilsService.getDayState(
              d,
              this.ferieList(),
              this.weekendDays()
            ),
            workState: this.utilsService.getWorkState(
              d,
              this.ferieList(),
              this.weekendDays(),
              this.dayListBdd()
            ),
            workStateHistory: []
          });
        } else {
          acc[format(d, 'yyyy-MM')] = [
            {
              date: d,
              dayState: this.utilsService.getDayState(
                d,
                this.ferieList(),
                this.weekendDays()
              ),
              workState: this.utilsService.getWorkState(
                d,
                this.ferieList(),
                this.weekendDays(),
                this.dayListBdd()
              ),
              workStateHistory: []
            }
          ];
        }
        return acc;
      },
      {} as { [month: string]: DayApp[] }
    )
  );
}
