/**
 * Hồi quy âm lịch Việt Nam (calendar = 'vn').
 * Chạy: npx tsx scripts/regression/vn-calendar.test.ts
 */
import assert from 'node:assert/strict';
import { generateChart, resolveEffectiveVnLunarDate } from '../../lib/ziwei/algorithm';
import { solarToLunar } from '../../lib/ziwei/vn-lunar';
import type { BirthInfo } from '../../lib/ziwei/types';

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`✓ ${name}`);
};

const info = (year: number, month: number, day: number, hour = 6, gender: 'male' | 'female' = 'male'): BirthInfo =>
  ({ year, month, day, hour, gender }) as BirthInfo;

const layout = (c: ReturnType<typeof generateChart>) =>
  JSON.stringify({ palaces: c.palaces, ming: c.mingGongBranch, shen: c.shenGongBranch, ju: c.wuxingJu, zw: c.ziweiPos });

check('Mùng 1 Tết theo lịch VN', () => {
  for (const [y, m, d] of [[1985, 1, 21], [2007, 2, 17], [2026, 2, 17], [1994, 2, 10]] as const) {
    const l = solarToLunar(d, m, y);
    assert.deepEqual([l.year, l.month, l.day, l.isLeap], [y, 1, 1, false], `${d}/${m}/${y}`);
  }
});

check('Trước 1968 dùng lịch UTC+8 (trùng TQ)', () => {
  assert.deepEqual(solarToLunar(15, 6, 1960), solarToLunar(15, 6, 1960, 8));
});

check('21/1/1985: lịch VN ra năm Ất Sửu tháng Giêng, lịch TQ vẫn Giáp Tý tháng Chạp', () => {
  const vn = generateChart(info(1985, 1, 21), { calendar: 'vn' });
  const cn = generateChart(info(1985, 1, 21), { calendar: 'cn' });
  assert.equal(vn.lunarInfo.lunarYear, 1985);
  assert.equal(vn.lunarInfo.lunarMonth, 1);
  assert.equal(vn.lunarInfo.lunarDay, 1);
  assert.equal(vn.lunarInfo.yearStem, 1); // 乙
  assert.equal(vn.lunarInfo.yearBranch, 1); // 丑
  assert.equal(cn.lunarInfo.lunarYear, 1984);
  assert.equal(cn.lunarInfo.lunarMonth, 12);
  assert.equal(cn.lunarInfo.yearStem, 0); // 甲
  assert.notEqual(layout(vn), layout(cn), 'lá số phải khác nhau');
  // Lá số VN phải trùng lá số TQ của ngày có cùng ngày âm (20/2/1985 là mùng 1 Tết Ất Sửu bên TQ)
  assert.equal(layout(vn), layout(generateChart(info(1985, 2, 20), { calendar: 'cn' })));
});

check('17/2/2007: VN mùng 1 Tết, TQ 30 tháng Chạp', () => {
  const vn = generateChart(info(2007, 2, 17), { calendar: 'vn' });
  assert.deepEqual([vn.lunarInfo.lunarYear, vn.lunarInfo.lunarMonth, vn.lunarInfo.lunarDay], [2007, 1, 1]);
  assert.equal(layout(vn), layout(generateChart(info(2007, 2, 18), { calendar: 'cn' })));
});

check('Ngày hai lịch trùng nhau → lá số giống hệt (30/9/1994, mọi giờ, cả nam nữ)', () => {
  for (let h = 0; h < 12; h++) {
    for (const g of ['male', 'female'] as const) {
      const vn = generateChart(info(1994, 9, 30, h, g), { calendar: 'vn' });
      const cn = generateChart(info(1994, 9, 30, h, g), { calendar: 'cn' });
      assert.equal(layout(vn), layout(cn), `giờ ${h} ${g}`);
      assert.deepEqual(vn.lunarInfo, cn.lunarInfo);
    }
  }
});

check('Tháng nhuận VN không nhuận bên TQ (1985 nhuận 2) → origin-month quy về tháng thường, có cờ', () => {
  const r = resolveEffectiveVnLunarDate(1985, 4, 10, 'origin-month');
  assert.equal(r.rawLunarMonth, -2);
  assert.equal(r.rawLunarDay, 21);
  assert.equal(r.isLeapMonth, false);
  assert.equal(r.lunarMonth, 2);
  assert.equal(r.leapUnsupported, true);
  const split = resolveEffectiveVnLunarDate(1985, 4, 10, 'split'); // nửa sau tháng nhuận 2 → tháng 3
  assert.equal(split.lunarMonth, 3);
  assert.equal(split.leapUnsupported, false);
  assert.doesNotThrow(() => generateChart(info(1985, 4, 10), { calendar: 'vn', leapMonth: 'origin-month' }));
});

check('Tháng nhuận có ở cả hai lịch (1995 nhuận 8) → origin-month giữ tháng nhuận', () => {
  const r = resolveEffectiveVnLunarDate(1995, 9, 26, 'origin-month');
  assert.equal(r.isLeapMonth, true);
  assert.equal(r.leapUnsupported, false);
  assert.doesNotThrow(() => generateChart(info(1995, 9, 26), { calendar: 'vn', leapMonth: 'origin-month' }));
});

check('Ngày 30 âm VN mà tháng TQ chỉ 29 ngày → kẹp về 29, có cờ', () => {
  const r = resolveEffectiveVnLunarDate(1985, 2, 19, 'split');
  assert.equal(r.rawLunarDay, 30);
  assert.equal(r.lunarDay, 29);
  assert.equal(r.dayClamped, true);
});

check('Giá trị calendar sai → RangeError', () => {
  assert.throws(() => generateChart(info(1994, 9, 30), { calendar: 'xx' as never }), RangeError);
});

check('Mặc định (không đặt NEXT_PUBLIC_ZIWEI_CALENDAR) vẫn là lịch TQ', () => {
  assert.equal(layout(generateChart(info(1985, 1, 21))), layout(generateChart(info(1985, 1, 21), { calendar: 'cn' })));
});

console.log(`✓ Âm lịch Việt Nam: ${passed} nhóm kiểm tra đều đạt`);
