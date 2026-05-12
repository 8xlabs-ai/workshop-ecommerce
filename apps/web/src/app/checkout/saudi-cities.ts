export interface CityOption {
  value: string;
  label: string;
}

export const DISCOUNT_CITY = 'jeddah';
export const DISCOUNT_PERCENT = 0.1;

export const SAUDI_CITIES: CityOption[] = [
  { value: 'riyadh', label: 'Riyadh' },
  { value: 'jeddah', label: 'Jeddah' },
  { value: 'makkah', label: 'Makkah' },
  { value: 'madinah', label: 'Madinah' },
  { value: 'dammam', label: 'Dammam' },
  { value: 'khobar', label: 'Khobar' },
  { value: 'dhahran', label: 'Dhahran' },
  { value: 'taif', label: 'Taif' },
  { value: 'tabuk', label: 'Tabuk' },
  { value: 'buraidah', label: 'Buraidah' },
  { value: 'khamis-mushait', label: 'Khamis Mushait' },
  { value: 'abha', label: 'Abha' },
  { value: 'hail', label: 'Hail' },
  { value: 'najran', label: 'Najran' },
  { value: 'yanbu', label: 'Yanbu' },
  { value: 'jubail', label: 'Jubail' },
  { value: 'al-hofuf', label: 'Al Hofuf' },
  { value: 'hafar-al-batin', label: 'Hafar Al-Batin' },
  { value: 'qatif', label: 'Qatif' },
  { value: 'ar-rass', label: 'Ar Rass' },
  { value: 'sakaka', label: 'Sakaka' },
];
