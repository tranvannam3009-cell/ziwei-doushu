'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import InkScene from '@/components/InkScene';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import AnnouncementModal from '@/components/AnnouncementModal';
import { viName } from '@/lib/i18n/vi';

// ─── 滚动入场 wrapper ────────────────────────────────────
function FadeIn({
  children, delay = 0, y = 28, className = '',
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WeakBoundary({ line }: { line: string }) {
  // 之前的版本有 1px 实线 + 12px 渐变阴影，主题切换时形成清晰横线很硬。
  // 改为更柔和的 24px 渐变 + 低 opacity，section 衔接更自然。
  return (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
      style={{ background: `linear-gradient(to bottom, ${line}, transparent)`, opacity: 0.45 }} />
  );
}

// ─── 主星数据 ────────────────────────────────────────────
const STARS = [
  { name: '紫微' }, { name: '天机' }, { name: '太阳' }, { name: '武曲' },
  { name: '天同' }, { name: '廉贞' }, { name: '天府' }, { name: '太阴' },
  { name: '贪狼' }, { name: '巨门' }, { name: '天相' }, { name: '天梁' },
  { name: '七杀' }, { name: '破军' },
];

// ─── 功能模块 ────────────────────────────────────────────
const FEATURES = [
  {
    tag: 'Hệ lập lá số',
    title: 'Tử Vi Đẩu Số\ntheo Nghê Hải Hạ',
    subtitle: 'Không giản lược, theo đúng truyền thừa của thầy Nghê Hải Hạ',
    points: [
      'Định Ngũ Hành Cục theo Nạp Âm, không dùng thuật toán giản lược trên mạng',
      'An cung Mệnh đếm nghịch giờ sinh, cung Thân đếm thuận, đúng quy tắc giảng dạy',
      '14 chính tinh và Tứ Hóa an theo phép gốc, đầy đủ và kiểm chứng được',
    ],
  },
  {
    tag: 'Trình bày lá số',
    title: 'Đủ 14 chính tinh\nvà Tứ Hóa',
    subtitle: 'Bố cục rõ ràng, nhìn là thấy trục chính và điểm quan trọng',
    points: [
      '14 chính tinh an đủ vào cung, quan hệ giữa các sao dễ đọc',
      'Phụ tinh và sát tinh hiển thị cùng lúc, không sót thông tin quan trọng',
      'Phân độ sáng Miếu, Vượng, Lợi, Hãm để nhận biết sao mạnh yếu',
      'Bấm vào chính tinh bất kỳ để xem lời giải của thầy Nghê Hải Hạ về sao đó',
    ],
  },
  {
    tag: 'AI luận giải',
    title: 'Luận sâu lá số\nkhông chỉ an sao',
    subtitle: 'Kho kiến thức hệ Nghê Hải Hạ × Claude AI',
    points: [
      'Phân tích mệnh cách: từ chính tinh cung Mệnh, kết hợp Tam Phương Tứ Chính, nhận định toàn diện về tính cách và cục diện cuộc đời',
      'Sáu chủ đề: hướng sự nghiệp, tình cảm hôn nhân, kiểu tài lộc, lưu ý sức khỏe, quan hệ gia đình, duyên con cái',
      'Theo dõi Đại Hạn, Lưu Niên: trọng điểm của 10 năm hiện tại, gợi ý cụ thể và lời khuyên cho năm nay',
      'Hỏi tự do: hỏi trực tiếp về lá số của bạn, như «Năm nay có nên đổi việc?» hay «Khi nào duyên cưới tốt nhất?»',
    ],
  },
  {
    tag: 'Nhận diện cách cục',
    title: 'Tự động phát hiện\ncách cục lá số',
    subtitle: 'Tìm ra định số của bạn từ các tổ hợp sao',
    points: [
      'Tự nhận diện 11 cách cục kinh điển: Tử Phủ đồng cung, Sát Phá Lang, Cơ Nguyệt Đồng Lương, Liêm Tướng, Vũ Khúc Thất Sát…',
      'Phát hiện chính xác các cách đặc biệt như Tả Hữu giáp Mệnh, Nhật Nguyệt giáp Mệnh, kèm lời giải chuẩn theo hệ Nghê Hải Hạ',
      'Tự đánh dấu trường hợp Tứ Hóa nhập cung Mệnh, Thiên Di, nhắc các vấn đề cuộc đời cần chú ý',
      'Cách cục xếp theo mức cát hung, nhìn là thấy thế mạnh và thử thách trong lá số',
    ],
  },
];

// ─── 4 大学习板块（hero 后时间轴）──────────────────────────
const SECTIONS = [
  {
    key: 'ziwei',
    name: 'Tử Vi',
    en: 'Zi Wei',
    desc: '14 chính tinh · 13 cung · AI luận giải',
    status: 'ready' as const,
    when: 'Tháng 5',
    icon: '◉',  // 实心圆+内点，紫微星视觉
    note: '',
  },
  {
    key: 'tianji',
    name: 'Thiên Kỷ',
    en: 'Tian Ji',
    desc: 'Tử Vi · Chu Dịch · Kỳ Môn Độn Giáp',
    status: 'soon' as const,
    when: 'Tháng 6',
    icon: '⊙',  // 圆+内点（古文"日"），与 ◉ 同字宽
    note: '',
  },
  {
    key: 'diji',
    name: 'Địa Kỷ',
    en: 'Di Ji',
    desc: 'Di nguyện dang dở của thầy Nghê · Hậu bối chú giải',
    status: 'soon' as const,
    when: 'Tháng 6',
    icon: '⊞',  // 方+井（地/田视觉），与 ⊙ 同字宽
    note: 'Nghiên cứu di cảo',
  },
  {
    key: 'renji',
    name: 'Nhân Kỷ',
    en: 'Ren Ji',
    desc: 'Nội Kinh · Thương Hàn · Kim Quỹ · Châm cứu',
    status: 'soon' as const,
    when: 'Tháng 7',
    icon: '⊕',  // 圆+十字（医道/阴阳调和），与 ⊙/⊞ 同字宽
    note: '',
  },
];

// ─── 倪海厦核心教义 ──────────────────────────────────────
const NI_TEACHINGS = [
  {
    title: 'Lấy cung Mệnh làm gốc, Tam Phương làm dụng',
    body: 'Thầy Nghê luôn nhấn mạnh: xem số phải xem cung Mệnh trước. Chính tinh cung Mệnh quyết định cách cục cơ bản và tính cách bẩm sinh; Tam Phương (Tài Bạch, Quan Lộc, Thiên Di) quyết định «đất dụng võ» của người đó. Bốn cung liên động mới là bức tranh đời người trọn vẹn.',
  },
  {
    title: 'Mượn sao cung đối, không thể bỏ qua',
    body: 'Chỗ độc đáo của thầy Nghê là coi trọng «cung đối». Cung nào vô chính diệu thì phải mượn sao cung đối để luận; đối diện cung Mệnh là cung Thiên Di, hai cung ảnh hưởng lẫn nhau. Đây là điểm mấu chốt người mới học hay bỏ qua.',
  },
  {
    title: 'Tứ Hóa mới là bàn tay của vận mệnh',
    body: 'Sao chỉ là nền tảng; Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ) mới là chìa khóa quyết định vận tốt xấu. Cùng một sao, có Hóa Lộc hay Hóa Kỵ thì quỹ đạo đời người có thể khác hẳn. Thầy Nghê nhắc mãi: không xem Tứ Hóa thì lá số mới giải được một nửa.',
  },
  {
    title: 'Đại Hạn mười năm, vận có nhịp',
    body: 'Thầy Nghê chia đời người thành 12 Đại Hạn, mỗi Đại Hạn 10 năm. Ở mỗi cung Đại Hạn, cơ duyên hoàn toàn khác nhau. Biết mình đang đi Đại Hạn nào, cung đó có sao gì, mới thật sự nắm được vận hiện tại.',
  },
];

// ─── 主题色彩 helper ─────────────────────────────────────
function useColors(theme: Theme) {
  void theme;
  return {
    bgBase: 'transparent',
    // nav 用与 bgBase 完全相同的不透明色，避免半透明叠加产生色差带
    navBg: 'rgba(243,238,229,0.86)',
    navBorder: 'rgba(60,48,32,0.10)',
    goldGrad:     'linear-gradient(160deg,#1F1C18 0%,#3a332a 55%,#1F1C18 100%)',
    goldSolid: '#8A6D3F',
    goldLine: 'rgba(160,129,79,0.45)',
    tagText: '#8A6D3F',
    // 亮色文字用冷灰系（A 方案核心）：暖底 + 冷字 → 视觉不审美疲劳
    textPrimary: '#1F1C18',
    textSecond: '#3E3830',
    textMuted: '#6B6358',
    textFaint: '#9A9184',
    // 冷色 accent（B 方案核心）：呼应暗色 quan 蓝；用于装饰性 glow / 链接 / 高亮
    accent: '#8A6D3F',
    accentSoft: 'rgba(160,129,79,0.10)',
    cardBg: '#FAF7F1',
    cardBorder: 'rgba(60,48,32,0.12)',
    cardShadow: '0 6px 24px rgba(60,48,32,0.08)',
    featureBg: 'rgba(250,247,241,0.8)',
    featureBord: 'rgba(60,48,32,0.10)',
    glowTint: 'transparent',
    // 亮色 glow 真用蓝/紫——给整体氛围加冷色点缀
    glowBlue: 'transparent',
    glowPurple: 'transparent',
    niBg: 'rgba(250,247,241,0.85)',
    niBorder: 'rgba(160,129,79,0.3)',
    niDivider: 'rgba(60,48,32,0.10)',
    niCardBg: '#FAF7F1',
    niCardBord: 'rgba(60,48,32,0.10)',
    niCardShadow: '0 2px 16px rgba(60,48,32,0.07)',
    starBg: 'rgba(250,247,241,0.7)',
    starBorder: 'rgba(60,48,32,0.16)',
    starText: '#5A534A',
    ctaBg: '#1F1C18',
    ctaText: '#F3EEE5',
    footerText: '#8C8478',
    scrollLine: 'rgba(60,48,32,0.3)',
    scrollText: '#8C8478',
    altSection: 'rgba(237,230,218,0.55)',
    quoteBg: '#FAF7F1',
  };
}

// ─── 四化简介数据 ─────────────────────────────────────────
const SIHUA_BRIEF: Record<string, { attr: string; brief: string }> = {
  '化禄': { attr: 'Cát hóa · Tăng ích', brief: 'Phúc tinh đến cung, chủ tài lộc và phúc khí tăng thêm. Việc thuộc cung đó thuận lợi, năng lực tăng, là hóa tinh được ưa nhất trong lá số.' },
  '化权': { attr: 'Cát hóa · Quyền uy', brief: 'Sao quyền lực đến cung, chủ khả năng kiểm soát và lãnh đạo. Cung đó mạnh mẽ, quyết đoán; ưa vào cung Quan Lộc và Mệnh, chủ thực quyền trong sự nghiệp.' },
  '化科': { attr: 'Cát hóa · Danh dự', brief: 'Sao khoa danh đến cung, chủ danh tiếng và duyên quý nhân. Cung đó chủ văn danh, vận thi cử, có quý nhân nâng đỡ; hợp học thuật, thi cử và nơi công chúng.' },
  '化忌': { attr: 'Hung hóa · Trở ngại', brief: 'Sao kiếp số đến cung, chủ chấp niệm và trở ngại. Cung đó cần đặc biệt chú ý, vấn đề cuộc đời của cung này sẽ là thử thách lớn.' },
};

// ─── 主星简介数据 ─────────────────────────────────────────
const STAR_BRIEF: Record<string, { attr: string; brief: string }> = {
  '紫微': { attr: 'Thổ · Đế tinh', brief: 'Sao vua tôn quý, thống lĩnh các sao. Người có Tử Vi thủ Mệnh mang khí chất cao ngạo, chủ quyền uy hiển đạt, bẩm sinh có tố chất lãnh đạo, hợp vị trí tự gánh vác một mảng.' },
  '天机': { attr: 'Mộc · Trí tuệ tinh', brief: 'Sao ích thọ, chủ mưu trí và biến động. Thông minh lanh lợi, giỏi trù tính, tâm tư tinh tế; hợp nghề hoạch định, tư vấn, kỹ thuật.' },
  '太阳': { attr: 'Hỏa · Chủ Quan Lộc', brief: 'Chủ tinh Quan Lộc, chủ danh tiếng và uy vọng. Hào phóng rộng lượng, coi trọng hình ảnh trước công chúng, lợi quan trường và công chức; mệnh nam mạnh hơn, nhập Miếu thì quang minh lỗi lạc.' },
  '武曲': { attr: 'Kim · Chủ Tài Bạch', brief: 'Chủ tinh Tài Bạch, chủ tài chính và quyết đoán. Ý chí vững, hành động quả cảm; hợp nghề tài chính, ngân hàng, quân đội, công an. Là sao cô khắc, lợi cưới muộn.' },
  '天同': { attr: 'Thủy · Phúc tinh', brief: 'Chủ tinh Phúc Đức, chủ hưởng thụ và nhân duyên. Tính ôn hòa, rất được lòng người, chú trọng chất lượng sống, tình cảm tinh tế, vận về già tốt.' },
  '廉贞': { attr: 'Hỏa · Tài nghệ tinh', brief: 'Thứ đào hoa tinh, chủ tài nghệ và tình dục. Tài hoa xuất chúng, giàu tình cảm; hợp nghệ thuật, chính trường; đa tài nhưng cần phòng thị phi đào hoa.' },
  '天府': { attr: 'Thổ · Tài khố tinh', brief: 'Chủ tinh Nam Đẩu, chủ kho tiền và tích lũy. Điềm đạm thận trọng, giỏi quản lý tiền, là lực ổn định của lá số; hợp quản lý tài chính và hành chính.' },
  '太阴': { attr: 'Thủy · Chủ Điền Trạch', brief: 'Chủ tinh Điền Trạch, chủ của cải và sự mềm mại. Tinh tế dịu dàng, nhạy cảm; mệnh nữ càng tốt; lợi nhà đất và tích lũy, hợp văn nghệ hoặc dịch vụ.' },
  '贪狼': { attr: 'Mộc Thủy · Đào hoa', brief: 'Sao đào hoa, chủ dục vọng và tài nghệ. Đa tài đa nghệ, ham muốn mạnh, giao tiếp sôi nổi; hợp nghệ thuật, quan hệ công chúng, kinh doanh; rất được lòng người.' },
  '巨门': { attr: 'Thủy · Thị phi tinh', brief: 'Ám tinh, chủ khẩu tài và thị phi. Ăn nói giỏi, tư duy biện luận mạnh; hợp luật sư, giáo dục, truyền thông; cần giữ miệng tránh thị phi, lập thân bằng tài biện luận.' },
  '天相': { attr: 'Thủy · Ấn tinh', brief: 'Ấn tinh, chủ phò tá và ấn thụ. Giỏi điều phối, trọng lễ tiết, chính trực giữ phép; hợp tham mưu, hành chính, pháp luật; vận quý nhân tốt.' },
  '天梁': { attr: 'Thổ · Ấm tinh', brief: 'Ấm tinh, chủ già dặn và che chở. Chính trực vững vàng, giàu lòng từ bi, được trời phù hộ; hợp y tế, công tác xã hội, tôn giáo.' },
  '七杀': { attr: 'Kim Hỏa · Tướng tinh', brief: 'Tướng tinh, chủ cương liệt và khai sáng. Tính cương nghị, hành động mạnh, dám thử thách; hợp khởi nghiệp, quân đội, công an, ngành cạnh tranh; gặp hung hóa cát.' },
  '破军': { attr: 'Thủy · Hao tinh', brief: 'Hao tinh, chủ biến động và khai phá. Dám đột phá, không sợ thay đổi, đời nhiều biến động nhưng có khí phách; hợp việc tiên phong, đi con đường người khác chưa đi.' },
};

// ─── 功能视觉装饰 ────────────────────────────────────────
function FeatureVisual({ index, colors: c }: { index: number; colors: ReturnType<typeof useColors> }) {
  if (index === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="grid grid-cols-4 gap-1.5 w-72 mx-auto">
          {Array.from({ length: 16 }).map((_, i) => {
            const isCenter = [5, 6, 9, 10].includes(i);
            const isActive = [0, 3, 12, 15].includes(i);
            return (
              <motion.div key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="h-14 rounded-sm flex items-center justify-center text-xs transition-all duration-300"
                style={{
                  border: `1px solid ${isActive ? c.goldLine : c.cardBorder}`,
                  background: isCenter ? 'transparent' : isActive ? c.starBg : c.featureBg,
                  color: isActive ? c.goldSolid : c.textFaint,
                  opacity: isCenter ? 0 : 1,
                }}>
                {isActive ? '★' : ''}
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] tracking-wide transition-colors duration-300"
          style={{ color: c.textFaint }}>Phép lập lá số Nghê Hải Hạ</p>
      </div>
    );
  }

  if (index === 1) {
    const [sel, setSel] = useState<string | null>(null);
    const selInfo = sel ? (STAR_BRIEF[sel] ?? SIHUA_BRIEF[sel] ?? null) : null;
    return (
      <div className="flex flex-col gap-4 h-full justify-center">
        {[
          { group: 'Chòm Tử Vi', stars: ['紫微', '天机', '太阳', '武曲', '天同', '廉贞'] },
          { group: 'Chòm Thiên Phủ', stars: ['天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'] },
        ].map(group => (
          <div key={group.group}>
            <div className="text-[11px] tracking-wide mb-2 transition-colors duration-300"
              style={{ color: c.textFaint }}>{group.group}</div>
            <div className="flex flex-wrap gap-1.5">
              {group.stars.map(s => (
                <motion.button key={s}
                  onClick={() => setSel(sel === s ? null : s)}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="text-xs px-2 py-1 rounded-md cursor-pointer"
                  style={{
                    border: `1px solid ${sel === s ? c.goldSolid : c.goldLine}`,
                    color: c.goldSolid,
                    background: sel === s ? `${c.goldLine}30` : 'transparent',
                    fontWeight: sel === s ? 600 : 400,
                  }}>
                  {viName(s)}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div className="text-[11px] tracking-wide mb-2 transition-colors duration-300"
            style={{ color: c.textFaint }}>Tứ Hóa</div>
          <div className="flex gap-2 flex-wrap">
            {[['化禄', 'rgba(52,211,153,0.7)'], ['化权', 'rgba(96,165,250,0.7)'], ['化科', 'rgba(250,204,21,0.7)'], ['化忌', 'rgba(248,113,113,0.7)']].map(([label, color]) => (
              <motion.button key={label}
                onClick={() => setSel(sel === label ? null : label)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="text-xs px-2.5 py-1 rounded-md cursor-pointer"
                style={{
                  border: `1px solid ${color}`,
                  color,
                  background: sel === label ? `${color.replace('0.7', '0.15')}` : 'transparent',
                  fontWeight: sel === label ? 600 : 400,
                }}>
                {viName(label)}
              </motion.button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          {selInfo && (
            <motion.div key={sel}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-4 mt-1.5"
              style={{ border: `1px solid ${c.goldLine}`, background: c.featureBg }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold" style={{ color: c.goldSolid }}>{viName(sel)}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ color: c.tagText, border: `1px solid ${c.goldLine}` }}>{selInfo.attr}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>{selInfo.brief}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (index === 2) {
    const msgs = [
      { role: 'user', text: 'Sự nghiệp năm nay của tôi thế nào?' },
      { role: 'ai', text: 'Cung Mệnh có Thiên Cơ Hóa Lộc, Đại Hạn đi cung Quan Lộc, Tam Phương có Tả Phù trợ giúp, sự nghiệp có quý nhân nâng đỡ, nên chủ động mở rộng…' },
      { role: 'user', text: 'Khi nào tình duyên tốt nhất?' },
    ];
    return (
      <div className="flex flex-col gap-2 h-full justify-center">
        {msgs.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] text-[11px] px-3 py-2 rounded-lg leading-relaxed"
              style={{
                border: `1px solid ${m.role === 'user' ? c.goldLine : c.cardBorder}`,
                background: m.role === 'user' ? c.starBg : c.featureBg,
                color: m.role === 'user' ? c.goldSolid : c.textSecond,
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (index === 3) {
    const patterns = [
      { name: 'Cách Sát Phá Lang', desc: 'Số khai sáng, tiến thủ', ok: true },
      { name: 'Cách Liêm Tướng',   desc: 'Cách hành chính, ấn thụ', ok: true },
      { name: 'Hóa Kỵ nhập Mệnh', desc: 'Cần chú ý vấn đề tâm lý', ok: false },
    ];
    return (
      <div className="flex flex-col gap-3 h-full justify-center">
        {patterns.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
              border: `1px solid ${p.ok ? 'rgba(96,165,250,0.25)' : 'rgba(251,146,60,0.25)'}`,
              background: p.ok ? 'rgba(96,165,250,0.05)' : 'rgba(251,146,60,0.05)',
            }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: p.ok ? 'rgba(96,165,250,0.6)' : 'rgba(251,146,60,0.6)' }} />
            <div>
              <div className="text-[11px] font-medium"
                style={{ color: p.ok ? 'rgba(147,197,253,0.8)' : 'rgba(253,186,116,0.8)' }}>{p.name}</div>
              <div className="text-[10px]" style={{ color: c.textMuted }}>{p.desc}</div>
            </div>
          </motion.div>
        ))}
        <div className="text-[9px] mt-2 tracking-normal text-center" style={{ color: c.textFaint }}>
          Tự nhận diện 11 cách cục kinh điển
        </div>
      </div>
    );
  }

  return null;
}

// ─── Hero kiểu poster: biểu tượng nét mảnh, ấn triện, điện thoại minh họa ───
function IconYinYang() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="16" cy="16" r="13" />
      <path d="M16 3a6.5 6.5 0 0 1 0 13a6.5 6.5 0 0 0 0 13" />
      <circle cx="16" cy="9.5" r="1.8" fill="currentColor" />
      <circle cx="16" cy="22.5" r="1.8" />
    </svg>
  );
}
function IconClover() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      <path d="M16 16c-6-1-9-4-9-7a3.5 3.5 0 0 1 6-2.5A3.5 3.5 0 0 1 16 9a3.5 3.5 0 0 1 3-2.5a3.5 3.5 0 0 1 6 2.5c0 3-3 6-9 7Z" />
      <path d="M16 16c-6 1-9 4-9 7a3.5 3.5 0 0 0 6 2.5A3.5 3.5 0 0 0 16 23a3.5 3.5 0 0 0 3 2.5a3.5 3.5 0 0 0 6-2.5c0-3-3-6-9-7Z" />
    </svg>
  );
}
function IconCompass() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      <circle cx="16" cy="16" r="13" />
      <path d="M21.5 10.5l-3.6 7.4l-7.4 3.6l3.6-7.4z" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

const HERO_POINTS = [
  { Icon: IconYinYang, title: 'Sách mệnh', desc: 'Đọc cách cục bẩm sinh của bạn, thấy được nền màu của vận mệnh' },
  { Icon: IconClover, title: 'Trí tuệ chỉ dẫn', desc: 'Gợi mở và lời khuyên bạn cần nhất ở thời điểm này' },
  { Icon: IconCompass, title: 'Ung dung tiến bước', desc: 'Hiểu mình, chấp nhận mình, nắm lấy hướng đi của đời mình' },
];

function SealMark({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: size, height: size, background: '#1F1C18', color: '#F3EEE5', fontSize: size * 0.5, lineHeight: 1 }}>
      命
    </span>
  );
}

const MOCK_PALACES = ['命宫', '父母', '福德', '田宅', '兄弟', '官禄', '夫妻', '交友', '子女', '财帛', '疾厄', '迁移'];

function PhoneMock({ onOpen }: { onOpen: () => void }) {
  // Lưới 4×4 viền ngoài 12 cung, 4 ô giữa gộp làm ô trung tâm
  const ring: [number, number][] = [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[3,2],[3,1],[3,0],[2,0],[1,0]];
  return (
    <div className="relative w-[300px] rounded-[44px] p-[10px]"
      style={{ background: '#1d1b19', boxShadow: '0 40px 80px rgba(31,28,24,0.28), inset 0 0 0 2px #3a3733' }}>
      <div className="rounded-[36px] overflow-hidden" style={{ background: '#F6F2EA' }}>
        <div className="flex justify-center pt-3"><div className="w-24 h-6 rounded-full" style={{ background: '#1d1b19' }} /></div>
        <div className="px-6 pt-5">
          <div className="flex items-center gap-2">
            <SealMark size={22} />
            <span className="text-[11px] tracking-[0.14em]" style={{ color: '#1F1C18' }}>TỬ VI · sách mệnh</span>
          </div>
          <div className="mt-5 flex justify-center gap-8 text-[12px] tracking-[0.02em]">
            <span className="pb-1.5" style={{ color: '#1F1C18', borderBottom: '1.5px solid #1F1C18' }}>Lá số của tôi</span>
            <span style={{ color: '#8C8478' }}>Tử Vi là gì</span>
          </div>
          <div className="mt-5 grid grid-cols-4 grid-rows-4 gap-px" style={{ background: 'rgba(60,48,32,0.14)' }}>
            {Array.from({ length: 16 }).map((_, idx) => {
              const r = Math.floor(idx / 4), col = idx % 4;
              const k = ring.findIndex(([a, b]) => a === r && b === col);
              if (k < 0) {
                if (r === 1 && col === 1) {
                  return (
                    <div key={idx} className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-1" style={{ background: '#F6F2EA' }}>
                      <span className="text-[15px] tracking-[0.06em]" style={{ color: '#1F1C18' }}>Tử Vi</span>
                      <span className="text-[9px] tracking-[0.06em]" style={{ color: '#8C8478' }}>Mộc Tam Cục</span>
                    </div>
                  );
                }
                return null;
              }
              const isMing = k === 0;
              return (
                <div key={idx} className="aspect-square flex items-end justify-center pb-1.5" style={{ background: '#F6F2EA' }}>
                  <span className="text-[9px] tracking-wide" style={{ color: isMing ? '#B5482F' : '#5A534A' }}>{viName(MOCK_PALACES[k])}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-1.5">
            {[0.92, 0.78, 0.86].map((w, i) => (
              <div key={i} className="h-[3px] rounded-full" style={{ width: `${w * 100}%`, background: 'rgba(60,48,32,0.12)' }} />
            ))}
          </div>
          <button onClick={onOpen} className="mt-6 mb-6 w-full py-3 rounded-full text-[13px] tracking-[0.14em]"
            style={{ background: '#1F1C18', color: '#F3EEE5' }}>
            Xem
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 主页 ─────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);


  return (
    <div className="overflow-x-hidden">
      {/* 致用户公告——首次访问全屏覆盖，关闭后才进入首页 */}
      <AnnouncementModal />

      {/* ── Thanh điều hướng ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-10 py-3 gap-2"
        style={{ background: c.navBg, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: `1px solid ${c.navBorder}` }}>
        <a href="/" className="flex items-center gap-2.5 flex-shrink-0" style={{ textDecoration: 'none' }}>
          <SealMark size={30} />
          <span className="leading-tight">
            <span className="block text-[13px] sm:text-sm tracking-[0.14em] font-medium" style={{ color: c.textPrimary }}>TỬ VI</span>
            <span className="block text-[9px] tracking-[0.2em]" style={{ color: c.textMuted }}>sách mệnh</span>
          </span>
        </a>
        <div className="flex items-center gap-1 sm:gap-6 flex-shrink-0 text-[12px] sm:text-[13px] tracking-[0.02em]">
          <a href="/knowledge" className="hidden md:inline px-2 py-1" style={{ color: c.textSecond, textDecoration: 'none' }}>Kiến thức</a>
          <a href="/library" className="hidden md:inline px-2 py-1" style={{ color: c.textSecond, textDecoration: 'none' }}>Cổ thư</a>
          <a href="/heming" className="px-2 py-1" style={{ color: c.textSecond, textDecoration: 'none' }}>Hợp bàn</a>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push('/chart')}
            className="ml-1 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full"
            style={{ background: c.ctaBg, color: c.ctaText }}>
            Lập lá số
          </motion.button>
        </div>
      </nav>

      {/* ══ HERO kiểu poster thủy mặc ══════════════════════ */}
      <section ref={heroRef} className="relative z-10 lg:min-h-[100svh] pt-20 sm:pt-24 pb-12 sm:pb-16 px-5 sm:px-10 overflow-hidden">
        {/* Tranh nền bên phải */}
        <motion.div style={{ y: heroY }} className="absolute top-14 bottom-0 right-0 w-full lg:w-[56%] pointer-events-none">
          <InkScene className="w-full h-full opacity-60 lg:opacity-100" />
          <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(to bottom, rgba(243,238,229,0.55), rgba(243,238,229,0.92))' }} />
        </motion.div>

        <motion.div
          className="relative max-w-[1180px] mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center lg:min-h-[calc(100svh-10rem)]">
          {/* Cột chữ */}
          <div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="ink-title leading-[1.22]"
              style={{ fontSize: 'clamp(29px, 4.4vw, 62px)' }}>
              <span className="block sm:whitespace-nowrap">Khám phá vận mệnh</span>
              <span className="block sm:whitespace-nowrap">Thấu hiểu nhân sinh</span>
            </motion.h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <span className="ink-rule mt-8 mb-6" />
              <p className="text-lg sm:text-xl tracking-[0.03em]" style={{ color: c.textPrimary }}>
                Lá số Tử Vi <span style={{ color: c.textSecond }}>giúp bạn gỡ rối</span>
              </p>
              <p className="mt-2 text-[15px] tracking-[0.02em]" style={{ color: c.textMuted }}>
                Vận mệnh của bạn, do chính bạn viết nên
              </p>
            </motion.div>

            <div className="mt-10 space-y-6 max-w-md">
              {HERO_POINTS.map((pt, i) => (
                <motion.div key={pt.title}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.12, duration: 0.5 }}
                  className="flex items-start gap-5">
                  <span className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid }}>
                    <pt.Icon />
                  </span>
                  <span className="pt-1">
                    <span className="block text-[17px] tracking-[0.02em]" style={{ color: c.textPrimary }}>{pt.title}</span>
                    <span className="block mt-1.5 text-[14px] leading-[1.8] tracking-normal" style={{ color: c.textMuted }}>{pt.desc}</span>
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }} className="mt-12">
              <p className="text-xl tracking-[0.02em]" style={{ color: c.textSecond }}>Mọi băn khoăn,</p>
              <p className="mt-1 tracking-[0.02em]" style={{ fontSize: 'clamp(28px, 3vw, 38px)', color: c.textPrimary }}>
                rồi sẽ có <span style={{ color: c.goldSolid }}>lời giải</span>.
              </p>
              <span className="ink-rule mt-6 mb-6" />
              <div className="flex flex-wrap items-center gap-4">
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => router.push('/chart')}
                  className="px-10 py-3.5 rounded-full text-[15px] tracking-[0.06em]"
                  style={{ background: c.ctaBg, color: c.ctaText, boxShadow: '0 10px 28px rgba(31,28,24,0.18)' }}>
                  Lập lá số ngay
                </motion.button>
                <span className="text-[13px] tracking-[0.01em]" style={{ color: c.textMuted }}>
                  Nhập ngày giờ sinh · AI luận giải ngay
                </span>
              </div>
            </motion.div>
          </div>

          {/* Cột điện thoại minh họa */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex justify-center items-end self-end pb-4">
            <PhoneMock onOpen={() => router.push('/chart')} />
          </motion.div>
        </motion.div>

        {/* Châm ngôn cuối hero */}
        <div className="relative mt-10 text-center">
          <p className="ink-motto text-[14px] sm:text-lg !tracking-[0.05em] sm:!tracking-[0.25em]">Trí tuệ · Vận mệnh · Lựa chọn · Trưởng thành</p>
          <p className="mt-2 text-[9px] sm:text-[10px] tracking-[0.06em] sm:tracking-[0.22em]" style={{ color: c.textFaint }}>WISDOM · DESTINY · CHOICE · GROWTH</p>
        </div>
      </section>
      {/* ══ 哲学引言 ══════════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden min-h-[82svh] lg:min-h-[92vh] flex items-center" style={{ padding: '72px 24px' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="absolute inset-0"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, #020810 0%, #020810 6%, #030a18 22%, #0d0820 40%, #0a0618 68%, #030a18 86%, #020810 100%)'
              : 'linear-gradient(to bottom, transparent 0%, rgba(228,220,205,0.55) 30%, rgba(228,220,205,0.55) 70%, transparent 100%)',
            transition: 'background 0.4s ease',
          }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-bold" style={{ fontSize: 'clamp(220px, 38vw, 460px)', color: 'rgba(60,48,32,0.035)', lineHeight: 1, fontFamily: 'serif' }}>命</span>
        </div>
        <FadeIn className="relative mx-auto text-center w-full" y={20}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(160,129,79,0.6))' }} />
            <span className="text-[10px] tracking-[0.28em] uppercase" style={{ color: '#8A6D3F' }}>Mệnh · Vận · Quan</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(160,129,79,0.6))' }} />
          </div>
          <div className="space-y-3" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {[
              { text: 'Ý nghĩa của việc nhìn trước vận mệnh', size: 'clamp(17px, 2.2vw, 28px)', color: '#3E3830', delay: 0.1 },
              { text: 'không nằm ở chỗ biết trước tương lai', size: 'clamp(21px, 2.6vw, 32px)', color: '#3E3830', delay: 0.25 },
              { text: 'mà ở chỗ không ngừng hiểu chính mình', size: 'clamp(24px, 3vw, 40px)', color: '#3E3830', delay: 0.34 },
            ].map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: line.delay }}
                className="tracking-normal" style={{ fontSize: line.size, color: line.color, fontWeight: 400 }}>
                {line.text}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold`}
              style={{ fontSize: 'clamp(24px, 3.4vw, 48px)', letterSpacing: '0.01em', lineHeight: 1.35 }}>
              để cuối cùng tự viết kịch bản đời mình
            </motion.p>
          </div>
        </FadeIn>
      </section>

      {/* ══ 4 大学习板块时间轴 ════════════════════════════ */}
      <section className="relative z-10 py-20 lg:py-24 px-6"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.03) 50%, transparent 100%)'
            : 'linear-gradient(to bottom, transparent 0%, rgba(184,146,42,0.04) 50%, transparent 100%)',
        }}>
        <FadeIn className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: c.goldSolid, opacity: 0.7 }}>Curriculum</span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 tracking-normal sm:tracking-[0.04em] leading-snug" style={{ color: c.textPrimary }}>
            Phương pháp luận thầy Nghê · Lần lượt ra mắt
          </div>
          <div className="text-xs lg:text-sm tracking-[0.02em]" style={{ color: c.textMuted }}>
            Bắt đầu từ Tử Vi, dần mở các phần học Thiên Kỷ / Địa Kỷ / Nhân Kỷ
          </div>
        </FadeIn>

        <div className="max-w-sm lg:max-w-5xl mx-auto relative">
          {/* 横向连接线（仅桌面）*/}
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5"
            style={{
              background: `linear-gradient(90deg, ${c.goldSolid} 0%, ${c.goldSolid} 25%, ${c.goldLine} 25%)`,
              opacity: 0.6,
            }} />

          {/* 纵向连接线（仅手机）—— 圆点贴在线上，做"地铁线路图"风格 */}
          <div className="lg:hidden absolute left-7 top-7 bottom-7 w-px -translate-x-1/2"
            style={{
              background: `linear-gradient(180deg, ${c.goldSolid} 0%, ${c.goldSolid} 22%, ${c.goldLine} 22%)`,
              opacity: 0.6,
            }} />

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-4">
            {SECTIONS.map((s, i) => {
              const ready = s.status === 'ready';
              return (
                <motion.div key={s.key}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative flex flex-row lg:flex-col items-center lg:items-center text-left lg:text-center gap-4 lg:gap-0">
                  {/* 节点圆 */}
                  <div className="relative w-14 h-14 shrink-0 rounded-full flex items-center justify-center lg:mb-3"
                    style={{
                      background: ready
                        ? `linear-gradient(135deg, ${c.goldSolid} 0%, ${c.goldSolid}cc 100%)`
                        : (theme === 'dark' ? 'rgba(184,146,42,0.05)' : '#fdf8ee'),
                      border: ready ? 'none' : `2px dashed ${c.goldLine}`,
                      color: ready ? '#fff' : c.textMuted,
                      boxShadow: ready ? `0 4px 16px ${c.goldSolid}55` : 'none',
                    }}>
                    <span className="text-2xl">{s.icon}</span>
                    {ready && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white"
                        style={{ background: '#3F7A52', boxShadow: '0 2px 6px rgba(63,122,82,0.35)' }}>
                        ✓
                      </div>
                    )}
                  </div>
                  {/* 文字组：手机端右排单列；桌面端居中堆叠 */}
                  <div className="flex-1 lg:flex-none flex flex-col items-start lg:items-center min-w-0">
                    {/* 顶行：时间标签 + 板块名 + note（手机端 inline；桌面端依然分行） */}
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 lg:flex-col lg:flex-nowrap lg:gap-0 lg:mb-1">
                      <div className="text-[10px] tracking-[0.1em] lg:mb-1.5"
                        style={{ color: ready ? '#3F7A52' : c.textMuted, fontWeight: 500 }}>
                        {s.when}
                      </div>
                      <div className="text-base lg:text-xl font-semibold tracking-[0.01em] lg:tracking-[0.04em] whitespace-nowrap"
                        style={{ color: c.textPrimary }}>
                        {s.name}
                      </div>
                      {s.note && (
                        <div className="text-[9px] tracking-[0.04em] px-2 py-0.5 rounded-full lg:hidden"
                          style={{
                            color: c.goldSolid,
                            background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                            border: `1px solid ${c.goldLine}`,
                            opacity: 0.85,
                          }}>
                          {s.note}
                        </div>
                      )}
                    </div>
                    {/* 桌面专属 note（手机已在顶行 inline 展示）*/}
                    {s.note && (
                      <div className="hidden lg:block text-[9px] tracking-[0.04em] mb-1.5 px-2 py-0.5 rounded-full"
                        style={{
                          color: c.goldSolid,
                          background: theme === 'dark' ? 'rgba(184,146,42,0.1)' : 'rgba(184,146,42,0.08)',
                          border: `1px solid ${c.goldLine}`,
                          opacity: 0.85,
                        }}>
                        {s.note}
                      </div>
                    )}
                    {/* 简介 */}
                    <div className="text-[11px] lg:text-xs leading-relaxed lg:max-w-[200px] mt-0.5 lg:mt-0"
                      style={{ color: c.textSecond }}>
                      {s.desc}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 功能详解 ══════════════════════════════════════ */}
      <section className="relative z-10">
        {FEATURES.map((feature, i) => (
          <div key={i}
            className={`flex items-center px-6 md:px-10 lg:px-14 py-20 md:py-24 ${i <= 2 ? 'min-h-[82svh] lg:min-h-[92vh]' : ''}`}
            style={{ background: i % 2 === 1 ? c.altSection : 'transparent' }}>
            <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
              <div className={`grid grid-cols-1 ${i % 2 === 0 ? 'lg:grid-cols-[0.45fr_0.55fr]' : 'lg:grid-cols-[0.55fr_0.45fr]'} gap-10 lg:gap-16 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                {/* 文字区 */}
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <FadeIn delay={0}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px w-8" style={{ background: c.goldLine }} />
                      <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: c.tagText }}>{feature.tag}</span>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.1}>
                    <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-tight mb-5 tracking-tight`}
                      style={{
                        fontSize: i < 2 ? 'clamp(36px, 4vw, 56px)' : 'clamp(30px, 3.5vw, 48px)',
                        whiteSpace: 'pre-line',
                      }}>
                      {feature.title}
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="text-base mb-8 leading-relaxed" style={{ color: c.textSecond }}>{feature.subtitle}</p>
                  </FadeIn>
                  <div className="space-y-4">
                    {feature.points.map((point, j) => (
                      <FadeIn key={j} delay={0.25 + j * 0.08}>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full" style={{ background: c.goldSolid, opacity: 0.6 }} />
                          <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{point}</p>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
                {/* 视觉装饰区 */}
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <FadeIn delay={0.15}>
                    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12"
                      style={{
                        border: `1px solid ${c.featureBord}`,
                        background: c.featureBg,
                        minHeight: i <= 1 ? '540px' : i === 2 ? '460px' : '320px',
                        boxShadow: c.cardShadow,
                      }}>
                      <FeatureVisual index={i} colors={c} />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ 天·地·人 三分理论 ════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20"
        style={{ background: c.altSection, minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: c.tagText }}>Ni Haixia · Philosophy</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-5 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Thiên · Địa · Nhân
              </h2>
              <p className="max-w-2xl mx-auto text-sm leading-relaxed" style={{ color: c.textSecond }}>
                Quan niệm cốt lõi của thầy Nghê Hải Hạ: vận mệnh chưa bao giờ là toàn bộ cuộc đời.<br />
                Thầy chia các lực ảnh hưởng đến đời người thành ba chiều quan trọng như nhau.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { glyph: '天', label: 'Vận mệnh bẩm sinh', pct: '⅓', color: c.goldSolid, borderColor: c.goldLine, desc: 'Điều Tử Vi Đẩu Số cho thấy là cách cục lá số bẩm sinh của một người — bố cục sao, Ngũ Hành Cục, chính tinh cung Mệnh do giờ sinh quyết định. Đó chỉ là một phần ba vận mệnh, là nền của đời người chứ không phải toàn cảnh.', sub: 'Lá số · Sao · Ngũ hành' },
              { glyph: '地', label: 'Môi trường địa lý', pct: '⅓', color: 'rgba(96,165,250,0.9)', borderColor: 'rgba(96,165,250,0.3)', desc: 'Môi trường địa lý, thành phố, quốc gia, phong thủy, cả hoàn cảnh gia đình và cấu trúc xã hội nơi bạn sống cùng tạo nên chiều thứ hai của vận mệnh. Cùng một lá số, sinh ở nơi khác nhau, cơ duyên có thể một trời một vực.', sub: 'Vùng đất · Phong thủy · Môi trường' },
              { glyph: '人', label: 'Ý chí con người', pct: '⅓', color: 'rgba(100,216,139,0.9)', borderColor: 'rgba(100,216,139,0.3)', desc: 'Ý chí, tâm thái, lựa chọn và hành động của mỗi người mới là lực chủ động nhất để thay đổi vận mệnh. Thầy Nghê nhấn mạnh: hiểu lá số là để sống tốt hơn, không phải ngồi chờ số phận an bài. Rèn luyện bản thân là cách phá cục mạnh nhất.', sub: 'Ý chí · Lựa chọn · Hành động' },
            ].map((item, i) => (
              <FadeIn key={item.glyph} delay={0.1 + i * 0.12}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.1 }}
                  className="rounded-2xl p-7 h-full flex flex-col"
                  style={{ background: c.cardBg, border: `1px solid ${item.borderColor}`, boxShadow: c.cardShadow }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="text-5xl font-bold leading-none" style={{ color: item.color }}>{item.glyph}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.pct}</div>
                      <div className="text-[9px] mt-0.5 tracking-wide" style={{ color: c.textMuted }}>of life</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-0.5" style={{ color: item.color }}>{item.label}</div>
                    <div className="text-[10px] tracking-normal" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                  <div className="h-px mb-4" style={{ background: item.borderColor }} />
                  <p className="text-xs leading-relaxed flex-1" style={{ color: c.textSecond }}>{item.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div className="mt-10 text-center">
              <p className="text-sm leading-relaxed" style={{ color: c.textSecond }}>
                «Vận mệnh không phải toàn bộ cuộc đời; thêm địa lý và ý niệm con người mới là trọn vẹn.»
              </p>
              <p className="mt-2 text-[10px] tracking-wide" style={{ color: c.tagText }}>— Nghê Hải Hạ</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 倪海厦介绍 ════════════════════════════════════ */}
      <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20" style={{ minHeight: '82svh' }}>
        <WeakBoundary line={c.navBorder} />
        <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
          <FadeIn>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: c.tagText }}>Master · 1953 – 2012</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-6 tracking-tight`}
                style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                Thầy Nghê Hải Hạ
              </h2>
              <p className="max-w-2xl mx-auto leading-relaxed text-sm" style={{ color: c.textSecond }}>
                Một trong những bậc thầy Đông y và thuật số có ảnh hưởng nhất trong giới người Hoa đương đại<br />
                Người sáng lập Học viện Đông y Hán Đường tại Mỹ · Để lại hai bộ giáo trình «Nhân Kỷ» và «Thiên Kỷ»
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl p-8 md:p-10 mb-8"
              style={{ border: `1px solid ${c.niBorder}`, background: c.niBg, boxShadow: c.cardShadow }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Sinh năm', value: '1954', sub: 'Đài Loan' },
                  { label: 'Mất năm', value: '2012', sub: '31/1 · hưởng thọ 58' },
                  { label: 'Truyền thừa', value: 'Tử Vi Đẩu Số', sub: 'Đông y kinh phương · Kinh Dịch' },
                ].map(item => (
                  <div key={item.label} className="text-center rounded-xl px-4 py-3"
                    style={{ border: `1px solid ${c.niDivider}`, background: 'rgba(255,255,255,0.02)' }}>
                    <div className="text-[10px] tracking-[0.14em] mb-1" style={{ color: c.textFaint }}>{item.label}</div>
                    <div className="text-2xl font-semibold mb-0.5" style={{ color: c.goldSolid }}>{item.value}</div>
                    <div className="text-[11px]" style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <div className="h-px mb-8" style={{ background: c.niDivider }} />
              <div className="space-y-4 text-sm leading-relaxed max-w-3xl mx-auto" style={{ color: c.textSecond }}>
                <p>
                  <strong style={{ color: c.goldSolid }}>Tiểu sử</strong>: 
                  Ông Nghê Hải Hạ (1954–2012) sinh ở Đài Loan, thuở trẻ theo học nhiều danh y, chuyên nghiên cứu phái kinh phương (truyền thừa «Thương Hàn Luận»).
                  Trung niên sang Mỹ hành nghề y, lập <strong>Học viện Đông y Hán Đường</strong>, hơn hai mươi năm truyền dạy có hệ thống Đông y và thuật số truyền thống.
                  Ngày 31/1/2012 ông mất vì ung thư gan tại Đài Loan, hưởng thọ 58 tuổi.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Hệ thống giảng dạy</strong>: 
                  Thầy Nghê hệ thống hóa sở học cả đời thành hai bộ giáo trình công khai.
                  <strong>«Nhân Kỷ»</strong> gồm «Châm Cứu Đại Thành», «Thần Nông Bản Thảo Kinh», «Hoàng Đế Nội Kinh», «Thương Hàn Luận», «Kim Quỹ Yếu Lược» —
                  đây là «kỷ của người», đặt nền con đường học Đông y trọn vẹn;
                  <strong>«Thiên Kỷ»</strong> gồm Tử Vi Đẩu Số và «Kinh Dịch» — đây là «kỷ của trời», thành quả hệ thống hóa nghiên cứu thuật số.
                  Hai phần hợp lại là di sản trọn vẹn nhất thầy Nghê để lại cho hậu thế.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Quan điểm Tử Vi</strong>: 
                  Về Tử Vi Đẩu Số, thầy Nghê thuộc rõ <strong>Nam phái Tam Hợp</strong>, chủ trương «lấy cung Mệnh làm gốc, Tam Phương Tứ Chính làm dụng, Tứ Hóa làm cương».
                  Trong khóa «Thiên Kỷ» thầy nói rõ: «<em>phi tinh (Tứ Hóa) bay qua bay lại quá phức tạp, không làm cái đó, vì đại đạo chí giản</em>» —
                  quan điểm này phân biệt rõ thầy với phái Phi Tinh rườm rà.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Thái độ học thuật</strong>: 
                  Thầy Nghê phản đối học vẹt khẩu quyết, nhấn mạnh «hiểu nguyên lý hơn thuộc lòng», «logic kiểm chứng được hơn huyền học bí ẩn».
                  Thái độ này đưa Tử Vi Đẩu Số từ hệ thống truyền khẩu khép kín giữa thầy và trò thành tri thức hiện đại có hệ thống, kiểm chứng được và học được.
                </p>
                <p>
                  <strong style={{ color: c.goldSolid }}>Ảnh hưởng đương đại</strong>: 
                  Video bài giảng của thầy Nghê lan truyền rộng trên Bilibili, YouTube và nhiều nền tảng, được thế hệ mới yêu mệnh lý và Đông y coi là bài nhập môn bắt buộc.
                  Thầy không chỉ là người truyền thừa Tử Vi Đẩu Số mà còn là một trong những nhân vật then chốt đưa mệnh lý truyền thống và Đông y vào hệ thống tri thức hiện đại.
                </p>
                <p style={{ fontSize: '11px', color: c.textMuted, fontStyle: 'italic', marginTop: '12px' }}>
                  Mọi luận giải trên trang này dựa trên giáo trình công khai «Thiên Kỷ» của thầy Nghê, bản Minh của «Tử Vi Đẩu Số Toàn Thư» và các cổ thư phái Tam Hợp,
                  chỉ để tham khảo văn hóa và phát triển bản thân. Thầy Nghê không có bất kỳ liên hệ thương mại nào với trang này.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NI_TEACHINGS.map((teaching, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.08}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.1 }}
                  className="rounded-xl p-6 h-full"
                  style={{ border: `1px solid ${c.niCardBord}`, background: c.niCardBg, boxShadow: c.niCardShadow }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5"
                      style={{ borderColor: c.goldLine }}>
                      <span className="text-[9px]" style={{ color: c.goldSolid }}>{i + 1}</span>
                    </div>
                    <h3 className="text-sm font-medium leading-relaxed" style={{ color: c.goldSolid }}>{teaching.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-8" style={{ color: c.textSecond }}>{teaching.body}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 合盘入口 ══════════════════════════════════════ */}
      <section className="relative z-10 px-6 md:px-10 lg:px-14 py-20">
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="rounded-2xl p-10 md:p-14 text-center"
            style={{
              background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${c.cardBorder}`,
              boxShadow: c.cardShadow,
            }}>
            <FadeIn>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: c.goldLine }} />
                <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: c.tagText }}>Compatibility · Analysis</span>
                <div className="h-px w-8" style={{ background: c.goldLine }} />
              </div>
              <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-4 tracking-tight`}
                style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
                Hợp bàn Tử Vi
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: c.textSecond }}>
                Nhập thông tin sinh của hai người, AI theo hệ Nghê Hải Hạ phân tích cung Phu Thê đối chiếu, độ hợp cung Mệnh và tương tác Tam Phương Tứ Chính,<br className="hidden md:block" />
                cho biết mức hợp tình cảm, khả năng hợp tác và cách chung sống tốt nhất.
              </p>
              <div className="flex justify-center gap-3 flex-wrap mb-6">
                {['Phân tích độ hợp tình cảm', 'Đánh giá hợp tác làm ăn', 'Luận duyên cha mẹ – con', 'Xem hợp tuổi trước hôn nhân'].map(item => (
                  <span key={item} style={{
                    fontSize: '12px', padding: '5px 14px', borderRadius: '20px',
                    background: theme === 'dark' ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.12)',
                    border: `1px solid ${c.goldLine}`,
                    color: c.goldSolid,
                  }}>
                    {item}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/heming')}
                className="px-10 py-3 font-medium text-sm tracking-wide rounded-full"
                style={{
                  background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(140,100,20,0.1)',
                  border: `1px solid ${c.goldLine}`,
                  color: c.goldSolid,
                  cursor: 'pointer',
                }}>
                Bắt đầu xem hợp bàn
              </motion.button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ 最终 CTA ══════════════════════════════════════ */}
      <section className="relative z-10 py-40 px-6 text-center" style={{ background: c.altSection }}>
        <FadeIn>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-6" style={{ color: c.tagText }}>Bắt đầu hành trình lá số của bạn</p>
          <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-8 tracking-tight leading-tight`}
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
            Lá số Tử Vi của bạn<br />đang chờ được luận giải
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            Nhập ngày giờ sinh, vài giây là có lá số riêng của bạn<br />
            rồi AI luận giải sâu theo hệ Nghê Hải Hạ
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="px-14 py-4 font-semibold text-base tracking-wide rounded-full"
            style={{ background: c.ctaBg, color: c.ctaText }}>
            Lập lá số miễn phí
          </motion.button>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <motion.a
              href="/knowledge"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.06em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              ✦ Kho kiến thức Tử Vi →
            </motion.a>
            <motion.a
              href="/library"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.06em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}>
              📜 Thư viện cổ thư →
            </motion.a>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-6"
        style={{ borderTop: `1px solid ${c.niCardBord}` }}>

        {/* 4 板块导航占位（已上线 + 即将开放）*/}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-[9px] tracking-[0.14em] text-center mb-4 uppercase"
            style={{ color: c.textMuted, opacity: 0.6 }}>
            Phương pháp luận thầy Nghê · Hệ thống học thuật
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {SECTIONS.map(s => {
              const ready = s.status === 'ready';
              return (
                <a
                  key={s.key}
                  href={ready ? '/chart' : undefined}
                  onClick={ready ? undefined : (e) => e.preventDefault()}
                  className="rounded-lg px-3 py-3 text-center transition-all"
                  style={{
                    background: ready ? c.starBg : 'transparent',
                    border: `1px ${ready ? 'solid' : 'dashed'} ${ready ? c.goldLine : c.navBorder}`,
                    cursor: ready ? 'pointer' : 'not-allowed',
                    opacity: ready ? 1 : 0.5,
                    textDecoration: 'none',
                  }}
                >
                  <div className="text-base font-semibold mb-0.5 tracking-[0.02em]"
                    style={{ color: ready ? c.goldSolid : c.textMuted }}>
                    {s.name}
                  </div>
                  <div className="text-[9px] tracking-normal"
                    style={{ color: ready ? '#3F7A52' : c.textMuted }}>
                    {ready ? '✓ Đã ra mắt' : `Mở vào ${s.when.toLowerCase()}`}
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] tracking-normal mb-3" style={{ color: c.footerText }}>
            Lá số Tử Vi · Theo hệ Nghê Hải Hạ · Chỉ để tham khảo, vận mệnh nằm trong tay bạn
          </p>
          <p className="text-[10px] tracking-normal mb-3 max-w-2xl mx-auto leading-relaxed"
            style={{ color: c.footerText, opacity: 0.85 }}>
            Trang này dựa trên nghiên cứu văn hóa truyền thống Trung Hoa, chỉ để học tập tham khảo.<br className="sm:hidden" />
            Không phải lời khuyên y tế, đầu tư, pháp lý hay cho các quyết định quan trọng.
          </p>
          <p className="text-[10px] tracking-normal" style={{ color: c.footerText }}>
            <a href="/terms" style={{ color: c.footerText, textDecoration: 'underline' }}>Điều khoản dịch vụ</a>
            {' · '}
            <a href="/privacy" style={{ color: c.footerText, textDecoration: 'underline' }}>Chính sách bảo mật</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
