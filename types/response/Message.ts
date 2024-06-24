export interface Message {
  id: string;
  room: string;
  userId: string;
  content: string[];
  createdAt: number;
}
