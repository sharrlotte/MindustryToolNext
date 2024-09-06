export type Player = {
  name: string;
  uuid: string;
  userId?: string;
  team: {
    name: string;
    color: string;
  };
};
