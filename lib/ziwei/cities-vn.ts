import type { ProvinceInfo } from './cities';

/**
 * 34 tỉnh, thành của Việt Nam theo địa giới từ 1/7/2025, giờ Việt Nam (UTC+7).
 * Tỉnh nào trải rộng theo chiều đông–tây thì kèm thêm vài thành phố/huyện cũ để
 * hiệu chỉnh giờ mặt trời thật chính xác hơn (1° kinh độ ≈ 4 phút).
 *
 * Lưu ý: miền Nam trước 1975 dùng UTC+8 trong nhiều giai đoạn; nếu sinh ở miền Nam
 * trước 1975 và giấy khai sinh ghi theo giờ đó, hãy trừ 1 giờ trước khi nhập.
 */
export const VN_UTC_OFFSET_MINUTES = 420;

const p = (name: string, cities: [string, number][]): ProvinceInfo => ({
  name,
  utcOffsetMinutes: VN_UTC_OFFSET_MINUTES,
  cities: cities.map(([n, longitude]) => ({ name: n, longitude })),
});

export const VN_PROVINCES: ProvinceInfo[] = [
  p('Hà Nội', [['Hà Nội', 105.85], ['Sơn Tây', 105.5], ['Hà Đông', 105.78]]),
  p('TP. Hồ Chí Minh', [['TP. Hồ Chí Minh', 106.7], ['Thủ Dầu Một (Bình Dương)', 106.65], ['Vũng Tàu', 107.08], ['Bà Rịa', 107.17]]),
  p('Hải Phòng', [['Hải Phòng', 106.68], ['Hải Dương', 106.33]]),
  p('Đà Nẵng', [['Đà Nẵng', 108.22], ['Tam Kỳ (Quảng Nam)', 108.48], ['Hội An', 108.33]]),
  p('Huế', [['Huế', 107.59]]),
  p('Cần Thơ', [['Cần Thơ', 105.78], ['Sóc Trăng', 105.97], ['Vị Thanh (Hậu Giang)', 105.47]]),
  p('An Giang', [['Long Xuyên', 105.44], ['Châu Đốc', 105.12], ['Rạch Giá (Kiên Giang)', 105.08], ['Phú Quốc', 103.96]]),
  p('Bắc Ninh', [['Bắc Ninh', 106.08], ['Bắc Giang', 106.19]]),
  p('Cà Mau', [['Cà Mau', 105.15], ['Bạc Liêu', 105.72]]),
  p('Cao Bằng', [['Cao Bằng', 106.26]]),
  p('Đắk Lắk', [['Buôn Ma Thuột', 108.05], ['Tuy Hòa (Phú Yên)', 109.32]]),
  p('Điện Biên', [['Điện Biên Phủ', 103.02]]),
  p('Đồng Nai', [['Biên Hòa', 106.82], ['Đồng Xoài (Bình Phước)', 106.9]]),
  p('Đồng Tháp', [['Cao Lãnh', 105.63], ['Mỹ Tho (Tiền Giang)', 106.35]]),
  p('Gia Lai', [['Pleiku', 108.0], ['Quy Nhơn (Bình Định)', 109.22]]),
  p('Hà Tĩnh', [['Hà Tĩnh', 105.9]]),
  p('Hưng Yên', [['Hưng Yên', 106.05], ['Thái Bình', 106.34]]),
  p('Khánh Hòa', [['Nha Trang', 109.19], ['Phan Rang (Ninh Thuận)', 108.99]]),
  p('Lai Châu', [['Lai Châu', 103.46]]),
  p('Lạng Sơn', [['Lạng Sơn', 106.76]]),
  p('Lào Cai', [['Lào Cai', 103.97], ['Yên Bái', 104.87]]),
  p('Lâm Đồng', [['Đà Lạt', 108.44], ['Gia Nghĩa (Đắk Nông)', 107.69], ['Phan Thiết (Bình Thuận)', 108.1]]),
  p('Nghệ An', [['Vinh', 105.69]]),
  p('Ninh Bình', [['Ninh Bình', 105.97], ['Nam Định', 106.17], ['Phủ Lý (Hà Nam)', 105.92]]),
  p('Phú Thọ', [['Việt Trì', 105.4], ['Vĩnh Yên (Vĩnh Phúc)', 105.6], ['Hòa Bình', 105.34]]),
  p('Quảng Ngãi', [['Quảng Ngãi', 108.8], ['Kon Tum', 108.0]]),
  p('Quảng Ninh', [['Hạ Long', 107.08], ['Móng Cái', 107.97]]),
  p('Quảng Trị', [['Đông Hà', 107.1], ['Đồng Hới (Quảng Bình)', 106.62]]),
  p('Sơn La', [['Sơn La', 103.91]]),
  p('Tây Ninh', [['Tây Ninh', 106.1], ['Tân An (Long An)', 106.41]]),
  p('Thái Nguyên', [['Thái Nguyên', 105.84], ['Bắc Kạn', 105.83]]),
  p('Thanh Hóa', [['Thanh Hóa', 105.78]]),
  p('Tuyên Quang', [['Tuyên Quang', 105.22], ['Hà Giang', 104.98]]),
  p('Vĩnh Long', [['Vĩnh Long', 105.97], ['Bến Tre', 106.38], ['Trà Vinh', 106.34]]),
];

/** Tên tiếng Việt để hiển thị cho tỉnh/thành Trung Quốc (giá trị lưu vẫn là tên chữ Hán). */
const CN_PROVINCE_VI: Record<string, string> = {
  北京市: 'Bắc Kinh', 天津市: 'Thiên Tân', 上海市: 'Thượng Hải', 重庆市: 'Trùng Khánh',
  河北省: 'Hà Bắc', 山西省: 'Sơn Tây (TQ)', 内蒙古自治区: 'Nội Mông', 辽宁省: 'Liêu Ninh',
  吉林省: 'Cát Lâm', 黑龙江省: 'Hắc Long Giang', 江苏省: 'Giang Tô', 浙江省: 'Chiết Giang',
  安徽省: 'An Huy', 福建省: 'Phúc Kiến', 江西省: 'Giang Tây', 山东省: 'Sơn Đông',
  河南省: 'Hà Nam (TQ)', 湖北省: 'Hồ Bắc', 湖南省: 'Hồ Nam', 广东省: 'Quảng Đông',
  广西壮族自治区: 'Quảng Tây', 海南省: 'Hải Nam', 四川省: 'Tứ Xuyên', 贵州省: 'Quý Châu',
  云南省: 'Vân Nam', 西藏自治区: 'Tây Tạng', 陕西省: 'Thiểm Tây', 甘肃省: 'Cam Túc',
  青海省: 'Thanh Hải', 宁夏回族自治区: 'Ninh Hạ', 新疆维吾尔自治区: 'Tân Cương',
  香港特别行政区: 'Hồng Kông', 澳门特别行政区: 'Ma Cao', 台湾省: 'Đài Loan',
};

export function provinceLabel(name: string): string {
  const vi = CN_PROVINCE_VI[name];
  return vi ? `${vi} · ${name}` : name;
}
