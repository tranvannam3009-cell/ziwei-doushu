'use client';
import { motion } from 'framer-motion';
import type { Palace, Star } from '@/lib/ziwei/types';
import { viName, SIHUA_VI, stemVi, branchVi } from '@/lib/i18n/vi';
import clsx from 'clsx';

interface ShierShenDisplay {
  boshi: string;
  jiangQian: string;
  suiQian: string;
}

interface PalaceCellProps {
  palace: Palace;
  shierShen?: ShierShenDisplay;
  onClick?: () => void;
  onStarClick?: (star: Star) => void;
  isSelected?: boolean;
  isSanFang?: boolean;
  delay?: number;
  /** 叠加四化：星名 → 四化类型（'禄'/'权'/'科'/'忌'） */
  overlayStarSiHua?: Record<string, string>;
  /** 叠加标签：'年'（流年）或 '限'（大限） */
  overlayLabel?: string;
  /** 点击叠加四化 badge 回调 */
  onSiHuaClick?: (starName: string, siHua: string) => void;
}

const SIHUA_STYLES: Record<string, string> = {
  '禄': 'text-[#3F7A52] bg-[#3F7A52]/10 border-[#3F7A52]/30',
  '权': 'text-[#2F5C8F] bg-[#2F5C8F]/10 border-[#2F5C8F]/30',
  '科': 'text-[#8A7018] bg-[#8A7018]/10 border-[#8A7018]/30',
  '忌': 'text-[#A83A2C] bg-[#A83A2C]/10 border-[#A83A2C]/30',
};

const SiHuaBadge = ({
  siHua,
  overlay,
  label,
  onClick,
}: {
  siHua: string;
  overlay?: boolean;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center text-[8px] px-1 rounded-full border leading-none py-px font-bold ml-1 flex-shrink-0',
        SIHUA_STYLES[siHua],
        overlay && 'border-dashed opacity-80',
        onClick && 'cursor-pointer hover:opacity-100',
      )}
      onClick={onClick}
    >
      {overlay && label && <span className="mr-px opacity-70">{label}</span>}
      {SIHUA_VI[siHua] ?? siHua}
    </span>
  );
};

export default function PalaceCell({
  palace, onClick, onStarClick, isSelected, isSanFang, delay = 0,
  overlayStarSiHua, overlayLabel, onSiHuaClick, shierShen,
}: PalaceCellProps) {
  const { branch, stem, name, stars, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;
  const ganzhi = `${stemVi(stem)} ${branchVi(branch)}`;

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');
  const minorStars = stars.filter(s => s.type === 'minor');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      onClick={onClick}
      className="palace-cell-v relative flex flex-col p-1.5 cursor-pointer transition-all duration-200 h-full"
      style={{
        minHeight: '90px',
        background: isCurrentDaXian
          ? 'rgba(160,129,79,0.08)'
          : isSelected
          ? 'rgba(47,92,143,0.18)'
          : isSanFang
          ? 'rgba(47,92,143,0.09)'
          : isMingGong
          ? 'rgba(160,129,79,0.04)'
          : 'var(--t-bg)',
        boxShadow: isCurrentDaXian
          ? 'inset 3px 0 0 rgba(160,129,79,0.5)'
          : isSelected
          ? 'inset 0 0 0 1.5px rgba(47,92,143,0.7)'
          : isSanFang
          ? 'inset 0 0 0 1px rgba(47,92,143,0.4)'
          : 'none',
      }}
    >
      {/* 大限年龄 */}
      {daXianAge && (
        <div className={clsx(
          'absolute top-1 right-1 text-[8px] sm:text-[9px] font-mono tabular-nums',
          isCurrentDaXian ? 'text-[#8A6D3F]' : ''
        )}
          style={!isCurrentDaXian ? { color: 'var(--t-faint)', opacity: 0.75 } : undefined}
        >
          {daXianAge[0]}–{daXianAge[1]}
        </div>
      )}

      {/* 宫名行 */}
      <div className="flex items-center gap-1 mb-0.5 pr-7 sm:pr-8 min-w-0">
        <span className={clsx('text-[10px] font-medium sm:tracking-wide leading-tight',
          isMingGong ? 'text-[#B5482F]' : isShenGong ? 'text-[#2F5C8F]' : ''
        )}
          style={!isMingGong && !isShenGong ? { color: 'var(--t-faint)' } : undefined}
        >
          {viName(name)}
        </span>
        {isMingGong && (
          <span className="hidden sm:inline text-[7px] text-[#B5482F] border border-[#B5482F]/40 px-0.5 rounded leading-tight">Mệnh</span>
        )}
        {isShenGong && (
          <span className="hidden sm:inline text-[7px] text-[#2F5C8F] border border-[#2F5C8F]/40 px-0.5 rounded leading-tight">Thân</span>
        )}
      </div>

      {/* 干支 */}
      <div className="text-[9px] font-mono mb-1" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>{ganzhi}</div>

      {/* 主星 */}
      <div className="flex flex-col gap-0.5 flex-1">
        {majorStars.length === 0 && (
          <span className="text-[10px] italic" style={{ color: 'var(--t-faint)', opacity: 0.6 }}>Vô chính diệu</span>
        )}
        {majorStars.map((star) => {
          const overlaySiHua = overlayStarSiHua?.[star.name];
          return (
            <div
              key={star.name}
              className="flex items-center"
              onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
            >
              <span className={clsx(
                'text-[12px] sm:text-[13px] leading-tight font-bold tracking-tight cursor-pointer hover:opacity-70 transition-all',
                star.brightness === 'bright' ? 'text-[#1F1C18]' : star.brightness === 'dim' ? 'text-[#8C8478]' : 'text-[#4A443C]',
              )}>
                {viName(star.name)}
              </span>
              {star.siHua && <SiHuaBadge siHua={star.siHua} />}
              {overlaySiHua && (
                <SiHuaBadge
                  siHua={overlaySiHua}
                  overlay
                  label={overlayLabel}
                  onClick={e => {
                    e.stopPropagation();
                    onSiHuaClick?.(star.name, overlaySiHua);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 吉星 */}
      {luckyStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1 mt-0.5">
          {luckyStars.map(s => {
            const overlaySiHua = overlayStarSiHua?.[s.name];
            return (
              <span key={s.name} className="inline-flex items-center text-[9px] text-[#8A6D3F] leading-tight">
                {viName(s.name)}
                {s.siHua && <SiHuaBadge siHua={s.siHua} />}
                {overlaySiHua && (
                  <SiHuaBadge
                    siHua={overlaySiHua}
                    overlay
                    label={overlayLabel}
                    onClick={e => {
                      e.stopPropagation();
                      onSiHuaClick?.(s.name, overlaySiHua);
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* 煞星 */}
      {shaStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1">
          {shaStars.map(s => (
            <span key={s.name} className="text-[9px] text-[#B5482F]/75 leading-tight">
              {viName(s.name)}{s.siHua && <SiHuaBadge siHua={s.siHua} />}
            </span>
          ))}
        </div>
      )}

      {/* 杂曜 */}
      {minorStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1">
          {minorStars.map(s => (
            <span key={s.name} className="text-[9px] leading-tight" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>
              {viName(s.name)}{s.brightnessRaw ? `[${viName(s.brightnessRaw)}]` : ''}{s.siHua && <SiHuaBadge siHua={s.siHua} />}
            </span>
          ))}
        </div>
      )}

      {/* 宫底左下角竖排：博士、将前、岁前；三组数据均由 ChartBoard 按当前视图计算。 */}
      {shierShen && (
        <div
          className="flex flex-col items-start mt-1 pt-0.5 text-[8px] leading-tight"
          style={{ borderTop: '1px dashed var(--t-border)', color: 'var(--t-faint)' }}
        >
          <span data-shier-shen="boshi" className="text-violet-500/70">{viName(shierShen.boshi)}</span>
          <span data-shier-shen="jiangQian">{viName(shierShen.jiangQian)}</span>
          <span data-shier-shen="suiQian">{viName(shierShen.suiQian)}</span>
        </div>
      )}

    </motion.div>
  );
}
