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
  authorities: Authority[];
};

export type Authority = {
  id: string;
  name: string;
  authorityGroup: string;
  description: string;
};
