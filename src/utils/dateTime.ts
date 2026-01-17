
export const SLOT_MIN = 30;

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const minutesToTime = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const getStartOfTheWeek = (date: Date) => {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // pon=0
  d.setDate(d.getDate() - day);
  return d;
};

export const isToday = (date: Date) => {
  const t = new Date();
  return (
    date.getDate() === t.getDate() &&
    date.getMonth() === t.getMonth() &&
    date.getFullYear() === t.getFullYear()
  );
};

export const getCurrentTimeInMin = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

