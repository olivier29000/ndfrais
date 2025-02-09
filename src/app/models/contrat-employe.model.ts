import { UserApp } from './user.model';

export interface ContratUserApp {
  id?: number;
  poste: string;
  dateBegin: Date;
  dateEnd: Date;
  dayOfWeekReposList: DayOfWeek[];
  nbJourCongeMois: number;
  nbJourRttMois: number;
  nbHeureSemaine: number;
  userApp: UserApp;
  contratManager?: ContratUserApp;
  nbActions?: number;
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
