import { useQuery } from 'react-query'
import axios from 'axios'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
}

export function UpcomingEvents() {
  const { data: events, isLoading } = useQuery<Event[]>(
    'upcomingEvents',
    async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events`)
      return response.data
    }
  )

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 font-hebrew">אירועים קרובים</h2>
      <div className="space-y-6">
        {events?.map((event) => (
          <div key={event.id} className="border-b border-gray-200 pb-4 last:border-0">
            <h3 className="text-lg font-semibold mb-2 font-hebrew">{event.title}</h3>
            <p className="text-gray-600 mb-2">{event.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{format(new Date(event.date), 'EEEE, d בMMMM', { locale: he })}</span>
              <span>{event.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
