import Link from 'next/link';
import { FaWhatsapp, FaMapMarkerAlt, FaPhone, FaWaze } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-white to-[#87CEEB] shadow-lg py-2 px-4 z-50 border-t border-[#1E6B87]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Contact Section */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-[#1E6B87] font-medium text-sm mb-1">צור קשר</h3>
            <div className="flex justify-center sm:justify-start items-center space-x-4 rtl:space-x-reverse">
              <Link 
                href="https://wa.me/+972000000000" 
                target="_blank"
                className="flex items-center text-green-600 hover:text-green-700 transition-colors gap-1"
              >
                <FaWhatsapp className="text-base" />
                <span className="text-xs">וואטסאפ</span>
              </Link>
              <Link 
                href="mailto:contact@synagogue.com"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors gap-1"
              >
                <MdEmail className="text-base" />
                <span className="text-xs">אימייל</span>
              </Link>
              <Link 
                href="tel:+972000000000"
                className="flex items-center text-gray-600 hover:text-gray-700 transition-colors gap-1"
              >
                <FaPhone className="text-base" />
                <span className="text-xs">טלפון</span>
              </Link>
            </div>
          </div>

          {/* Location Section */}
          <div className="flex flex-col items-center sm:items-end">
            <h3 className="text-[#1E6B87] font-medium text-sm mb-1">כתובת</h3>
            <div className="flex justify-center sm:justify-end items-center space-x-4 rtl:space-x-reverse">
              <div className="flex items-center text-gray-600 gap-1">
                <FaMapMarkerAlt className="text-base" />
                <span className="text-xs">רחוב בעל התניא 26, בני ברק</span>
              </div>
              <Link 
                href="https://www.waze.com/ul?ll=32.0879,34.8350&navigate=yes"
                target="_blank"
                className="flex items-center text-blue-500 hover:text-blue-600 transition-colors gap-1"
              >
                <FaWaze className="text-base" />
                <span className="text-xs">Waze</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full text-center pt-1 mt-1 border-t border-[#1E6B87]/20 text-gray-500 text-[10px]">
          &copy; {new Date().getFullYear()} כל הזכויות שמורות לבית המדרש
        </div>
      </div>
    </footer>
  );
};

export default Footer;
