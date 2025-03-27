import { WORK_STATE } from './day-app.model';
import { UserApp } from './user.model';

export interface ContratUserApp {
  id?: number;
  poste: string;
  color: string;
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
  compteJourConge: number;
  compteJourRtt: number;
  compteJourRecup: number;
  compteJourEnfantMalade: number;
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
