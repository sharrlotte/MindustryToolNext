export type Player = {
  name: string;
  uuid: string;
  userId?: string;
  locale?: string;
  team: {
    name: string;
    color: string;
  };
};
