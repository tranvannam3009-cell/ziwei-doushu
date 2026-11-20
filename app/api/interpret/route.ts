// app/api/interpret/route.ts
// Route hỏi đáp Tử Vi cho ziwei-doushu: nhận { chart, messages } từ components/ChatPanel.tsx,
// trả về luồng SSE dạng `data: {"delta":{"text":"..."}}` mà ChatPanel đang đọc.
// Cần biến môi trường ANTHROPIC_API_KEY (xem .env.example).

import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

// Tạo client khi có request (không tạo lúc nạp module) để `next build` chạy được khi chưa có key.
let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic()); // đọc ANTHROPIC_API_KEY từ env

const SYSTEM = `Bạn là trợ lý giải đáp Tử Vi Đẩu Số bằng tiếng Việt, theo hệ Thiên Kỷ của Nghê Hải Hạ.

Quy tắc:
- Chỉ dựa trên lá số JSON được cung cấp. Không tự bịa sao, cung hay Tứ Hóa không có trong lá số.
- Tên sao, cung, can chi trong JSON là chữ Hán: luôn đọc ra âm Hán Việt (紫微 → Tử Vi, 命宫 → cung Mệnh, 化禄 → Hóa Lộc).
- Khi luận, nêu rõ căn cứ: sao nào, ở cung nào, Tứ Hóa nào, đại hạn/lưu niên nào.
- Chỗ nào các trường phái khác nhau hoặc lá số không đủ thông tin, nói thẳng là không chắc.
- Không đưa lời khuyên y tế, pháp lý, tài chính hay quyết định hôn nhân; nhắc người dùng đây là tham khảo văn hóa, giải trí.
- Trả lời ngắn gọn, dễ hiểu với người không biết Tử Vi.`;

const MAX_TURNS = 20;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response('Chưa cấu hình ANTHROPIC_API_KEY trong .env.local', { status: 500 });
  }
  let body: { chart?: unknown; messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }
  const { chart, messages } = body;
  if (!chart || !Array.isArray(messages) || messages.length === 0) {
    return new Response('Missing chart or messages', { status: 400 });
  }

  const history = messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
  // Lượt đầu tiên gửi cho API phải là của người dùng
  while (history.length && history[0].role !== 'user') history.shift();
  if (!history.length) return new Response('No user message', { status: 400 });

  const encoder = new TextEncoder();
  let stream;
  try {
    stream = await getClient().messages.create({
      model: 'claude-sonnet-5-5',
      max_tokens: 2000,
      system: [
        { type: 'text', text: SYSTEM },
        // Lá số đặt trong system để mọi lượt hỏi đều thấy; có thể bật prompt caching cho khối này
        { type: 'text', text: `Lá số của người hỏi (JSON):\n${JSON.stringify(chart)}` },
      ],
      messages: history,
      stream: true,
    });
  } catch (err) {
    // Lỗi trước khi có luồng (sai key, hết tiền, sai tên model…): vẫn trả SSE để ChatPanel hiện được lời báo
    console.error('interpret request error', err);
    const status = (err as { status?: number })?.status;
    const msg = status === 401
      ? 'API key Anthropic không hợp lệ. Kiểm tra ANTHROPIC_API_KEY trong .env.local.'
      : `Không gọi được Claude (${status ?? 'lỗi mạng'}). Xem log của server để biết chi tiết.`;
    return new Response(`data: ${JSON.stringify({ delta: { text: msg } })}\n\ndata: [DONE]\n\n`, {
      headers: { 'Content-Type': 'text/event-stream; charset=utf-8' },
    });
  }

  const sse = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: event.delta.text } })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        console.error('interpret stream error', err);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: '\n[Lỗi khi tạo câu trả lời]' } })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(sse, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
