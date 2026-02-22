export interface Masjid {
  id: string
  name: string
  address: string
  type: string
  lat: number
  lng: number
  phone?: string
  prayerTimes?: string
}

export const MASJIDS: Masjid[] = [
  {
    id: '1',
    name: 'Queenstown Jama Masjid',
    address: 'Queenstown, Georgetown',
    type: 'Sunni',
    lat: 6.8100,
    lng: -58.1600,
    prayerTimes: 'All 5 daily prayers',
  },
  {
    id: '2',
    name: 'Masjid Al-Noor',
    address: 'Alexander Village, Georgetown',
    type: 'Sunni',
    lat: 6.7950,
    lng: -58.1520,
    prayerTimes: 'All 5 daily prayers',
  },
  {
    id: '3',
    name: 'Central Islamic Organisation Masjid',
    address: 'Woolford Ave, Georgetown',
    type: 'Sunni',
    lat: 6.8085,
    lng: -58.1555,
    prayerTimes: 'All 5 daily prayers + Jumu\'ah',
  },
  {
    id: '4',
    name: 'Masjid-ur-Rahman',
    address: 'Kitty, Georgetown',
    type: 'Sunni',
    lat: 6.8150,
    lng: -58.1450,
    prayerTimes: 'All 5 daily prayers',
  },
  {
    id: '5',
    name: 'Albouystown Masjid',
    address: 'Albouystown, Georgetown',
    type: 'Sunni',
    lat: 6.7980,
    lng: -58.1620,
    prayerTimes: 'All 5 daily prayers',
  },
  {
    id: '6',
    name: 'Georgetown Ahmadiyya Mosque',
    address: 'Ogle, East Coast Demerara',
    type: 'Ahmadiyya',
    lat: 6.8080,
    lng: -58.1050,
  },
  {
    id: '7',
    name: 'Masjid At-Taqwa',
    address: 'Campbellville, Georgetown',
    type: 'Sunni',
    lat: 6.8060,
    lng: -58.1500,
    prayerTimes: 'All 5 daily prayers',
  },
  {
    id: '8',
    name: 'Turkeyen Islamic Centre',
    address: 'Turkeyen, Greater Georgetown',
    type: 'Sunni',
    lat: 6.8120,
    lng: -58.0920,
    prayerTimes: 'All 5 daily prayers + Jumu\'ah',
  },
]
