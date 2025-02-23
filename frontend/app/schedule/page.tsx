'use client';

import { Schedule } from '@/components/schedule/Schedule';
import { ScrollAnimation } from '@/components/shared/ScrollAnimation';

export default function SchedulePage() {
  return (
    <div className="min-h-screen py-20">
      <ScrollAnimation direction="up" delay={0.3}>
        <Schedule />
      </ScrollAnimation>
    </div>
  );
}
