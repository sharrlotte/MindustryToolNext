const MAX_GROUP_SIZE = 10;

export interface Message {
  id: string;
  room: string;
  userId: string;
  content: string;
  attachments: string[];
  createdAt: number;
}
export interface MessageGroup {
  id: string;
  room: string;
  userId: string;
  contents: {
    text: string;
    attachments: string[];
  }[];
  createdAt: number;
}

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
      const lastGroup = result[result.length - 1];
      if (
        new Date(message.createdAt).getTime() -
          new Date(lastGroup.createdAt).getTime() <=
          300000 &&
        message.userId === lastGroup.userId &&
        lastGroup.contents.length < MAX_GROUP_SIZE
      ) {
        lastGroup.contents.push({
          text: message.content,
          attachments: message.attachments,
        });
      } else {
        result.push({
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
