'use client';
import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';

/**
 * 命盘页 —— 开源版「排盘引擎 Demo」
 *
 * 这是一个最小可运行示例：用本仓库的排盘引擎 generateChart() 配合基础 UI
 * 组件，渲染一张完整紫微命盘 + 基础解读，并支持本命 / 大限 / 流年切换。
 *
 * 说明：线上商业版的完整交互界面（重设计的新 UI、AI 流式解读、合盘、分享
 * 卡片等）不在开源范围内；但排盘内核——安星算法、四化、格局识别、古籍库——
 * 完全开放（见 lib/ziwei/*），可自由二次开发出你自己的界面。
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [showChart, setShowChart] = useState(true);
  // Điện thoại: không đủ chỗ đặt lá số cạnh khung luận giải → chuyển qua lại bằng tab.
  const [mobileTab, setMobileTab] = useState<'chart' | 'reading'>('chart');

  // ── 未起盘：展示出生信息表单 ──
  if (!chart) {
    return (
      <main className="mx-auto max-w-[720px] px-4 sm:px-5 pt-4 sm:pt-8 pb-12">
        <a href="/" className="inline-flex items-center gap-1.5 text-[13px] mb-6 sm:mb-8" style={{ color: 'var(--t-text2)', textDecoration: 'none' }}>
          ← Trang chủ
        </a>
        <h1 className="text-[24px] sm:text-[28px] font-semibold mb-2 tracking-normal" style={{ color: 'var(--tx-0)' }}>Lập lá số Tử Vi</h1>
        <p className="mb-6 sm:mb-8 text-[14px] leading-[1.75]" style={{ color: 'var(--t-text2)' }}>
          Nhập ngày, tháng, năm và giờ sinh để lập lá số Tử Vi ngay lập tức.
          <br />
          Sau khi lập lá số, bạn có thể đặt câu hỏi cho AI ở khung Hỏi đáp.
        </p>
        <BirthForm onSubmit={(info: BirthInfo) => setChart(generateChart(info))} />
      </main>
    );
  }

  // ── 已起盘：命盘 + 解读 ──
  // Lá số thu nhỏ ở cột trái, có thể ẩn để khung luận giải chiếm cả trang (đọc dễ hơn).
  // ChartBoard chỉ bị ẩn bằng CSS, không unmount, nên giữ nguyên cung đang chọn và chế độ xem.
  return (
    <main className="mx-auto max-w-[1280px] px-3 sm:px-4 pt-3 sm:pt-5 pb-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <button
          type="button"
          onClick={() => { setChart(null); setSelectedPalace(null); }}
          className="text-sm rounded-full sm:rounded-lg px-3 sm:px-3.5 py-2 transition-colors flex-shrink-0"
          style={{ border: '1px solid var(--t-border)', color: 'var(--t-text2)', background: 'transparent' }}
          aria-label="Lập lá số khác"
        >
          ←<span className="hidden sm:inline"> Lập lá số khác</span>
        </button>

        {/* Điện thoại: tab Lá số / Luận giải */}
        <div className="lg:hidden flex flex-1 p-1 rounded-full" role="tablist"
          style={{ background: 'var(--bg-1)', border: '1px solid var(--t-border)' }}>
          {([['chart', 'Lá số'], ['reading', 'Luận giải']] as const).map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={mobileTab === k}
              onClick={() => setMobileTab(k)}
              className="flex-1 py-1.5 rounded-full text-[14px] tracking-[0.01em] transition-colors"
              style={mobileTab === k
                ? { background: 'var(--tx-0)', color: 'var(--bg-0)' }
                : { color: 'var(--t-text2)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Máy tính: ẩn/hiện lá số */}
        <button
          type="button"
          onClick={() => setShowChart(v => !v)}
          aria-expanded={showChart}
          className="hidden lg:inline-flex text-sm rounded-lg px-3.5 py-2 font-medium transition-colors"
          style={{ border: '1px solid rgba(160,129,79,0.35)', color: 'var(--t-gold)', background: 'rgba(160,129,79,0.08)' }}
        >
          {showChart ? '◧ Ẩn lá số' : '◨ Hiện lá số'}
        </button>
        {chart.birthInfo.name && (
          <span className="hidden sm:inline text-sm ml-1 truncate" style={{ color: 'var(--t-faint)' }}>{chart.birthInfo.name}</span>
        )}
      </div>

      <div
        className={showChart
          ? 'grid grid-cols-1 lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)] gap-5 items-start'
          : 'grid grid-cols-1 gap-5 items-start lg:max-w-[880px] mx-auto'}
      >
        <div className={[
          'min-w-0',
          mobileTab === 'chart' ? '' : 'hidden',
          showChart ? 'lg:block' : 'lg:hidden',
        ].join(' ')}>
          <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
          <button type="button" onClick={() => setMobileTab('reading')}
            className="lg:hidden mt-4 w-full py-3 rounded-full text-[14px] tracking-[0.02em]"
            style={{ background: 'var(--tx-0)', color: 'var(--bg-0)' }}>
            Xem luận giải →
          </button>
        </div>
        <div className={`min-w-0 lg:sticky lg:top-4 ${mobileTab === 'reading' ? '' : 'hidden'} lg:block`}>
          <InsightPanel chart={chart} selectedPalace={selectedPalace} />
        </div>
      </div>
    </main>
  );
}
