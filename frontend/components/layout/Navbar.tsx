import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const navigation = [
  { name: 'בית', href: '/' },
  { name: 'אודות', href: '/about' },
  { name: 'לוח אירועים', href: '/events' },
  { name: 'זמני תפילה', href: '/prayer-times' },
  { name: 'צור קשר', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600 font-hebrew">
                בית הכנסת
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-8 space-x-reverse rtl">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'inline-flex items-center px-1 pt-1 text-sm font-medium',
                  pathname === item.href
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
