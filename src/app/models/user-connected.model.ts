export interface UserConnected {
  entreprise: string;
  email: string;
  roleList: Role[];
}

export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_MANAGER = 'ROLE_MANAGER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}
