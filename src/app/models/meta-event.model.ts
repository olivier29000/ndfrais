import { ContratUserApp } from './contrat-employe.model';
import { Tag } from './tag.model';

export interface EventMeta {
  title?: string;
  description?: string;
  contratUserApp?: ContratUserApp;
  tagList?: Tag[];
}
