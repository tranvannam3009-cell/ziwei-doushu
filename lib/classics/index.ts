/**
 * 古籍原典查询库 — 入口
 *
 * 加载所有古籍数据 + 提供查询/搜索 API
 * 数据为 JSON 静态打包，零 DB 依赖、零网络请求
 */

import type { Book, Paragraph, SearchHit } from './types';
import { guSuiFu } from './data/gusuifu';
import { ziWeiQuanJi } from './data/quanji';
import { ziWeiQuanShu } from './data/quanshu';
import { BOOKS_VI, PARAGRAPH_VI } from './vi';

/** Phủ bản dịch tiếng Việt lên dữ liệu gốc (nguyên văn chữ Hán giữ nguyên trong `text`). */
function localize(book: Book): Book {
  const vi = BOOKS_VI[book.slug];
  if (!vi) return book;
  return {
    ...book,
    title: vi.title,
    dynasty: vi.dynasty,
    author: vi.author,
    intro: vi.intro,
    chapters: book.chapters.map((ch, i) => ({
      ...ch,
      title: vi.chapters[i]?.[0] ?? ch.title,
      subtitle: vi.chapters[i]?.[1] ?? ch.subtitle,
      paragraphs: ch.paragraphs.map(p => ({ ...p, translation: p.translation ?? PARAGRAPH_VI[p.id] })),
    })),
  };
}

/** 所有已收录古籍 */
export const ALL_BOOKS: Book[] = [
  guSuiFu,
  ziWeiQuanJi,
  ziWeiQuanShu,
].map(localize);

/** 总段落数（用于首页统计） */
export const TOTAL_PARAGRAPHS = ALL_BOOKS.reduce(
  (sum, b) => sum + b.chapters.reduce((s, c) => s + c.paragraphs.length, 0),
  0,
);

/** 按 slug 取书 */
export function getBookBySlug(slug: string): Book | null {
  return ALL_BOOKS.find(b => b.slug === slug) ?? null;
}

/** 按章节序号取章节 */
export function getChapter(bookSlug: string, chapterIdx: number) {
  const book = getBookBySlug(bookSlug);
  if (!book) return null;
  const chapter = book.chapters[chapterIdx];
  if (!chapter) return null;
  return { book, chapter, chapterIdx };
}

/** 按段落 id 取段落（含书与章节信息）*/
export function getParagraphById(id: string) {
  for (const book of ALL_BOOKS) {
    for (let i = 0; i < book.chapters.length; i++) {
      const ch = book.chapters[i];
      const p = ch.paragraphs.find(p => p.id === id);
      if (p) {
        return { book, chapter: ch, chapterIdx: i, paragraph: p };
      }
    }
  }
  return null;
}

/**
 * 全文搜索
 *
 * 简单子字符串匹配（不分词，对中文 OK）
 * 大小写不敏感、繁简转换暂不支持
 */
export function searchClassics(query: string, limit = 30): SearchHit[] {
  const q = query.trim();
  if (q.length < 1) return [];
  const qFold = fold(q).folded;

  const hits: SearchHit[] = [];
  for (const book of ALL_BOOKS) {
    for (const chapter of book.chapters) {
      for (const p of chapter.paragraphs) {
        // Tìm trong nguyên văn chữ Hán trước, sau đó trong bản dịch tiếng Việt (không phân biệt hoa thường, dấu).
        let source = p.text;
        let idx = p.text.indexOf(q);
        let len = q.length;
        if (idx < 0 && p.translation && qFold) {
          const { folded, map } = fold(p.translation);
          const fi = folded.indexOf(qFold);
          if (fi >= 0) {
            source = p.translation;
            idx = map[fi];
            len = (map[fi + qFold.length] ?? p.translation.length) - idx;
          }
        }
        if (idx < 0) continue;

        // 提取上下文（前后各 40 字）
        const start = Math.max(0, idx - 40);
        const end = Math.min(source.length, idx + len + 40);
        const before = source.slice(start, idx);
        const matched = source.slice(idx, idx + len);
        const after = source.slice(idx + len, end);

        const snippet = (start > 0 ? '…' : '')
          + escapeHtml(before)
          + `<mark>${escapeHtml(matched)}</mark>`
          + escapeHtml(after)
          + (end < source.length ? '…' : '');

        hits.push({
          bookSlug: book.slug,
          bookTitle: book.title,
          chapterTitle: chapter.title,
          paragraphId: p.id,
          snippet,
          text: p.text,
        });

        if (hits.length >= limit) return hits;
      }
    }
  }
  return hits;
}

/** Bỏ dấu + chữ thường để tìm tiếng Việt; `map[i]` = vị trí trong chuỗi gốc của ký tự thứ i sau khi gấp. */
function fold(s: string): { folded: string; map: number[] } {
  let folded = '';
  const map: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const f = s[i].normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
    for (let k = 0; k < f.length; k++) { folded += f[k]; map.push(i); }
  }
  map.push(s.length);
  return { folded, map };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export type { Book, Chapter, Paragraph, SearchHit } from './types';
