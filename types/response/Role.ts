import { UserRole } from "@/constant/enum";


export type Role = {
  id: number;
  name: UserRole;
  position: number;
  description: string;
  color: string;
};

export type RoleWithAuthorities = {
  id: number;
  name: UserRole;
  position: number;
  color: string;
  description: string;
  authorities: Authority[];
};

export type Authority = {
  id: string;
  name: string;
  authorityGroup: string;
  description: string;
};
