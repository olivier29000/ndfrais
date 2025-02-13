import { Action, ActionDay } from './action.model';
import { UserApp } from './user.model';

export interface DayApp {
  id: number;
  date: Date;
  weekState: WEEK_STATE;
  workState: WORK_STATE;
  idContrat?: number;
  actionDay?: ActionDay;
}

export interface WorkStateAction {
  id: number;
  date: Date;
  user: UserApp;
  workState: WORK_STATE;
}

export enum WORK_STATE {
  HORS_CONTRAT = 'HORS_CONTRAT',
  TRAVAIL = 'TRAVAIL',
  TELETRAVAIL = 'TELETRAVAIL',
  CONGE = 'CONGE',
  RTT = 'RTT',
  RECUP = 'RECUP',
  ARRET_MALADIE = 'ARRET_MALADIE',
  CONGE_SANS_SOLDE = 'CONGE_SANS_SOLDE',
  ABSCENCE = 'ABSCENCE',
  REPOS = 'REPOS'
}

export interface workStateItem {
  label: WORK_STATE;
  icon: string;
  nb: string;
}

export enum ACTION_STATE {
  VALID = 'VALID',
  ASKING = 'ASKING',
  REFUSED = 'REFUSED'
}

export enum WEEK_STATE {
  NORMAL = 'NORMAL',
  WEEK_END = 'WEEK_END',
  FERIE = 'FERIE'
}
