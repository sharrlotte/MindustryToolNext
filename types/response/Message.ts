import { isSameDay } from '@/lib/utils';

export type Message = {
  id: string;
  room: string;
  userId: string;
  content: string;
  attachments: string[];
  createdAt: string;
};
export type MessageGroup = {
  id: string;
  room: string;
  userId: string;
  contents: {
    text: string;
    attachments: string[];
  }[];
  createdAt: string;
};

export function groupMessage(messages: Message[]): MessageGroup[] {
  const result: MessageGroup[] = [];

  for (const message of messages) {
    if (result.length === 0) {
      result.push({
        id: message.id,
        room: message.room,
        userId: message.userId,
        contents: [{ text: message.content, attachments: message.attachments }],
        createdAt: message.createdAt,
      });
      continue;
    }

    const lastGroup = result[0];

    const messageCreatedAt = new Date(message.createdAt);
    const groupCreatedAt = new Date(lastGroup.createdAt);
    if (
      message.userId === lastGroup.userId &&
      messageCreatedAt.getMinutes() === groupCreatedAt.getMinutes() &&
      messageCreatedAt.getHours() === groupCreatedAt.getHours() &&
      isSameDay(messageCreatedAt, groupCreatedAt)
    ) {
      lastGroup.contents.unshift({
        text: message.content,
        attachments: message.attachments,
      });
    } else {
      result.unshift({
        id: message.id,
        room: message.room,
        userId: message.userId,
        contents: [{ text: message.content, attachments: message.attachments }],
        createdAt: message.createdAt,
      });
    }
  }

  return result;
}
