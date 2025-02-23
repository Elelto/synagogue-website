import { Contact } from '../../components/contact/Contact';

export const metadata = {
  title: 'צור קשר - בית הכנסת חזון יוסף',
  description: 'צור קשר עם בית הכנסת חזון יוסף',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20">
      <Contact />
    </div>
  );
}
