'use client';

import { Contact } from '../../components/contact/Contact';
import { ScrollAnimation } from '@/components/shared/ScrollAnimation';

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20">
      <ScrollAnimation direction="up" delay={0.3}>
        <Contact />
      </ScrollAnimation>
    </div>
  );
}
