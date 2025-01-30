import { WORK_STATE } from './day-app.model';
import { UserApp } from './user.model';

export interface DayBdd {
  date: Date;
  userEmploye: UserApp;
  userManager: UserApp;
  workState: WORK_STATE;
}
