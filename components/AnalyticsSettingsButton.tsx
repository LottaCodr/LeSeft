'use client';
import { Button } from '@/components/ui/button';

export default function AnalyticsSettingsButton() {
  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      className="h-auto min-h-8 p-0 text-[12px] font-semibold text-[#bed0c2] hover:text-white"
      onClick={() => window.dispatchEvent(new Event('open-analytics-settings'))}
    >
      Analytics choices
    </Button>
  );
}
