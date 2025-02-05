import { ACTION_STATE, DayApp, WORK_STATE } from './day-app.model';
import { UserApp } from './user.model';

export interface DayAppAction {
  id: number;
  date: Date;
  dayApp: DayApp;
  workState: WORK_STATE;
  state: ACTION_STATE;
  userAppAction: UserApp;
}
