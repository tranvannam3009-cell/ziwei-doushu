'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';
import { viName, viPalace, SIHUA_VI } from '@/lib/i18n/vi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean; // don't show user bubble for auto/topic messages
}

interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

const TOPICS = [
  { key: 'overview',     label: 'Mệnh cách' },
  { key: 'love',        label: 'Tình cảm' },
  { key: 'career',      label: 'Sự nghiệp' },
  { key: 'wealth',      label: 'Tài lộc' },
  { key: 'health',      label: 'Sức khỏe' },
  { key: 'personality', label: 'Tính cách' },
] as const;

const TOPIC_PROMPTS: Record<string, string> = {
  overview: `Hãy viết phần tổng quan lá số theo cấu trúc sau:

**【Định tính mệnh cách】**
Một câu tóm tắt cách cục cốt lõi và khí chất của mệnh chủ.

**【Luận chính tinh】**
Đặc điểm cốt lõi của chính tinh cung Mệnh, dẫn quan điểm của Nghê Hải Hạ.

**【Tam Phương Tứ Chính】**
Phân tích liên động ba cung Tài Bạch, Quan Lộc, Thiên Di và cách cục tổng thể.

**【Đại Hạn hiện tại】**
Xu hướng của Đại Hạn hiện tại và điều đáng chú ý nhất.

**【Ưu điểm và lưu ý】**
Thế mạnh bẩm sinh, cùng những rủi ro hoặc bài học cần lưu ý.`,

  love: `Hãy phân tích sâu tình cảm, hôn nhân theo cấu trúc sau:

**【Cách cục tình cảm】**
Một câu định tính tình duyên.

**【Luận cung Phu Thê】**
Chính tinh, Tứ Hóa của cung Phu Thê và cách luận theo hệ Nghê Hải Hạ.

**【Liên động Tam Phương】**
Ảnh hưởng của các cung liên quan đến tình cảm.

**【Tình cảm trong Đại Hạn hiện tại】**
Xu hướng tình cảm 10 năm hiện tại và các mốc quan trọng.

**【Lời khuyên thực tế】**
Lời khuyên cụ thể, làm được.`,

  career: `Hãy phân tích sâu sự nghiệp theo cấu trúc sau:

**【Cách cục sự nghiệp】**
Một câu định tính sự nghiệp: hợp làm công hay tự kinh doanh.

**【Luận cung Quan Lộc】**
Chính tinh, Tứ Hóa của cung Quan Lộc và nhận định của thầy Nghê về cấu hình này.

**【Liên động cung Tài Bạch】**
Quan hệ giữa tài lộc và sự nghiệp, nguồn tiền đến từ đâu.

**【Sự nghiệp trong Đại Hạn hiện tại】**
Xu hướng sự nghiệp 10 năm hiện tại.

**【Lời khuyên thực tế】**
Hướng đi, ngành nghề và chiến lược phù hợp.`,

  wealth: `Hãy phân tích sâu tài lộc theo cấu trúc sau:

**【Cách cục tài lộc】**
Một câu định tính kiểu tài lộc: tài chủ động hay tài bị động.

**【Luận cung Tài Bạch】**
Chính tinh, Tứ Hóa của cung Tài Bạch, nguồn và cách tiền vận động.

**【Cung Điền Trạch (kho tiền)】**
Khả năng tích lũy và vận nhà đất.

**【Tài lộc trong Đại Hạn hiện tại】**
Xu hướng tài lộc hiện tại và điều cần lưu ý.

**【Lời khuyên quản lý tiền】**
Lời khuyên tài chính cụ thể.`,

  health: `Hãy phân tích sức khỏe theo cấu trúc sau:

**【Sao cung Tật Ách】**
Các sao ở cung Tật Ách và ý nghĩa về sức khỏe.

**【Rủi ro chính】**
Kết hợp thuyết Tý Ngọ Lưu Chú của Nghê Hải Hạ, phân tích các nguy cơ sức khỏe và bộ phận cần chú ý.

**【Sức khỏe theo Đại Hạn】**
Xu hướng sức khỏe hiện tại và các giai đoạn quan trọng.

**【Phòng ngừa】**
Điều cần lưu ý và hướng dưỡng sinh.`,

  personality: `Hãy phân tích sâu tính cách theo cấu trúc sau:

**【Tính cách theo chính tinh cung Mệnh】**
Đặc điểm tính cách cốt lõi của chính tinh cung Mệnh, dẫn lời thầy Nghê.

**【Tổng hợp Tam Phương】**
Ảnh hưởng của ba cung Tài Bạch, Quan Lộc, Thiên Di đến tính cách, mô tả toàn cảnh.

**【Cách giao tiếp, đối nhân xử thế】**
Cách tương tác với người khác và phong cách xử thế.

**【Ưu điểm và bài học cuộc đời】**
Thế mạnh bẩm sinh và những bài học cần đối diện.`,
};

const PALACE_ROLES: Record<string, string> = {
  '命宫':   'bản thân, tính cách, cách cục bẩm sinh',
  '兄弟宫': 'anh chị em, người hợp tác',
  '夫妻宫': 'tình cảm, hôn nhân',
  '子女宫': 'con cái, cấp dưới',
  '财帛宫': 'nguồn tiền, cách kiếm tiền',
  '疾厄宫': 'sức khỏe, tai nạn',
  '迁移宫': 'cơ hội khi ra ngoài, quan hệ xã hội',
  '交友宫': 'bạn bè, quý nhân, tiểu nhân',
  '官禄宫': 'sự nghiệp, địa vị xã hội',
  '田宅宫': 'nhà đất, môi trường gia đình',
  '福德宫': 'đời sống tinh thần, phúc phần',
  '父母宫': 'cha mẹ, giấy tờ hợp đồng',
};

/** In đậm **x** và nghiêng *x* trong một dòng. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g);
  return (
    <>
      {parts.map((part, j) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) {
          return <strong key={j} className="font-semibold" style={{ color: 'var(--t-text)' }}>{part.slice(2, -2)}</strong>;
        }
        if (/^\*[^*\s][^*]*\*$/.test(part)) return <em key={j}>{part.slice(1, -1)}</em>;
        return part;
      })}
    </>
  );
}

/**
 * Hiển thị câu trả lời AI dạng markdown đơn giản: tiêu đề **【X】** / ## X / dòng chỉ có **X**,
 * gạch đầu dòng (*, -, •), danh sách số, đậm/nghiêng. Cỡ chữ theo em để đổi bằng nút A−/A+.
 */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div style={{ lineHeight: 1.75 }}>
      {lines.map((raw, i) => {
        const line = raw.trimEnd();
        const heading =
          line.match(/^\*\*【(.+?)】\*\*:?$/)?.[1] ??
          line.match(/^#{1,4}\s+(.+)$/)?.[1]?.replace(/\*\*/g, '') ??
          line.match(/^\*\*([^*]{2,60})\*\*:?$/)?.[1];
        if (heading) {
          return (
            <div key={i} className="first:mt-0" style={{ marginTop: '1.1em', marginBottom: '0.35em' }}>
              <span className="font-semibold" style={{ color: 'var(--t-gold)', fontSize: '1.08em', letterSpacing: '0.01em' }}>
                {heading.replace(/^【|】$/g, '')}
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} style={{ height: '0.5em' }} />;
        if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
          return <hr key={i} style={{ border: 0, borderTop: '1px solid var(--t-border)', margin: '0.9em 0' }} />;
        }
        const bullet = line.match(/^\s*[*\-•]\s+(.*)$/);
        if (bullet) {
          return (
            <div key={i} className="flex gap-2" style={{ color: 'var(--t-text2)', marginTop: '0.25em', paddingLeft: '0.2em' }}>
              <span style={{ color: 'var(--t-gold)', opacity: 0.7 }}>•</span>
              <span className="min-w-0"><Inline text={bullet[1]} /></span>
            </div>
          );
        }
        const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
        if (numbered) {
          return (
            <div key={i} className="flex gap-2" style={{ color: 'var(--t-text2)', marginTop: '0.25em', paddingLeft: '0.2em' }}>
              <span className="tabular-nums" style={{ color: 'var(--t-gold)', opacity: 0.8 }}>{numbered[1]}.</span>
              <span className="min-w-0"><Inline text={numbered[2]} /></span>
            </div>
          );
        }
        return (
          <p key={i} style={{ color: 'var(--t-text2)', marginTop: '0.25em' }}>
            <Inline text={line} />
          </p>
        );
      })}
      {streaming && (
        <span
          className="inline-block ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ width: '0.45em', height: '1em', background: 'var(--t-gold)', opacity: 0.6 }}
        />
      )}
    </div>
  );
}

/** Ba cỡ chữ cho khung luận giải; lưu trong localStorage của trình duyệt. */
const FONT_SIZES = [14, 16, 18, 20] as const;
const FONT_KEY = 'ziwei-reading-font';

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]); // always-current copy for closures
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // Cỡ chữ đọc: mặc định 16px, nhớ lựa chọn của người xem
  const [fontIdx, setFontIdx] = useState(1);
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(FONT_KEY));
      const idx = FONT_SIZES.indexOf(saved as typeof FONT_SIZES[number]);
      if (idx >= 0) setFontIdx(idx);
    } catch { /* localStorage không dùng được: giữ mặc định */ }
  }, []);
  const changeFont = (delta: number) => {
    setFontIdx(prev => {
      const next = Math.min(FONT_SIZES.length - 1, Math.max(0, prev + delta));
      try { localStorage.setItem(FONT_KEY, String(FONT_SIZES[next])); } catch { /* bỏ qua */ }
      return next;
    });
  };

  // Cuộn: khi câu trả lời mới bắt đầu thì đưa đầu câu trả lời lên; trong lúc đang chạy chữ,
  // chỉ bám theo cuối nếu người đọc đang ở gần cuối — không giật trang khi họ đang đọc phía trên.
  const stickToBottom = useRef(true);
  const lastMsgCount = useRef(0);
  const programmatic = useRef(false);
  /** Vị trí đầu câu trả lời mới: tiếp tục kéo lên khi nội dung dài ra, đến khi chạm đỉnh khung. */
  const anchorTop = useRef<number | null>(null);
  /** Chỉ cuộn do người đọc mới quyết định có bám cuối hay không; bỏ qua cuộn do code gây ra. */
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (programmatic.current) { programmatic.current = false; return; }
    anchorTop.current = null; // người đọc tự cuộn: thôi kéo
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };
  const scrollTo = (el: HTMLElement, top: number) => {
    if (Math.abs(el.scrollTop - top) < 1) return;
    programmatic.current = true;
    el.scrollTop = top;
  };
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (messages.length !== lastMsgCount.current) {
      lastMsgCount.current = messages.length;
      const all = el.querySelectorAll<HTMLElement>('[data-msg]');
      const last = all[all.length - 1];
      if (last && messages[messages.length - 1]?.role === 'assistant') {
        anchorTop.current = last.offsetTop - 8;
        stickToBottom.current = false;
      } else {
        anchorTop.current = null;
        scrollTo(el, el.scrollHeight - el.clientHeight);
        return;
      }
    }
    if (anchorTop.current !== null) {
      const max = el.scrollHeight - el.clientHeight;
      scrollTo(el, Math.min(anchorTop.current, max));
      if (max >= anchorTop.current) anchorTop.current = null; // đã đưa được đầu câu trả lời lên đỉnh
      return;
    }
    if (stickToBottom.current) scrollTo(el, el.scrollHeight - el.clientHeight);
  }, [messages]);

  // Auto-generate 命格总览 on mount
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject palace analysis when palace selected
  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${viName(s.name)}${s.siHua ? ' Hóa ' + SIHUA_VI[s.siHua] : ''}`).join(', ')
      : 'vô chính diệu (mượn sao cung đối)';
    const role = PALACE_ROLES[selectedPalace.name] ?? '';

    const palaceVi = viPalace(selectedPalace.name);
    const prompt = `Hãy phân tích kỹ 【${palaceVi}】 (chủ về: ${role}), chính tinh của cung là ${starDesc}, theo cấu trúc sau:

**【Định tính cung】**
Ý nghĩa của ${palaceVi} trong lá số và nhận định tổng thể về cấu hình sao này.

**【Luận chính tinh】**
Luận chính tinh tại cung này theo hệ Nghê Hải Hạ, dẫn quan điểm cụ thể.

**【Liên động Tam Phương Tứ Chính】**
Ảnh hưởng của các cung Tam Phương Tứ Chính đến cung này.

**【Lời khuyên thực tế】**
Lời khuyên cụ thể dựa trên cung này.`;

    sendMessage(prompt, true);
  }, [selectedPalace]); // eslint-disable-line react-hooks/exhaustive-deps

  // 注入四化飞化分析
  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    // 找出该星所在宫位
    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceName = palaceOfStar ? viPalace(palaceOfStar.name) : 'cung chưa rõ';
    const viewLabel = selectedSiHua.view === 'daxian' ? 'Đại Hạn' : 'Lưu Niên';
    const hua = `Hóa ${SIHUA_VI[selectedSiHua.siHua] ?? selectedSiHua.siHua}`;
    const starHua = `${viName(selectedSiHua.starName)} ${hua}`;

    const prompt = `Hãy phân tích ảnh hưởng phi hóa của 【${viewLabel} ${starHua}】 theo cấu trúc sau:

**【Ý nghĩa cơ bản của ${hua}】**
Ý nghĩa cốt lõi của ${hua} trong hệ Nghê Hải Hạ, và ý nghĩa riêng của ${starHua}.

**【Ảnh hưởng tại cung】**
${starHua} rơi vào 【${palaceName}】: lĩnh vực cung này chủ quản bị ảnh hưởng thế nào, thầy Nghê luận ra sao.

**【Đường phi hóa Tam Phương Tứ Chính】**
Sau khi ${hua} nhập ${palaceName}, ảnh hưởng liên động đến Tam Phương Tứ Chính (cung đối và hai cung tam hợp).

**【Ảnh hưởng vận hiện tại】**
Trong khung thời gian ${viewLabel}, ${hua} này ảnh hưởng cụ thể thế nào đến vận gần đây của mệnh chủ.

**【Lời khuyên thực tế】**
Lời khuyên cụ thể, làm được, dựa trên Tứ Hóa này.`;

    sendMessage(prompt, true);
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps

  const streamResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
      });
      if (res.status === 404) throw new Error('api-missing');
      if (!res.ok) throw new Error('request-failed');
      if (!res.body) throw new Error('no-stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data).delta?.text ?? '';
            assistantText += delta;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch { /* skip */ }
        }
      }
    } catch (e) {
      const missing = e instanceof Error && e.message === 'api-missing';
      setMessages(prev => [...prev, { role: 'assistant', content: missing ? 'Chưa có API hỏi đáp (/api/interpret). Xem mục «Bắt đầu nhanh» trong README. Lập lá số không cần API key.' : 'Không luận giải được, vui lòng thử lại sau.' }]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const sendMessage = (text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, hidden };
    // Capture current messages synchronously via ref (avoids stale closure)
    const apiMessages = [...messagesRef.current, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMessages);
  };

  const handleTopicClick = (topicKey: string) => {
    if (loadingRef.current) return;
    setActiveTopic(topicKey);
    sendMessage(TOPIC_PROMPTS[topicKey], true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  const fontPx = FONT_SIZES[fontIdx];

  return (
    <div
      className="flex flex-col h-[min(52rem,calc(100dvh-6rem))] min-h-0 min-w-0 rounded-xl overflow-hidden card-glass"
      style={{
        border: '1px solid rgba(160,129,79,0.38)',
        boxShadow: '0 10px 32px rgba(60,48,32,0.10)', background: 'var(--bg-card)',
      }}
    >

      {/* ── Chủ đề + cỡ chữ ── */}
      <div className="flex-shrink-0 px-3 pt-3 pb-2.5" style={{ borderBottom: '1px solid rgba(160,129,79,0.22)' }}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="text-xs tracking-wide flex items-center gap-1.5" style={{ color: 'var(--t-faint)' }}>
            <span style={{ color: 'var(--t-gold)', opacity: 0.6 }}>✦</span>
            Luận giải lá số
          </div>
          <div className="flex items-center gap-1" role="group" aria-label="Cỡ chữ">
            <button
              onClick={() => changeFont(-1)}
              disabled={fontIdx === 0}
              aria-label="Chữ nhỏ hơn"
              className="w-8 h-7 rounded-md text-xs font-semibold disabled:opacity-30"
              style={{ border: '1px solid var(--t-border)', color: 'var(--t-text2)' }}
            >
              A−
            </button>
            <span className="text-[11px] tabular-nums w-9 text-center" style={{ color: 'var(--t-faint)' }}>{fontPx}px</span>
            <button
              onClick={() => changeFont(1)}
              disabled={fontIdx === FONT_SIZES.length - 1}
              aria-label="Chữ to hơn"
              className="w-8 h-7 rounded-md text-sm font-semibold disabled:opacity-30"
              style={{ border: '1px solid var(--t-border)', color: 'var(--t-text2)' }}
            >
              A+
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                disabled={loading}
                className="py-2 text-[13px] font-medium rounded-lg transition-all duration-150 disabled:opacity-40"
                style={{
                  background: isActive ? 'rgba(160,129,79,0.14)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(160,129,79,0.4)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-text2)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Nội dung luận giải + hội thoại ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-6 min-h-0"
        style={{ fontSize: `${fontPx}px` }}
      >

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.12 }}>✦</div>
            <p className="animate-pulse" style={{ color: 'var(--t-faint)', fontSize: '0.9em' }}>Đang luận giải lá số…</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            if (msg.role === 'user' && msg.hidden) return null;

            if (msg.role === 'user') {
              return (
                <motion.div
                  key={i}
                  data-msg
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div
                    className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5"
                    style={{
                      background: 'rgba(160,129,79,0.1)',
                      border: '1px solid rgba(160,129,79,0.22)',
                      color: 'var(--t-gold)',
                      fontSize: '0.95em',
                      lineHeight: 1.6,
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              );
            }

            const isLastMsg = i === messages.length - 1;
            return (
              <motion.div
                key={i}
                data-msg
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-1"
                style={{ borderTop: i > 0 ? '1px dashed var(--t-border)' : undefined, paddingTop: i > 0 ? '1.1em' : undefined }}
              >
                <div
                  className="tracking-wide mb-2 flex items-center gap-1.5"
                  style={{ color: 'var(--t-faint)', fontSize: '0.72em' }}
                >
                  <span style={{ color: 'var(--t-gold)', opacity: 0.5 }}>✦</span>
                  THẦY TỬ VI
                </div>
                <AiContent text={msg.content} streaming={loading && isLastMsg} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Ô hỏi ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2.5" style={{ borderTop: '1px solid rgba(160,129,79,0.22)' }}>
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            rows={1}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Hỏi thêm, vd: Năm nay có nên đổi việc?"
            disabled={loading}
            className="flex-1 min-w-0 resize-none rounded-xl px-3.5 py-2.5 text-[16px] sm:text-[15px] leading-relaxed focus:outline-none transition-colors"
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(160,129,79,0.7)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(160,129,79,0.32)'; }}
            style={{
              background: 'var(--t-card)',
              border: '1px solid rgba(160,129,79,0.32)',
              color: 'var(--t-text)',
              maxHeight: 140,
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 flex-shrink-0 rounded-xl text-[15px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'var(--tx-0)',
              border: '1px solid var(--tx-0)',
              color: 'var(--bg-0)',
            }}
          >
            {loading ? '…' : 'Gửi'}
          </button>
        </div>
        <p className="hidden sm:block mt-1.5 text-[11px]" style={{ color: 'var(--t-faint)' }}>
          Enter để gửi · Shift+Enter xuống dòng · Bấm vào một cung trên lá số để luận riêng cung đó
        </p>
      </div>

    </div>
  );
}
