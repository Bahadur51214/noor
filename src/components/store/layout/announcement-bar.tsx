import React from 'react';
import { settingsService } from '@/services/settings.service';

export default async function AnnouncementBar() {
  const homepage = await settingsService.getByGroup('homepage');
  const announcement =
    homepage.announcementBar || "✨ PAY IN ADVANCE & GET FREE DELIVERY";

  return (
    <div className="bg-[#0D0D0D] text-[#F7F4EF] px-4 py-2 text-center text-xs sm:text-sm font-medium tracking-wide">
      {announcement}
    </div>
  );
}
