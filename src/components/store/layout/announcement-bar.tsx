import React from 'react';
import { settingsService } from '@/services/settings.service';

export default async function AnnouncementBar() {
  const homepage = await settingsService.getByGroup('homepage');
  const raw = homepage.announcementBar || '✨ PAY IN ADVANCE & GET FREE DELIVERY';
  const messages = raw
    .split('|')
    .map((m) => m.trim())
    .filter(Boolean);

  const display = messages.length > 0 ? messages : [raw];
  const items = display.length > 1 ? display : [display[0], display[0]];

  return (
    <div className="announcement-bar-hover relative overflow-hidden bg-[#0D0D0D] text-[#F7F4EF] py-2 text-xs sm:text-sm font-medium tracking-wide select-none">
      <div className="marquee-track whitespace-nowrap flex">
        {Array.from({ length: 2 }).map((_, dup) => (
          <div
            key={dup}
            className="marquee-content flex shrink-0 items-center"
            aria-hidden={dup === 1}
          >
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex items-center">
                {items.map((msg, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-6 sm:px-8">{msg}</span>
                    <span className="text-[#C9A86A]">✦</span>
                  </React.Fragment>
                ))}
              </span>
            ))}
          </div>
        ))}
      </div>
      <style jsx>{`
        .marquee-track {
          animation: marquee var(--marquee-duration, 30s) linear infinite;
          width: max-content;
        }
        :global(.announcement-bar-hover:hover) .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
