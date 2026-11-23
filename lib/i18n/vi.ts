/**
 * Tên Hán Việt cho giao diện tiếng Việt.
 *
 * Thuật toán lập lá số (algorithm.ts, iztro) vẫn dùng chữ Hán làm định danh nội bộ —
 * KHÔNG đổi dữ liệu gốc. Chỉ gọi các hàm ở đây ở tầng hiển thị.
 * Nguồn: locale vi-VN của iztro, đã sửa vài chỗ dịch máy (陷 → Hãm, 童限 → Đồng Hạn…).
 */

export const STEMS_VI = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const BRANCHES_VI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

const STEM_MAP: Record<string, string> = Object.fromEntries('甲乙丙丁戊己庚辛壬癸'.split('').map((c, i) => [c, STEMS_VI[i]]));
const BRANCH_MAP: Record<string, string> = Object.fromEntries('子丑寅卯辰巳午未申酉戌亥'.split('').map((c, i) => [c, BRANCHES_VI[i]]));

/** Tên thuật ngữ nhiều chữ. Khóa là chữ Hán giản thể như trong dữ liệu. */
export const TERMS_VI: Record<string, string> = {
  // ── 14 chính tinh ──
  紫微: 'Tử Vi', 天机: 'Thiên Cơ', 太阳: 'Thái Dương', 武曲: 'Vũ Khúc', 天同: 'Thiên Đồng', 廉贞: 'Liêm Trinh',
  天府: 'Thiên Phủ', 太阴: 'Thái Âm', 贪狼: 'Tham Lang', 巨门: 'Cự Môn', 天相: 'Thiên Tướng', 天梁: 'Thiên Lương',
  七杀: 'Thất Sát', 破军: 'Phá Quân',
  // ── phụ tinh, sát tinh, tạp diệu ──
  左辅: 'Tả Phù', 右弼: 'Hữu Bật', 文昌: 'Văn Xương', 文曲: 'Văn Khúc', 禄存: 'Lộc Tồn', 天马: 'Thiên Mã',
  擎羊: 'Kình Dương', 陀罗: 'Đà La', 火星: 'Hỏa Tinh', 铃星: 'Linh Tinh', 天魁: 'Thiên Khôi', 天钺: 'Thiên Việt',
  地空: 'Địa Không', 地劫: 'Địa Kiếp', 天空: 'Thiên Không', 天刑: 'Thiên Hình', 天姚: 'Thiên Diêu', 解神: 'Giải Thần',
  阴煞: 'Âm Sát', 天喜: 'Thiên Hỷ', 天官: 'Thiên Quan', 天福: 'Thiên Phúc', 天哭: 'Thiên Khốc', 天虚: 'Thiên Hư',
  龙池: 'Long Trì', 凤阁: 'Phượng Các', 红鸾: 'Hồng Loan', 孤辰: 'Cô Thần', 寡宿: 'Quả Tú', 蜚廉: 'Phi Liêm',
  破碎: 'Phá Toái', 台辅: 'Thai Phụ', 封诰: 'Phong Cáo', 天巫: 'Thiên Vu', 天月: 'Thiên Nguyệt', 三台: 'Tam Thai',
  八座: 'Bát Tọa', 恩光: 'Ân Quang', 天贵: 'Thiên Quý', 天才: 'Thiên Tài', 天寿: 'Thiên Thọ', 截空: 'Triệt Không',
  截路: 'Triệt Lộ', 副截: 'Phó Triệt', 旬空: 'Tuần Không', 旬中: 'Tuần Trung', 副旬: 'Phó Tuần', 空亡: 'Không Vong',
  月德: 'Nguyệt Đức', 天伤: 'Thiên Thương', 天使: 'Thiên Sứ', 天厨: 'Thiên Trù', 天德: 'Thiên Đức', 年解: 'Niên Giải',
  天煞: 'Thiên Sát', 劫杀: 'Kiếp Sát', 劫煞: 'Kiếp Sát',
  // ── vòng Trường Sinh ──
  长生: 'Trường Sinh', 沐浴: 'Mộc Dục', 冠带: 'Quan Đới', 临官: 'Lâm Quan', 帝旺: 'Đế Vượng',
  // ── vòng Bác Sĩ / Tướng Tinh / Thái Tuế (12 thần) ──
  博士: 'Bác Sĩ', 力士: 'Lực Sĩ', 青龙: 'Thanh Long', 小耗: 'Tiểu Hao', 将军: 'Tướng Quân', 奏书: 'Tấu Thư',
  飞廉: 'Phi Liêm', 喜神: 'Hỷ Thần', 病符: 'Bệnh Phù', 大耗: 'Đại Hao', 伏兵: 'Phục Binh', 官府: 'Quan Phủ',
  将星: 'Tướng Tinh', 攀鞍: 'Phan An', 岁驿: 'Tuế Dịch', 息神: 'Tức Thần', 华盖: 'Hoa Cái', 灾煞: 'Tai Sát',
  指背: 'Chỉ Bối', 咸池: 'Hàm Trì', 月煞: 'Nguyệt Sát', 亡神: 'Vong Thần',
  岁建: 'Tuế Kiến', 晦气: 'Hối Khí', 丧门: 'Tang Môn', 贯索: 'Quán Sách', 官符: 'Quan Phù', 岁破: 'Tuế Phá',
  龙德: 'Long Đức', 白虎: 'Bạch Hổ', 吊客: 'Điếu Khách',
  // ── 12 cung ──
  命宫: 'Mệnh', 身宫: 'Thân', 兄弟宫: 'Huynh Đệ', 夫妻宫: 'Phu Thê', 子女宫: 'Tử Tức', 财帛宫: 'Tài Bạch',
  疾厄宫: 'Tật Ách', 迁移宫: 'Thiên Di', 交友宫: 'Nô Bộc', 仆役宫: 'Nô Bộc', 奴仆宫: 'Nô Bộc', 官禄宫: 'Quan Lộc',
  田宅宫: 'Điền Trạch', 福德宫: 'Phúc Đức', 父母宫: 'Phụ Mẫu',
  兄弟: 'Huynh Đệ', 夫妻: 'Phu Thê', 子女: 'Tử Tức', 财帛: 'Tài Bạch', 疾厄: 'Tật Ách', 迁移: 'Thiên Di',
  交友: 'Nô Bộc', 仆役: 'Nô Bộc', 官禄: 'Quan Lộc', 田宅: 'Điền Trạch', 福德: 'Phúc Đức', 父母: 'Phụ Mẫu',
  // ── Tứ Hóa, hạn ──
  化禄: 'Hóa Lộc', 化权: 'Hóa Quyền', 化科: 'Hóa Khoa', 化忌: 'Hóa Kỵ', 四化: 'Tứ Hóa', 自化: 'Tự Hóa',
  大限: 'Đại Hạn', 小限: 'Tiểu Hạn', 流年: 'Lưu Niên', 流月: 'Lưu Nguyệt', 流日: 'Lưu Nhật', 流时: 'Lưu Thời',
  童限: 'Đồng Hạn', 三方四正: 'Tam Phương Tứ Chính', 空宫: 'Cung vô chính diệu',
  // ── ngũ hành cục ──
  水二局: 'Thủy Nhị Cục', 木三局: 'Mộc Tam Cục', 金四局: 'Kim Tứ Cục', 土五局: 'Thổ Ngũ Cục', 火六局: 'Hỏa Lục Cục',
  五行局: 'Ngũ Hành Cục',
  // ── giờ ──
  早子时: 'Tý sớm', 晚子时: 'Tý muộn',
  // ── âm dương nam nữ ──
  阳男: 'Dương Nam', 阴男: 'Âm Nam', 阳女: 'Dương Nữ', 阴女: 'Âm Nữ',
};

/** Một chữ đơn: miếu hãm, Tứ Hóa, ngũ hành, giới tính. Chỉ dùng khi chuỗi đúng bằng chữ đó. */
export const SINGLE_VI: Record<string, string> = {
  庙: 'Miếu', 旺: 'Vượng', 得: 'Đắc', 利: 'Lợi', 平: 'Bình', 不: 'Bất', 闲: 'Nhàn', 陷: 'Hãm', 地: 'Địa',
  禄: 'Lộc', 权: 'Quyền', 科: 'Khoa', 忌: 'Kỵ',
  金: 'Kim', 木: 'Mộc', 水: 'Thủy', 火: 'Hỏa', 土: 'Thổ',
  男: 'Nam', 女: 'Nữ', 阳: 'Dương', 阴: 'Âm',
  衰: 'Suy', 病: 'Bệnh', 死: 'Tử', 墓: 'Mộ', 绝: 'Tuyệt', 胎: 'Thai', 养: 'Dưỡng',
  ...STEM_MAP, ...BRANCH_MAP,
};

/** Tiếng Việt cho 4 loại Tứ Hóa (khóa 禄/权/科/忌 như kiểu SiHua). */
export const SIHUA_VI: Record<string, string> = { 禄: 'Lộc', 权: 'Quyền', 科: 'Khoa', 忌: 'Kỵ' };

const MULTI_KEYS = Object.keys(TERMS_VI).sort((a, b) => b.length - a.length);
const MULTI_RE = new RegExp(MULTI_KEYS.join('|'), 'g');
const GANZHI_RE = /([甲乙丙丁戊己庚辛壬癸])([子丑寅卯辰巳午未申酉戌亥])/g;

/**
 * Tên một sao / cung / can chi → Hán Việt. Không nhận ra thì trả nguyên văn.
 * Ví dụ: '紫微' → 'Tử Vi', '命宫' → 'Mệnh', '甲子' → 'Giáp Tý', '子' → 'Tý', '庙' → 'Miếu'.
 */
export function viName(s: string | undefined | null): string {
  if (!s) return '';
  if (TERMS_VI[s]) return TERMS_VI[s];
  if (SINGLE_VI[s]) return SINGLE_VI[s];
  // 'X时' (giờ địa chi)
  if (s.length === 2 && s[1] === '时' && BRANCH_MAP[s[0]]) return `giờ ${BRANCH_MAP[s[0]]}`;
  // can chi ghép (甲子, 甲子年…) hoặc chuỗi chỉ gồm can/chi
  if (/^[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]+$/.test(s)) {
    return s.split('').map(c => STEM_MAP[c] ?? BRANCH_MAP[c]).join(' ');
  }
  return viText(s);
}

/**
 * Thay mọi thuật ngữ nhiều chữ đã biết + cặp can chi trong một chuỗi bằng Hán Việt.
 * Dùng cho chuỗi ghép động (vd '紫微化禄' → 'Tử Vi Hóa Lộc').
 */
export function viText(s: string): string {
  return s
    .replace(MULTI_RE, (m) => ` ${TERMS_VI[m]} `)
    .replace(GANZHI_RE, (_, a, b) => ` ${STEM_MAP[a]} ${BRANCH_MAP[b]} `)
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?)，。、；：）])/g, '$1')
    .replace(/([(（])\s+/g, '$1')
    .trim();
}

/** Tên cung đầy đủ để hiển thị: '财帛宫' → 'Cung Tài Bạch', '命宫' → 'Cung Mệnh'. */
export function viPalace(name: string | undefined | null): string {
  if (!name) return '';
  return `Cung ${viName(name)}`;
}

/** Địa chi theo chỉ số 0–11. */
export const branchVi = (i: number) => BRANCHES_VI[((i % 12) + 12) % 12];
/** Thiên can theo chỉ số 0–9. */
export const stemVi = (i: number) => STEMS_VI[((i % 10) + 10) % 10];
