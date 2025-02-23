import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-center space-x-6 z-50">
      <Link 
        href="https://wa.me/+972000000000" 
        target="_blank"
        className="flex items-center text-green-600 hover:text-green-700 transition-colors"
      >
        <FaWhatsapp className="text-2xl" />
        <span className="mr-2">WhatsApp</span>
      </Link>
      <Link 
        href="mailto:contact@synagogue.com"
        className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
      >
        <MdEmail className="text-2xl" />
        <span className="mr-2">צור קשר</span>
      </Link>
    </footer>
  );
};

export default Footer;
