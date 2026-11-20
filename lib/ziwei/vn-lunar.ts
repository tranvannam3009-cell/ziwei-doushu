/**
 * Âm lịch Việt Nam (UTC+7) — thuật toán Hồ Ngọc Đức.
 * Dùng trong generateChart (algorithm.ts) khi calendar = 'vn'.
 *
 * Lưu ý lịch sử: miền Bắc dùng lịch UTC+7 từ năm 1968; trước đó lịch Việt Nam
 * về cơ bản trùng lịch Trung Quốc (UTC+8). Mặc định hàm dưới đây dùng UTC+8
 * cho ngày trước 1968-01-01 để khớp lịch thực tế được in thời đó.
 */

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

const PI = Math.PI;
const INT = Math.floor;

function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  return jd;
}

function newMoon(k: number): number {
  const T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 -= 0.4068 * Math.sin(Mpr * dr) - 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 -= 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 += 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 -= 0.0074 * Math.sin(dr * (M - Mpr)) - 0.0004 * Math.sin(dr * (2 * F + M));
  C1 -= 0.0004 * Math.sin(dr * (2 * F - M)) + 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 += 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  const dt = T < -11
    ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
    : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return Jd1 + C1 - dt;
}

function sunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525, T2 = T * T, dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L -= PI * 2 * Math.trunc(L / (PI * 2));
  if (L < 0) L += 2 * PI;
  return L;
}

const newMoonDay = (k: number, tz: number) => INT(newMoon(k) + 0.5 + tz / 24);
const sunLonIdx = (day: number, tz: number) => INT((sunLongitude(day - 0.5 - tz / 24) / PI) * 6);

function lunarMonth11(yy: number, tz: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = newMoonDay(k, tz);
  if (sunLonIdx(nm, tz) >= 9) nm = newMoonDay(k - 1, tz);
  return nm;
}

function leapMonthOffset(a11: number, tz: number): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let i = 1;
  let arc = sunLonIdx(newMoonDay(k + i, tz), tz);
  let last: number;
  do {
    last = arc;
    i++;
    arc = sunLonIdx(newMoonDay(k + i, tz), tz);
  } while (arc !== last && i < 14);
  return i - 1;
}

/** Dương lịch → âm lịch. tz mặc định: 7 từ 1968, 8 trước 1968. */
export function solarToLunar(dd: number, mm: number, yy: number, tz?: number): LunarDate {
  const zone = tz ?? (yy >= 1968 ? 7 : 8);
  const day = jdFromDate(dd, mm, yy);
  const k = INT((day - 2415021.076998695) / 29.530588853);
  let monthStart = newMoonDay(k + 1, zone);
  if (monthStart > day) monthStart = newMoonDay(k, zone);
  let a11 = lunarMonth11(yy, zone);
  let b11 = a11;
  let year: number;
  if (a11 >= monthStart) {
    year = yy;
    a11 = lunarMonth11(yy - 1, zone);
  } else {
    year = yy + 1;
    b11 = lunarMonth11(yy + 1, zone);
  }
  const lday = day - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let isLeap = false;
  let month = diff + 11;
  if (b11 - a11 > 365) {
    const lo = leapMonthOffset(a11, zone);
    if (diff >= lo) {
      month = diff + 10;
      if (diff === lo) isLeap = true;
    }
  }
  if (month > 12) month -= 12;
  if (month >= 11 && diff < 4) year -= 1;
  return { year, month, day: lday, isLeap };
}
