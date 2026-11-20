/**
 * Tranh thủy mặc vẽ bằng SVG: trăng tròn vải lụa, núi xa nhiều lớp, mây cuộn, mặt trời son.
 * Thuần trang trí, không bắt sự kiện chuột.
 */
export default function InkScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 640" className={className} aria-hidden="true" preserveAspectRatio="xMaxYMid slice">
      <defs>
        <pattern id="ink-linen" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 3h6M3 0v6" stroke="#B9B1A4" strokeWidth="0.5" opacity="0.45" />
        </pattern>
        <radialGradient id="ink-moon" cx="40%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#E6E0D6" />
          <stop offset="100%" stopColor="#CFC7BA" />
        </radialGradient>
        <linearGradient id="ink-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9C958A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#9C958A" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ink-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6E675D" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#8E877C" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8E877C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ink-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A443C" stopOpacity="0.8" />
          <stop offset="80%" stopColor="#7A7368" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#7A7368" stopOpacity="0" />
        </linearGradient>
        <filter id="ink-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="9" />
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      {/* Trăng */}
      <circle cx="360" cy="220" r="165" fill="url(#ink-moon)" />
      <circle cx="360" cy="220" r="165" fill="url(#ink-linen)" />

      {/* Mây cuộn */}
      <g fill="none" stroke="#8A8378" strokeWidth="1.4" strokeLinecap="round" opacity="0.75">
        <g transform="translate(150 70)">
          <path d="M120 300c-30 0-46-22-36-42 9-18 36-18 44-2 6 12-3 26-16 24" />
          <path d="M128 300c40 0 70-6 110-20 30-10 60-12 90-6" />
          <path d="M96 318c50 6 110 4 170-6" opacity="0.6" />
        </g>
        <path d="M430 410c26 0 40-20 30-38-9-15-32-14-38 0-5 11 3 22 14 20" />
        <path d="M424 410c-40 2-90-2-140 6" />
        <path d="M470 428c-50 6-120 6-190 2" opacity="0.55" />
      </g>

      {/* Núi xa */}
      <path filter="url(#ink-soft)" fill="url(#ink-far)"
        d="M0 470 C60 440 90 420 130 430 C170 400 200 360 240 380 C270 350 300 330 330 360 C370 340 400 380 440 370 C480 350 520 360 600 400 L600 640 L0 640Z" />
      {/* Núi giữa */}
      <path filter="url(#ink-soft)" fill="url(#ink-mid)"
        d="M220 640 C260 560 300 520 340 500 C360 470 380 440 410 430 C430 410 450 390 470 400 C490 380 520 400 540 430 C560 450 580 470 600 480 L600 640Z" />
      {/* Núi gần */}
      <path filter="url(#ink-soft)" fill="url(#ink-near)"
        d="M330 640 C380 600 410 580 450 560 C470 530 490 500 510 505 C530 480 555 470 575 490 C590 500 600 520 600 530 L600 640Z" />

      {/* Mặt trời son */}
      <circle cx="505" cy="560" r="22" fill="#C2553A" opacity="0.85" />

      {/* Sương phủ chân núi */}
      <rect x="0" y="560" width="600" height="80" fill="#F3EEE5" opacity="0.55" />
    </svg>
  );
}
