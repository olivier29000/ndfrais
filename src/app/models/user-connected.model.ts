export interface UserConnected {
  entreprise: string;
  email: string;
  roleList: Role[];
  abonnement: Abonnement;
}

export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_MANAGER = 'ROLE_MANAGER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export enum Abonnement {
  EMPLOYE = 'EMPLOYE',
  ESSENTIEL = 'ESSENTIEL',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM'
}
