import type { DevicePriority, DeviceStatus } from '@/types';
import faJson from '@/locales/fa-correct.json';

const legacyFaShape = {
  brand: 'مرکز پایش هوشمند',
  pages: {
    map: 'نقشه زنده تجهیزات',
    devices: 'مدیریت درگاه‌ها',
    alerts: 'مرکز هشدارها',
  },
  nav: {
    map: 'نقشه زنده',
    devices: 'درگاه‌ها',
    alerts: 'هشدارها',
    settings: 'تنظیمات',
    collapse: 'جمع‌کردن منو',
  },
  connection: {
    connecting: 'در حال اتصال',
    connected: 'متصل',
    reconnecting: 'اتصال مجدد',
    offline: 'قطع ارتباط',
  },
  common: { view: 'مشاهده', retry: 'تلاش دوباره', page: 'صفحه', of: 'از' },
  map: {
    network: 'شبکه درگاه‌ها',
    visible: 'تجهیز قابل مشاهده',
    all: 'همه تجهیزات',
    attention: 'نیازمند بررسی',
    empty: 'درگاهی با این مشخصات پیدا نشد',
    loading: 'در حال اتصال به شبکه درگاه‌ها…',
    loadError: 'دریافت اطلاعات درگاه‌ها ناموفق بود',
    search: 'جست‌وجوی درگاه، شناسه یا ساختمان…',
  },
  kpi: {
    total: 'کل درگاه‌ها',
    totalHint: 'در ۲۴ ساختمان',
    online: 'درگاه‌های آنلاین',
    availability: 'دردسترس‌بودن',
    urgent: 'هشدار فوری',
    urgentHint: 'نیازمند اقدام سریع',
    faults: 'خطای فنی',
    faultsHint: 'در حال بررسی',
  },
  fleet: {
    title: 'فهرست درگاه‌ها',
    subtitle: 'وضعیت عملیاتی زنده',
    allStatus: 'همه وضعیت‌ها',
    allPriority: 'همه اولویت‌ها',
    noResult: 'درگاهی مطابق فیلترها پیدا نشد',
    showing: 'نمایش',
    gateway: 'درگاه',
    building: 'ساختمان',
    status: 'وضعیت',
    priority: 'اولویت',
    battery: 'باتری',
    signal: 'قدرت سیگنال',
    temperature: 'دما',
    lastSeen: 'آخرین ارتباط',
    search: 'جست‌وجوی نام، شناسه یا ساختمان…',
  },
  details: {
    notFound: 'درگاه موردنظر پیدا نشد',
    back: 'بازگشت به فهرست',
    testAlarm: 'آزمایش هشدار',
    testFault: 'آزمایش خطا',
    resolve: 'رفع همه هشدارها',
    liveTemp: 'دمای لحظه‌ای',
    history: 'تاریخچه محدود سمت کاربر، ۴۰ داده اخیر',
    operational: 'وضعیت عملیاتی',
    connectivity: 'ارتباط',
    technicalFault: 'خطای فنی',
    urgentAlarm: 'هشدار فوری',
    acSupply: 'برق شهری',
    detected: 'شناسایی شد',
    clear: 'عادی',
    active: 'فعال',
    available: 'متصل',
    unavailable: 'قطع',
    disconnect: 'قطع ارتباط',
    reconnect: 'اتصال مجدد',
    powerFailure: 'قطع برق',
    healthy: 'سالم',
    failed: 'قطع',
    battery: 'باتری',
    signal: 'قدرت سیگنال',
    temperature: 'دما',
  },
  alerts: {
    title: 'مرکز هشدارها',
    subtitle: 'رخدادهای فعال و اخیراً رفع‌شده',
    empty: 'هشداری ثبت نشده است؛ شبکه در وضعیت عادی قرار دارد.',
    inspect: 'بررسی درگاه',
    opened: 'ثبت‌شده',
    resolved: 'رفع‌شده',
  },
  status: { online: '', offline: '', normal: '', warning: '', urgent: '' },
  events: {
    urgent_alarm: '', technical_fault: '', power_failure: '', disconnect: '', reconnect: '', resolve_alarm: ''
  },
} as const;
export const fa = faJson as typeof legacyFaShape;
export const faNumber = (value: number | string, options?: Intl.NumberFormatOptions) =>
  typeof value === 'number'
    ? new Intl.NumberFormat('fa-IR', options).format(value)
    : value.replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
export const statusLabel = (value: DeviceStatus | DevicePriority) =>
  fa.status[value];
/*
  ({
    online: 'آنلاین',
    offline: 'آفلاین',
    normal: 'عادی',
    warning: 'هشدار',
    urgent: 'فوری',
  })[value]; */
export const legacyEventLabel: Record<string, string> = {
  urgent_alarm: 'هشدار فوری',
  technical_fault: 'خطای فنی',
  power_failure: 'قطع برق',
  disconnect: 'قطع ارتباط',
  reconnect: 'اتصال مجدد',
  resolve_alarm: 'رفع هشدار',
};
export const eventLabel: Record<string, string> = fa.events;
