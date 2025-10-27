# DailyDictation.com Enhancement

Công cụ cải tiến cho trang web DailyDictation.com, bổ sung các chức năng điều khiển tốc độ phát âm thanh và ghi nhớ trạng thái giao diện.

## Tính năng

- **Điều khiển tốc độ phát**: Giảm, tăng và đặt lại tốc độ phát audio bằng phím tắt (hỗ trợ 0.25x, 0.5x, 0.6x, 1.0x)
- **Ghi nhớ trạng thái**: Tự động lưu trạng thái mở/đóng của các accordion-button

## Phiên bản

Dự án cung cấp 2 phiên bản:
- **Userscript** cho Tampermonkey (đã hoàn thành - v3.3)
- **Extension** cho Chrome và Firefox (đang phát triển - build bằng WXT)

## Cài đặt

### Userscript (Tampermonkey)

1. Cài đặt extension Tampermonkey cho trình duyệt của bạn
2. Import script `script.js` vào Tampermonkey (link chia sẻ sẽ được cập nhật sau)
3. Bật script và truy cập https://dailydictation.com

### Extension (Chrome/Firefox)

Sẽ được phát hành trên Chrome Web Store và Mozilla Add-ons (đang phát triển)

## Sử dụng

Sau khi cài đặt, các tính năng sẽ tự động hoạt động khi bạn truy cập DailyDictation.com.

### Phím tắt

- `[` - Giảm tốc độ phát
- `]` - Tăng tốc độ phát
- `\` - Đặt lại về tốc độ 1.0x

## Công nghệ

- JavaScript (ES6+)
- Tampermonkey UserScript API
- WXT Framework (cho phiên bản extension)

## Giấy phép

MIT License

## Liên kết

- Website gốc: https://dailydictation.com
- Repository: https://github.com/duccuong2808/dailydictation.com-enhance
