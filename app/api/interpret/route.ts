// app/api/interpret/route.ts
// Route hỏi đáp Tử Vi cho ziwei-doushu: nhận { chart, messages } từ components/ChatPanel.tsx,
// trả về luồng SSE dạng `data: {"delta":{"text":"..."}}` mà ChatPanel đang đọc.
// Cần GEMINI_API_KEY (Google Gemini) hoặc ANTHROPIC_API_KEY (Claude) — chọn bằng AI_PROVIDER, xem .env.example.

import Anthropic from '@anthropic-ai/sdk';
import { viName } from '@/lib/i18n/vi';

export const runtime = 'nodejs';

// Tạo client khi có request (không tạo lúc nạp module) để `next build` chạy được khi chưa có key.
let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic()); // đọc ANTHROPIC_API_KEY từ env

const SYSTEM = `Bạn là trợ lý giải đáp Tử Vi Đẩu Số bằng tiếng Việt, theo hệ Thiên Kỷ của Nghê Hải Hạ.

Quy tắc:
- Chỉ dựa trên lá số JSON được cung cấp. Không tự bịa sao, cung hay Tứ Hóa không có trong lá số.
- Tên sao, cung, can chi trong JSON đã được đổi sang Hán Việt (Tử Vi, Mệnh, Hóa Lộc…): dùng đúng các tên đó, không viết chữ Hán.
- Khi luận, nêu rõ căn cứ: sao nào, ở cung nào, Tứ Hóa nào, đại hạn/lưu niên nào.
- Chỗ nào các trường phái khác nhau hoặc lá số không đủ thông tin, nói thẳng là không chắc.
- Không đưa lời khuyên y tế, pháp lý, tài chính hay quyết định hôn nhân; nhắc người dùng đây là tham khảo văn hóa, giải trí.
- Trả lời ngắn gọn, dễ hiểu với người không biết Tử Vi.`;

const MAX_TURNS = 20;

type Turn = { role: 'user' | 'assistant'; content: string };
type Provider = 'gemini' | 'anthropic';

/** AI_PROVIDER=gemini | anthropic; giá trị khác (vd deepseek của bản gốc) thì tự chọn theo key nào đã điền. */
/** Key thật: không rỗng và không phải giá trị mẫu "your-..." trong .env.example. */
const realKey = (v: string | undefined) => !!v?.trim() && !/^your-/i.test(v.trim());

function pickProvider(): Provider | null {
  const p = process.env.AI_PROVIDER?.trim().toLowerCase();
  const hasGemini = realKey(process.env.GEMINI_API_KEY);
  const hasClaude = realKey(process.env.ANTHROPIC_API_KEY);
  if (p === 'gemini' && hasGemini) return 'gemini';
  if ((p === 'anthropic' || p === 'claude') && hasClaude) return 'anthropic';
  if (hasGemini) return 'gemini';
  if (hasClaude) return 'anthropic';
  return null;
}

/**
 * Đổi mọi giá trị chuỗi chữ Hán trong lá số sang Hán Việt trước khi gửi cho AI
 * (model nhỏ như Flash-Lite hay để sót chữ Hán hoặc phiên âm sai). Khóa JSON giữ nguyên.
 */
function toVietnamese(v: unknown): unknown {
  if (typeof v === 'string') return /[\u4e00-\u9fff]/.test(v) ? viName(v) : v;
  if (Array.isArray(v)) return v.map(toVietnamese);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, toVietnamese(x)]));
  }
  return v;
}

const encoder = new TextEncoder();
const sseChunk = (text: string) => encoder.encode(`data: ${JSON.stringify({ delta: { text } })}\n\n`);
const SSE_HEADERS = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
};

/** Trả một lời báo dưới dạng SSE để ChatPanel/InsightPanel hiện được. */
function sseMessage(msg: string) {
  return new Response(`data: ${JSON.stringify({ delta: { text: msg } })}\n\ndata: [DONE]\n\n`, { headers: SSE_HEADERS });
}

export async function POST(req: Request) {
  const provider = pickProvider();
  if (!provider) {
    return sseMessage('Chưa có API key. Dán GEMINI_API_KEY (lấy tại https://aistudio.google.com/apikey) vào .env.local rồi lưu file.');
  }
  let body: { chart?: unknown; messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return new Response('Dữ liệu gửi lên không hợp lệ', { status: 400 });
  }
  const { chart, messages } = body;
  if (!chart || !Array.isArray(messages) || messages.length === 0) {
    return new Response('Thiếu lá số hoặc câu hỏi', { status: 400 });
  }

  const history: Turn[] = messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role as Turn['role'], content: m.content }));
  // Lượt đầu tiên gửi cho API phải là của người dùng
  while (history.length && history[0].role !== 'user') history.shift();
  if (!history.length) return new Response('Chưa có câu hỏi', { status: 400 });

  const chartText = `Lá số của người hỏi (JSON):\n${JSON.stringify(toVietnamese(chart))}`;
  return provider === 'gemini'
    ? askGemini(history, chartText)
    : askClaude(history, chartText);
}

// ─── Google Gemini (REST, không cần thêm thư viện) ─────────────────────────
// Lấy key tại https://aistudio.google.com/apikey. Đổi model bằng GEMINI_MODEL nếu cần.
async function askGemini(history: Turn[], chartText: string): Promise<Response> {
  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY!.trim() },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }, { text: chartText }] },
        contents: history.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
        // Model Gemini tính cả token "suy nghĩ" vào giới hạn này, nên để rộng để câu trả lời không bị cắt.
        generationConfig: { maxOutputTokens: 8192, temperature: 0.7 },
      }),
    });
  } catch (err) {
    console.error('gemini request error', err);
    return sseMessage('Không gọi được Gemini (lỗi mạng). Xem log của server để biết chi tiết.');
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    console.error('gemini error', upstream.status, detail.slice(0, 500));
    const msg = upstream.status === 400 && /API key/i.test(detail) ? 'API key Gemini không hợp lệ. Kiểm tra GEMINI_API_KEY trong .env.local.'
      : upstream.status === 403 ? 'API key Gemini không có quyền dùng model này (403). Kiểm tra key hoặc GEMINI_MODEL.'
      : upstream.status === 404 ? `Không tìm thấy model "${model}". Đổi GEMINI_MODEL trong .env.local.`
      : upstream.status === 429 ? 'Gemini báo vượt hạn mức (429). Đợi một lát rồi thử lại.'
      : `Không gọi được Gemini (${upstream.status}). Xem log của server để biết chi tiết.`;
    return sseMessage(msg);
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const sse = new ReadableStream({
    async start(controller) {
      let buf = '';
      let sent = false;
      const handleLine = (line: string) => {
        if (!line.startsWith('data:')) return;
        const data = line.slice(5).trim();
        if (!data) return;
        try {
          const json = JSON.parse(data);
          const parts = json.candidates?.[0]?.content?.parts ?? [];
          for (const part of parts) {
            if (typeof part.text === 'string' && part.text && !part.thought) {
              controller.enqueue(sseChunk(part.text));
              sent = true;
            }
          }
          const blocked = json.promptFeedback?.blockReason;
          if (blocked) controller.enqueue(sseChunk(`\n[Gemini từ chối trả lời: ${blocked}]`));
        } catch { /* bỏ qua dòng không phải JSON */ }
      };
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split(/\r?\n/);
          buf = lines.pop() ?? '';
          lines.forEach(handleLine);
        }
        if (buf) handleLine(buf);
        if (!sent) controller.enqueue(sseChunk('Gemini không trả về nội dung. Vui lòng thử lại.'));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        console.error('gemini stream error', err);
        controller.enqueue(sseChunk('\n[Lỗi khi tạo câu trả lời]'));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(sse, { headers: SSE_HEADERS });
}

// ─── Anthropic Claude ──────────────────────────────────────────────────────
async function askClaude(history: Turn[], chartText: string): Promise<Response> {
  let stream;
  try {
    stream = await getClient().messages.create({
      model: 'claude-sonnet-5-5',
      max_tokens: 2000,
      system: [
        { type: 'text', text: SYSTEM },
        // Lá số đặt trong system để mọi lượt hỏi đều thấy; có thể bật prompt caching cho khối này
        { type: 'text', text: chartText },
      ],
      messages: history,
      stream: true,
    });
  } catch (err) {
    // Lỗi trước khi có luồng (sai key, hết tiền, sai tên model…): vẫn trả SSE để ChatPanel hiện được lời báo
    console.error('interpret request error', err);
    const status = (err as { status?: number })?.status;
    return sseMessage(status === 401
      ? 'API key Anthropic không hợp lệ. Kiểm tra ANTHROPIC_API_KEY trong .env.local.'
      : `Không gọi được Claude (${status ?? 'lỗi mạng'}). Xem log của server để biết chi tiết.`);
  }

  const sse = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(sseChunk(event.delta.text));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        console.error('interpret stream error', err);
        controller.enqueue(sseChunk('\n[Lỗi khi tạo câu trả lời]'));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(sse, { headers: SSE_HEADERS });
}
