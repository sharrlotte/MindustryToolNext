export type Role = {
  id: number;
  name: string;
  position: number;
  color: string;
};

export type RoleWithAuthorities = {
  id: number;
  name: string;
  position: number;
  color: string;
  authorities: string[];
};
