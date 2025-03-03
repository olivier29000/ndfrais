import { ContratUserApp } from './contrat-employe.model';
import { UserApp } from './user.model';

export interface EventMeta {
  title?: string;
  description?: string;
  contratUserApp?: ContratUserApp;
}
