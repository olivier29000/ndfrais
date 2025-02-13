import { WORK_STATE } from './day-app.model';
import { UserApp } from './user.model';

export interface ContratUserApp {
  id?: number;
  poste: string;
  dateBegin: Date;
  dateEnd: Date;
  dayOfWeekReposList: DayOfWeek[];
  workStateAvailableList: WORK_STATE[];
  nbJourCongeMois: number;
  nbJourRttMois: number;
  nbHeureSemaine: number;
  userApp: UserApp;
  contratManager?: ContratUserApp;
  nbActions?: number;
  archived: boolean;
}

export enum DayOfWeek {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY
}
