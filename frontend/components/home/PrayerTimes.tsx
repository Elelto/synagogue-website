import { useQuery } from 'react-query'
import axios from 'axios'

interface PrayerTime {
  name: string
  time: string
}

export function PrayerTimes() {
  const { data: prayerTimes, isLoading } = useQuery<PrayerTime[]>(
    'prayerTimes',
    async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/prayer-times`)
      return response.data
    }
  )

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 font-hebrew">זמני תפילה להיום</h2>
      <div className="space-y-4">
        {prayerTimes?.map((prayer, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="font-hebrew">{prayer.name}</span>
            <span className="font-mono">{prayer.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
