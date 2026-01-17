import { useState } from "react";
import { addAvailability } from "../services/consultationsService.Firebase";

export const DoctorAvailability = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [type, setType] = useState<"cyclic" | "single">("cyclic");
  const [date, setDate] = useState("");

  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);

  const [timeRanges, setTimeRanges] = useState([
    { from: "08:00", to: "12:30" },
  ]);

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const addTimeRange = () => {
    setTimeRanges([...timeRanges, { from: "08:00", to: "12:30" }]);
  };

  const updateTimeRange = (
    index: number,
    field: "from" | "to",
    value: string,
  ) => {
    setTimeRanges((prev) =>
      prev.map((tr, i) => (i === index ? { ...tr, [field]: value } : tr)),
    );
  };

 const save = async () => {
  const availability =
    type === "cyclic"
      ? {
          doctorId: "doc1",
          type: "cyclic" as const,
          fromDate,
          toDate,
          daysOfWeek,
          timeRanges,
        }
      : {
          doctorId: "doc1",
          type: "single" as const,
          date,
          timeRanges,
        };

  await addAvailability(availability);
  alert("Availability saved");
};

  return (
    <div>
      <h3>Doctor Availability</h3>

      {/* TYPE */}
      <div>
        <label>
          <input
            type="radio"
            checked={type === "cyclic"}
            onChange={() => setType("cyclic")}
          />
          Cyclic
        </label>

        <label>
          <input
            type="radio"
            checked={type === "single"}
            onChange={() => setType("single")}
          />
          Single day
        </label>
      </div>

      {/* DATES */}
      {type === "cyclic" && (
        <div>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      )}

      {type === "single" && (
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      )}

      {/* DAYS OF WEEK */}
      {type === "cyclic" && (
        <div>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => (
            <label key={i}>
              <input
                type="checkbox"
                checked={daysOfWeek.includes(i)}
                onChange={() => toggleDay(i)}
              />
              {label}
            </label>
          ))}
        </div>
      )}

      {/* TIME RANGES */}
      <div>
        {timeRanges.map((tr, i) => (
          <div key={i}>
            <input
              type="time"
              value={tr.from}
              onChange={(e) => updateTimeRange(i, "from", e.target.value)}
            />
            <input
              type="time"
              value={tr.to}
              onChange={(e) => updateTimeRange(i, "to", e.target.value)}
            />
          </div>
        ))}
        <button onClick={addTimeRange}>Add time range</button>
      </div>

      <button onClick={save}>Save</button>
    </div>
  );
};
