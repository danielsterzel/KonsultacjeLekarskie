import type { Consultation } from "../models/Consultations";
import {
  timeToMinutes,
  isToday,
  getCurrentTimeInMin,
  isSameDay,
  SLOT_MIN,
} from "./dateTime";


export const isStartSlot = (c: Consultation, minute: number) => {
  return timeToMinutes(c.startTime) === minute;
};

export const isCurrentSlot = (date: Date, min: number, slotSize = SLOT_MIN) => {
  if (!isToday(date)) return false;

  const nowMin = getCurrentTimeInMin();
  return nowMin >= min && nowMin < min + slotSize;
};

//  visit count
export const countConsultationsForDay = (consultations : Consultation[], date: Date) => {
  return consultations.filter((c) => {
    if (c.status === "cancelled") return false;

    const cDate = new Date(c.date);
    return isSameDay(cDate, date);
  }).length;
};

export const isPastSlot = (date: Date, minute: number) => {
  const slotTime = new Date(date);
  slotTime.setHours(
    Math.floor(minute / 60),
    minute % 60,
    0,
    0
  );

  return slotTime < new Date();
};
