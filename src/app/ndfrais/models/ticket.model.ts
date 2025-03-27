import { Image } from './image.model';

export interface Ticket {
  id: number;
  titre: string;
  notes: string;
  dateTicket: Date;
  dateCreation: Date;
  montant: number;
  image?: Image;
}
