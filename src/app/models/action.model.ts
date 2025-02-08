import { ACTION_STATE, DayApp, WORK_STATE } from './day-app.model';
import { UserApp } from './user.model';

export interface Action {
  id: number;
  date: Date;
  dayAppList: DayApp[];
  workState: WORK_STATE;
  state: ACTION_STATE;
  userAppAction: UserApp;
}

export interface ActionDay {
  idAction: number;
  workState: WORK_STATE;
}
