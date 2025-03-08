import { ContratUserApp } from './contrat-employe.model';

export class UserApp {
  id: number;
  pseudo: string;
  imageBase64: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  notes: string;
  enabled: boolean;
  contratUserApp: ContratUserApp;

  constructor(userApp: any) {
    this.id = userApp.id;
    this.pseudo = userApp.pseudo;
    this.imageBase64 = userApp.imageBase64;
    this.nom = userApp.nom;
    this.prenom = userApp.prenom;
    this.telephone = userApp.telephone;
    this.email = userApp.email;
    this.notes = userApp.notes;
    this.enabled = userApp.enabled;
    this.contratUserApp = userApp.contratUserApp;
  }

  get nomPrenom() {
    let nomPrenom = '';

    if (this.prenom && this.nom) {
      nomPrenom = this.prenom + ' ' + this.nom;
    } else if (this.prenom) {
      nomPrenom = this.prenom;
    } else if (this.nom) {
      nomPrenom = this.nom;
    }

    return nomPrenom;
  }

  set nomPrenom(value) {}
}
