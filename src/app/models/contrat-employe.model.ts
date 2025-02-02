import { UserApp } from './user.model';

export class ContratEmploye {
  id: number;
  poste: string;
  dateBegin: Date;
  dateEnd: string;
  dayWeekEndList: number[];
  nbJourCongeMois: number;
  nbJourRttMois: number;
  nbHeureSemaine: number;
  userApp: UserApp;
  manager?: ContratEmploye;

  constructor(contratEmploye: any) {
    this.id = contratEmploye.id;
    this.poste = contratEmploye.poste;
    this.dateBegin = contratEmploye.dateBegin;
    this.dateEnd = contratEmploye.dateEnd;
    this.dayWeekEndList = contratEmploye.dayWeekEndList;
    this.nbJourCongeMois = contratEmploye.nbJourCongeMois;
    this.nbJourRttMois = contratEmploye.nbJourRttMois;
    this.nbHeureSemaine = contratEmploye.nbHeureSemaine;
    this.userApp = contratEmploye.userApp;
    this.manager = contratEmploye.manager;
  }
}
