import { UserApp } from './user.model';

export class ContratUserApp {
  id: number;
  poste: string;
  dateBegin: Date;
  dateEnd: Date;
  jourSemaineReposList: JourSemaine[];
  nbJourCongeMois: number;
  nbJourRttMois: number;
  nbHeureSemaine: number;
  userApp: UserApp;
  contratManager?: ContratUserApp;

  constructor(contratEmploye: any) {
    this.id = contratEmploye.id;
    this.poste = contratEmploye.poste;
    this.dateBegin = contratEmploye.dateBegin;
    this.dateEnd = contratEmploye.dateEnd;
    this.jourSemaineReposList = contratEmploye.jourSemaineReposList;
    this.nbJourCongeMois = contratEmploye.nbJourCongeMois;
    this.nbJourRttMois = contratEmploye.nbJourRttMois;
    this.nbHeureSemaine = contratEmploye.nbHeureSemaine;
    this.userApp = contratEmploye.userApp;
    this.contratManager = contratEmploye.contratManager;
  }
}

export enum JourSemaine {
  DIMANCHE,
  LUNDI,
  MARDI,
  MERCREDI,
  JEUDI,
  VENDREDI,
  SAMEDI
}
