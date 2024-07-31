const MAX_GROUP_SIZE = 10;

export type Message = {
  id: string;
  room: string;
  userId: string;
  content: string;
  attachments: string[];
  createdAt: number;
};
export type MessageGroup = {
  id: string;
  room: string;
  userId: string;
  contents: {
    text: string;
    attachments: string[];
  }[];
  createdAt: number;
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
    } else {
      const lastGroup = result[0];
      if (message.userId === lastGroup.userId) {
        lastGroup.contents.unshift({
          text: message.content,
          attachments: message.attachments,
        });
      } else {
        result.unshift({
          id: message.id,
          room: message.room,
          userId: message.userId,
          contents: [
            { text: message.content, attachments: message.attachments },
          ],
          createdAt: message.createdAt,
        });
      }
    }
  }

  return result;
}
