# Tử Vi Đẩu Số — bản Việt Nam

Fork của [Renhuai123/ziwei-doushu](https://github.com/Renhuai123/ziwei-doushu) (MIT), thêm hai phần:

1. **Lập lá số theo âm lịch Việt Nam (UTC+7).** Bản gốc (iztro, lunar-javascript) luôn dùng âm lịch Trung Quốc (UTC+8). Từ 1968 đến 2026 có 837/21.550 ngày (3,88%) mà ngày, tháng hoặc năm âm của hai lịch khác nhau, ví dụ 21/1/1985 là mùng 1 Tết Ất Sửu ở Việt Nam nhưng chỉ là mùng 1 tháng Chạp Giáp Tý ở Trung Quốc. Với những ngày này lá số khác hẳn.
2. **Hỏi đáp bằng AI** qua route `app/api/interpret/route.ts` (Claude), nối với khung chat `ChatPanel` có sẵn. Trả lời bằng tiếng Việt, đọc tên sao theo âm Hán Việt.

## Chạy thử

```bash
npm ci
cp .env.example .env.local   # điền ANTHROPIC_API_KEY
npm run dev                  # mở http://localhost:3000/chart
```

`NEXT_PUBLIC_ZIWEI_CALENDAR=vn` trong `.env.local` bật âm lịch Việt Nam cho cả app. Bỏ trống thì app chạy như bản gốc. Trong code có thể chọn từng lá số: `generateChart(info, { calendar: 'vn' })`.

## Thay đổi

| File | Nội dung |
|---|---|
| `lib/ziwei/vn-lunar.ts` | Đổi dương lịch sang âm lịch Việt Nam (thuật toán Hồ Ngọc Đức). Trước 1968 dùng UTC+8 như lịch thực tế thời đó |
| `lib/ziwei/algorithm.ts` | `generateChart` nhận `calendar: 'cn' \| 'vn'`; thêm `resolveEffectiveVnLunarDate`; `lunarInfo` (năm, tháng, ngày âm, can chi năm) lấy theo lịch Việt Nam |
| `app/api/interpret/route.ts` | Route hỏi đáp, trả SSE đúng định dạng `ChatPanel` đọc |
| `scripts/regression/vn-calendar.test.ts` | Test hồi quy, đã thêm vào `npm test` |

## Giới hạn đã biết

- **22 ngày (1968–2026)** là ngày 30 âm lịch Việt Nam nhưng tháng đó bên Trung Quốc chỉ có 29 ngày. iztro không dựng được ngày này nên lá số kẹp về ngày 29 và ghi cảnh báo ở console. Cần kiểm tra tay.
- **60 ngày thuộc tháng nhuận Việt Nam mà Trung Quốc không nhuận** (năm 1985 và 1987). Chế độ `origin-month` sẽ quy về tháng thường. Các chế độ `split` và `next-month` không bị ảnh hưởng.
- Tứ trụ theo tiết khí (`fourPillars`) vẫn tính theo giờ tiết khí UTC+8 của lunar-javascript.
- Giờ sinh: nhập giờ đồng hồ Việt Nam. Muốn tính giờ mặt trời thật chính xác thì dùng `generateTrueSolarChart` với `utcOffsetMinutes: 420` (UTC+7) cùng kinh độ nơi sinh. Người sinh ở miền Nam trước 13/6/1975 dùng `480` (UTC+8).
