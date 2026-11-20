/** Tỉnh Việt Nam trong form phải hiểu giờ nhập là giờ Việt Nam (UTC+7), tỉnh Trung Quốc vẫn là giờ Bắc Kinh. */
import assert from 'node:assert/strict';
import type { BirthFormState } from '../../components/BirthForm';
import { formToBirthInfo, formToTrueSolarTime } from '../../lib/ziwei/share';
import { VN_PROVINCES } from '../../lib/ziwei/cities-vn';
import { ALL_PROVINCES, provinceUtcOffset } from '../../lib/ziwei/cities';

const form = (o: Partial<BirthFormState>): BirthFormState => ({
  name: '', year: '1990', month: '5', day: '15', clockHour: '10', clockMinute: '0',
  unknownTime: false, province: 'Hà Nội', city: 'Hà Nội', longitude: 105.85, gender: 'male', ...o,
});

assert.equal(VN_PROVINCES.length, 34, 'đủ 34 tỉnh, thành sau sáp nhập 2025');
assert.equal(new Set(ALL_PROVINCES.map(p => p.name)).size, ALL_PROVINCES.length, 'tên tỉnh không trùng');
assert.equal(provinceUtcOffset('Hà Nội'), 420);
assert.equal(provinceUtcOffset('北京市'), undefined, 'tỉnh TQ giữ mặc định giờ Bắc Kinh');

// Hà Nội 10:00 giờ VN: kinh độ +3.4 phút, phương trình thời gian ~+3.7 phút → ~10:07, giờ Tỵ.
const hn = formToTrueSolarTime(form({}));
assert.ok(Math.abs(hn.totalCorrectionMinutes - 7.1) < 0.5, `Hà Nội: ${hn.totalCorrectionMinutes}`);
assert.equal(hn.branch, 5);

// 12:50 giờ VN ở Hà Nội ~12:57 → vẫn giờ Ngọ; nếu hiểu nhầm là giờ Bắc Kinh sẽ lùi ~53 phút còn ~11:57 (vẫn Ngọ)
// nên dùng mốc 13:00: giờ VN → ~13:07 (Mùi), giờ Bắc Kinh → ~12:07 (Ngọ).
assert.equal(formToBirthInfo(form({ clockHour: '13', clockMinute: '0' })).hour, 7, '13:00 giờ VN ở Hà Nội là giờ Mùi');

// TP.HCM 23:30 giờ VN, kinh độ 106.7 → ~23:40 → Tý muộn, lá số tính sang ngày hôm sau.
const hcm = formToBirthInfo(form({ province: 'TP. Hồ Chí Minh', city: 'TP. Hồ Chí Minh', longitude: 106.7, clockHour: '23', clockMinute: '30' }));
assert.deepEqual([hcm.day, hcm.hour], [16, 0]);

// Tỉnh TQ: Bắc Kinh 10:00 giữ nguyên cách tính cũ (UTC+8).
const bj = formToTrueSolarTime(form({ province: '北京市', city: '北京', longitude: 116.4 }));
assert.ok(Math.abs(bj.totalCorrectionMinutes - (-14.4 + 3.7)) < 0.5, `Bắc Kinh: ${bj.totalCorrectionMinutes}`);

console.log('VN province timezone regression passed: 34 tỉnh UTC+7, tỉnh TQ giữ UTC+8');
