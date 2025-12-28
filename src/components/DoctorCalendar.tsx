import React, { useEffect, useState } from "react";
import type { Consultation } from "../models/Consultations";
import {
  addConsultation,
  getConsultations,
  updateConsultationStatus,
} from "../services/consultationsService";
import {
  CONSULTATION_COLORS,
  CONSULTATION_TEXT_COLOR,
} from "../constants/consultationStyles";
import { currentUser } from "../context/currentUser";

const hours = Array.from({ length: 12 }, (_, i) => 8 * 60 + i * 30);
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// const getDayIndex = (date: string) => {
//   const d = new Date(date);
//   return (d.getDay() + 6) % 7;
// };

const isSameDay = (a: Date, b: Date) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};
const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
const minutesToTime = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
const dayToYmd = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getStartOfTheWeek = (date: Date) => {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d;
};

const isPastSlot = (date: Date, min: number) => {
  const slotTime = new Date(date);
  slotTime.setHours(Math.floor(min / 60), min % 60, 0, 0);
  return slotTime < new Date();
};
const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isFinished = (c: Consultation) => {
  const now = new Date();
  const start = new Date(`${c.date}T${c.startTime}`);
  return start < now;
};

const getEffectiveStatus = (c: Consultation): Consultation["status"] => {
  if (c.status === "reserved" && isFinished(c)) {
    return "finished";
  }
  return c.status;
};

export const DoctorCalendar = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [currentWeekStart, setCurrentWeek] = useState<Date>(
    getStartOfTheWeek(new Date())
  );
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    startTime: string;
  } | null> (null);

  const weekDates: Date[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    getConsultations().then(setConsultations);
  }, []);

  const getConsultationForSlot = (dayIndex: number, minute: number) => {
    const slotDate = weekDates[dayIndex];

    return consultations.find((c) => {
      const start = timeToMinutes(c.startTime);
      const cDate = new Date(c.date);
      return start === minute && isSameDay(cDate, slotDate);
    });
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => {
            setCurrentWeek((prev) => {
              const d = new Date(prev);
              d.setDate(d.getDate() - 7);
              return d;
            });
          }}
        >
          Previous week
        </button>
        <button
          onClick={() => {
            setCurrentWeek((prev) => {
              const d = new Date(prev);
              d.setDate(d.getDate() + 7);
              return d;
            });
          }}
        >
          Next week
        </button>
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "80px repeat(7, 1fr)" }}
      >
        <div />
        {weekDates.map((date, index) => {
          const today = isToday(date);

          return (
            <div
              key={date.getTime()}
              style={{
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: today ? "#e3f2fd" : "transparent",
                padding: 10,
              }}
            >
              <div>{days[index]}</div>
              <div style={{ fontSize: 12 }}>
                {date.getDate()}.{date.getMonth() + 1}
              </div>
            </div>
          );
        })}

        {hours.map((min) => (
          <React.Fragment key={min}>
            <div>
              {Math.floor(min / 60)}:{String(min % 60).padStart(2, "0")}
            </div>

            {days.map((day, index) => {
              const c = getConsultationForSlot(index, min);
              const status = c ? getEffectiveStatus(c) : "free";
              return (
                <div
                  key={day + min}
                  onClick={async () => {
                    if (isPastSlot(weekDates[index], min)) return;
                    if (c && currentUser.role === "patient"){
                        await updateConsultationStatus(c.id!, "cancelled");
                    };
                    if(c && currentUser.role === "doctor"){
                        await updateConsultationStatus(c.id!, "finished");
                    }
                    const date = weekDates[index];
                    const dateStr = dayToYmd(date);
                    const timeStr = minutesToTime(min);
                    const ok = window.confirm(
                      `Make a reservation for: ${dateStr} ${timeStr}?`
                    );
                    if (!ok) return;
                    await addConsultation({
                      doctorId: "doc1",
                      patientId: currentUser.role === "patient" ? currentUser.id : undefined,
                      date: dateStr,
                      startTime: timeStr,
                      durationInMin: 30,
                      type: "firstVisit",
                      status: "reserved",
                    });
                    const updated = await getConsultations();
                    setConsultations(updated);
                  }}
                  style={{
                    border: "1px solid #ccc",
                    height: 40,
                    backgroundColor: CONSULTATION_COLORS[status],
                    color: CONSULTATION_TEXT_COLOR[status],
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: status === "cancelled" ? 0.6 : 1,
                  }}
                >
                  {c ? c.type : ""}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
