import Markdown from '@/components/common/markdown';
import React from 'react';

export default function page() {
  const rules = `
***Luật:***

_1. Không toxic, bắt nạt người khác._

_2. Không spam, làm phiền người khác._

_3. Không NSFW, nội dung phản cảm, bạo lực._

_4. Sử dụng các kênh, lệnh đúng cách._

_5. Không tương tác với người người phá luật, thay vào đó hãy báo cáo họ._

_6. Không nói về các vấn đề chính trị, tôn giáo, phân biệt chủng tộc, phân biệt giới tính._

_7. Không mention(đề cập) các vai trò một cách bừa bãi._

_8. Không quảng cáo, spam link nếu chưa có sự cho phép của admin_

_9. Không lạm dụng, bốc lột sức lao động của người khác_
***Các hành vi phá hoại, không tuân thủ luật tùy mức độ sẽ bị xử phạt.***
`;

  return (
    <main className="flex h-full w-full items-center justify-center">
      <Markdown>{rules}</Markdown>
    </main>
  );
}
