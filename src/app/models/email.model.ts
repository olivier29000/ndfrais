export interface Email {
  title: string;
  content: string;
  echelle: number;
  imageBase64: string;
  contactPreference: ContactPreference;
  contact: string;
}

export enum ContactPreference {
  NO = 'NO',
  TELEPHONE = 'TELEPHONE',
  EMAIL = 'EMAIL'
}
