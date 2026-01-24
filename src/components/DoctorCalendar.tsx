import React, { useEffect, useMemo, useState } from "react";

import type { Consultation, ConsultationType } from "../models/Consultations";
import {
  addConsultation,
  updateConsultationStatus,
  updateConsultation,
  subscribeToConsultationsChanges,
} from "../services/consultationsService";

import { useAuth } from "../components/AuthContext";
import type { Doctor } from "../models/Doctor";
import {
  SLOT_MIN,
  timeToMinutes,
  minutesToTime,
  isToday,
  getStartOfTheWeek,
  isSameDay,
} from "../utils/dateTime";

import {
  isStartSlot,
  isCurrentSlot,
  countConsultationsForDay,
  isPastSlot,
} from "../utils/calendar";
import { getDoctors } from "../services/doctorService";
import {
  getConsultationBgColor,
  askForDuration,
  SLOT_PX,
} from "../utils/consultationUI";

import { CONSULTATION_TEXT_COLOR } from "../constants/consultationStyles";

const buttonStyle: React.CSSProperties = {
  padding: "6px 14px",
  borderRadius: 8,
  border: "none",
  background: "#2ec4b6",
  color: "white",
  cursor: "pointer",
  fontSize: 13,
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#2f80ed",
};

const smallButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  padding: "3px 8px",
  fontSize: 10,
};

// 6h domyślnie: 12 slotów po 30 min, od 8:00
const hours = Array.from({ length: 12 }, (_, i) => 12 * 60 + i * SLOT_MIN);
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const isFinished = (c: Consultation) => {
  const now = new Date();
  const start = new Date(`${c.date}T${c.startTime}`);
  return start < now;
};

const askForDoctor = (doctors: Doctor[]): Doctor | undefined => {
  if (doctors.length === 0) {
    alert("No doctors available");
    return;
  }
  const options = doctors.map((d, i) => `${i + 1}. ${d.name}`).join("\n");

  const choice = prompt(`Choose doctor:\n ${options}`);
  const index = Number(choice) - 1;

  if (!doctors[index]) {
    alert("invalid doctor choice");
    return undefined;
  }
  return doctors[index];
};

const getEffectiveStatus = (c: Consultation): Consultation["status"] => {
  if (c.status === "reserved" && isFinished(c)) return "finished";
  return c.status;
};

export const DoctorCalendar = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [currentWeekStart, setCurrentWeek] = useState<Date>(
    getStartOfTheWeek(new Date()),
  );
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const { user, profile } = useAuth();
  const weekDates: Date[] = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentWeekStart]);
  useEffect(() => {
    getDoctors().then(setDoctors);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToConsultationsChanges(setConsultations);
    return unsubscribe;
  }, []);

  // ---- core helpers (refactor) ----

  const getConsultationForSlot = (dayIndex: number, minute: number) => {
    const slotDate = weekDates[dayIndex];

    return consultations.find((c) => {
      // anulowane nie mają blokować slotów
      if (c.status === "cancelled") return false;

      const cDate = new Date(c.date);
      if (!isSameDay(cDate, slotDate)) return false;

      const start = timeToMinutes(c.startTime);
      const end = start + c.durationInMin;

      // multi-slot: slot należy do wizyty jeśli mieści się w [start, end)
      return minute >= start && minute < end;
    });
  };

  // =================== slot interacations ===================

  const handleExistingConsultationClick = async (c: Consultation) => {
    if (
      profile?.role === "patient" &&
      c.status === "reserved" &&
      c.patientId === user.uid
    ) {
      const ok = window.confirm("Cancel the consultation?");
      if (!ok) return;
      await updateConsultationStatus(c.id!, "cancelled");
      return;
    }

    if (
      profile?.role === "doctor" &&
      c.status === "reserved" &&
      c.doctorId === user.uid
    ) {
      const ok = window.confirm("Mark the visit as finished?");
      if (!ok) return;
      await updateConsultationStatus(c.id!, "finished");
    }
  };

  const collectPatientDetails = () => {
    const name = window.prompt("Patient name:");
    if (!name) return null;

    const ageStr = window.prompt("Patient age:");
    if (!ageStr) return null;

    const gender = window.prompt("Gender (M/F):");
    if (gender !== "M" && gender !== "F") {
      alert("Invalid gender");
      return null;
    }

    const notes = window.prompt("Notes for doctor (optional):") ?? "";

    return {
      name,
      age: Number(ageStr),
      gender: gender as "M" | "F",
      notes,
    };
  };
  const askForConsultationType = (): ConsultationType | null => {
    const type = window.prompt(
      "Consultation type: firstVisit / control / chronic / prescription",
      "firstVisit",
    );

    if (
      type === "firstVisit" ||
      type === "control" ||
      type === "chronic" ||
      type === "prescription"
    ) {
      return type;
    }

    alert("Invalid consultation type");
    return null;
  };

  const askForDocuments = () => {
    const docs = window.prompt("Documents (URLs separated by comma):");
    if (!docs) return [];
    return docs.split(",").map((d) => d.trim());
  };
  useEffect(() => {
    if (profile?.banned) {
      alert("Your account has been banned. You cannot reserve consultations.");
    }
  }, [profile?.banned]);

  // Reservation handler

  const reserveConsultation = async (
    doctor: Doctor,
    dayIndex: number,
    minute: number,
    durationInMin: number,
    type: Consultation["type"],
    patientDetails: Consultation["patientDetails"],
    documents: string[],
  ) => {
    await addConsultation({
      doctorId: doctor.id,
      patientId: user.uid,
      date: weekDates[dayIndex].toISOString().split("T")[0],
      startTime: minutesToTime(minute),
      durationInMin,
      type,
      status: "reserved",
      patientDetails,
      documents,
    });
  };

  const handleSlotClick = async (dayIndex: number, minute: number) => {
    if (!user) {
      alert("You must be logged in");
      return;
    }
    const c = getConsultationForSlot(dayIndex, minute);

    if (c) {
      await handleExistingConsultationClick(c);
      return;
    }
    if (profile?.role === "doctor") {
      alert("Doctors cannot reserve consultations");
      return;
    }

    if (profile?.banned) {
      alert("Your account has been banned. You cannot reserve consultations.");
      return;
    }
    if (isPastSlot(weekDates[dayIndex], minute)) {
      alert("You cannot reserve a consultation in the past.");
      return;
    }

    // klik na istniejącą wizytę

    const doctor = askForDoctor(doctors);
    if (!doctor) return;
    const ok = window.confirm(
      `Reserve visit ${weekDates[dayIndex].toLocaleDateString()} ${minutesToTime(
        minute,
      )}?`,
    );
    if (!ok) return;
    const durationInMin = askForDuration();
    if (!durationInMin) return;

    const patientDetails = collectPatientDetails();
    if (!patientDetails) return;

    const type = askForConsultationType();
    if (!type) return;

    const documents = askForDocuments();

    await reserveConsultation(
      doctor,
      dayIndex,
      minute,
      durationInMin,
      type,
      patientDetails,
      documents,
    );
  };

  // render UI slot
  const renderSlot = (dayIndex: number, minute: number) => {
    const c = getConsultationForSlot(dayIndex, minute);
    const canRate =
      c &&
      profile?.role === "patient" &&
      c.status === "finished" &&
      !c.rating &&
      c.patientId === user?.uid &&
      isStartSlot(c, minute);

    const status = c ? getEffectiveStatus(c) : "free";
    const isNow = isCurrentSlot(weekDates[dayIndex], minute);

    if (c && !isStartSlot(c, minute)) {
      return (
        <div
          key={`slot-${dayIndex}-${minute}`}
          style={{
            border: isNow ? "2px solid #ff1744" : "1px solid #ccc",
            backgroundColor: getConsultationBgColor(c, status),
            borderTop: "none",
            pointerEvents: "none",
          }}
        />
      );
    }

    // start wizyty albo wolny slot
    return (
      <div
        key={`slot-${dayIndex}-${minute}`}
        onClick={() => handleSlotClick(dayIndex, minute)}
        style={{
          border: isNow ? "2px solid #ff1744" : "1px solid #ccc",
          height: SLOT_PX,
          backgroundColor: isNow
            ? "#ffe6ea"
            : getConsultationBgColor(c, status),
          color: CONSULTATION_TEXT_COLOR[status],
          fontSize: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: c ? 2 : 1,
        }}
      >
        {c && (
          <>
            <div>{`${c.type} (${c.durationInMin} min)`}</div>

            {canRate && (
              <button
                style={smallButtonStyle}
                onClick={async (e) => {
                  e.stopPropagation();

                  const ratingStr = prompt("Rate 1–5");
                  const opinion = prompt("Your opinion") || undefined;

                  const rating = Number(ratingStr);
                  if (rating < 1 || rating > 5) {
                    alert("Invalid rating");
                    return;
                  }

                  await updateConsultation(c.id!, {
                    rating,
                    opinion,
                  });
                }}
              >
                Rate visit
              </button>
            )}
          </>
        )}
      </div>
    );
  };
  // ---- UI ----
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
          style={secondaryButtonStyle}
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
          style={secondaryButtonStyle}
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
          const count = countConsultationsForDay(consultations, date);

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

              {/* LICZNIK */}
              <div style={{ fontSize: 11, fontWeight: "normal" }}>
                {count > 0 ? `${count} visits` : "—"}
              </div>
            </div>
          );
        })}

        {hours.map((minute) => (
          <React.Fragment key={minute}>
            <div>{minutesToTime(minute)}</div>
            {days.map((_, dayIndex) => renderSlot(dayIndex, minute))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
