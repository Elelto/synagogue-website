import { Schedule } from '@/components/schedule/Schedule';

export const metadata = {
  title: 'זמני תפילות - בית הכנסת חזון יוסף',
  description: 'זמני תפילות בבית הכנסת חזון יוסף',
};

export default function SchedulePage() {
  return (
    <div className="min-h-screen py-20">
      <Schedule />
    </div>
  );
}
