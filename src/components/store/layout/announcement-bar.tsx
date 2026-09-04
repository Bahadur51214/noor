import React from 'react';
import { settingsService } from '@/services/settings.service';

export default async function AnnouncementBar() {
  const homepage = await settingsService.getByGroup('homepage');
  const raw = homepage.announcementBar || '✨ PAY IN ADVANCE & GET FREE DELIVERY';
  const messages = raw
    .split('|')
    .map((m) => m.trim())
    .filter(Boolean);

  const items = messages.length > 0 ? messages : [raw];

  return (
    <div className="announcement-bar relative overflow-hidden bg-[#0D0D0D] text-[#F7F4EF] py-2 text-xs sm:text-sm font-medium tracking-wide select-none">
      <div className="marquee-track flex w-max whitespace-nowrap">
        {Array.from({ length: 2 }).map((_, dup) => (
          <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
            {Array.from({ length: 3 }).map((_, i) => (
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
    </div>
  );
}
