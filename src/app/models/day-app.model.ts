import { UserApp } from './user.model';

export interface DayApp {
  date: Date;
  dayState: DAY_STATE;
  workState: WORK_STATE;
  workStateHistory: WorkStateAction[];
}

export interface WorkStateAction {
  date: Date;
  user: UserApp;
  workState: WORK_STATE;
}

export enum WORK_STATE {
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

export enum DAY_STATE {
  NORMAL = 'NORMAL',
  WEEK_END = 'WEEK_END',
  FERIE = 'FERIE'
}
