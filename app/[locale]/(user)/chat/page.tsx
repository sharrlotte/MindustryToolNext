import React from 'react';

import { Input } from '@/components/ui/input';

export default function Page() {
  return (
    <div className="grid grid-rows-[1fr,auto] h-full p-4">
      <div className="p-2 h-full">
        MindustryGPT:
        <br />
        <div className="p-4">
          Bộ xử lý (processor) trong Mindustry đóng vai trò là thành phần trung
          tâm cho phép người chơi sử dụng ngôn ngữ lập trình Industry Logic
          (mLog) để tự động hóa và quản lý các hoạt động trong trò chơi. Các bộ
          xử lý có thể thực hiện nhiều nhiệm vụ khác nhau dựa trên mã lệnh mà
          người chơi viết. Dưới đây là một số chức năng chính của bộ xử lý trong
          Mindustry: Thu thập thông tin: Lấy thông tin về các khối (blocks) và
          đơn vị (units), bao gồm cả người chơi, để sử dụng trong các chiến lược
          và tự động hóa. Điều khiển các tòa nhà và tháp pháo: Điều khiển hoạt
          động của các tòa nhà và tháp pháo để tối ưu hóa phòng thủ và sản xuất.
          Đọc và ghi thông tin: Ghi và đọc dữ liệu vào và từ các đơn vị, cho
          phép truyền thông tin giữa các phần khác nhau của hệ thống. Hiển thị
          hình dạng và màu sắc: Tạo ra các hình dạng và màu sắc trên các màn
          hình hiển thị để cung cấp thông tin trực quan cho người chơi. Xuất văn
          bản: Xuất văn bản thông qua các khối tin nhắn để thông báo hoặc chỉ
          thị cho người chơi. Quản lý bộ nhớ: Đọc và ghi dữ liệu vào các ô nhớ
          (memory cells) để lưu trữ và truy xuất thông tin khi cần thiết. Nhận
          đầu vào từ người chơi: Nhận và xử lý đầu vào từ người chơi thông qua
          các khối chuyển đổi (switch blocks). Thực hiện các phép toán: Thực
          hiện các phép toán toán học, bao gồm cả phép toán đơn (unary) và phép
          toán nhị phân (binary), để xử lý dữ liệu và thực hiện các tính toán
          cần thiết. Nhờ vào các chức năng này, bộ xử lý trong Mindustry cho
          phép người chơi tạo ra các hệ thống tự động phức tạp và thực hiện các
          chiến lược nâng cao, tối ưu hóa việc quản lý tài nguyên và bảo vệ căn
          cứ.
        </div>
      </div>
      <Input />
    </div>
  );
}
