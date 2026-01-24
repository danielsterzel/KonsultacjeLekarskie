import { useState } from "react";
import { addAvailability } from "../services/consultationsService.Firebase";
import styles from "./styles/DoctorAvailability.module.css";

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
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addTimeRange = () => {
    setTimeRanges([...timeRanges, { from: "08:00", to: "12:30" }]);
  };

  const updateTimeRange = (
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    setTimeRanges((prev) =>
      prev.map((tr, i) => (i === index ? { ...tr, [field]: value } : tr))
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
    <div className={styles.container}>
      <h2 className={styles.title}>Doctor availability</h2>

      {/* TYPE */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Availability type</div>
        <div className={styles.radioGroup}>
          <label className={styles.label}>
            <input
              type="radio"
              checked={type === "cyclic"}
              onChange={() => setType("cyclic")}
            />
            Cyclic
          </label>

          <label className={styles.label}>
            <input
              type="radio"
              checked={type === "single"}
              onChange={() => setType("single")}
            />
            Single day
          </label>
        </div>
      </div>

      {/* DATES */}
      {type === "cyclic" && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Date range</div>
          <div className={styles.row}>
            <input
              className={styles.input}
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              className={styles.input}
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      )}

      {type === "single" && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Date</div>
          <input
            className={styles.input}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      )}

      {/* DAYS */}
      {type === "cyclic" && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Days of week</div>
          <div className={styles.checkboxGroup}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => (
              <label key={i} className={styles.label}>
                <input
                  type="checkbox"
                  checked={daysOfWeek.includes(i)}
                  onChange={() => toggleDay(i)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* TIME RANGES */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Time ranges</div>

        {timeRanges.map((tr, i) => (
          <div key={i} className={styles.timeRange}>
            <input
              className={styles.input}
              type="time"
              value={tr.from}
              onChange={(e) => updateTimeRange(i, "from", e.target.value)}
            />
            <input
              className={styles.input}
              type="time"
              value={tr.to}
              onChange={(e) => updateTimeRange(i, "to", e.target.value)}
            />
          </div>
        ))}

        <button className={styles.addButton} onClick={addTimeRange}>
          + Add time range
        </button>
      </div>

      <button className={styles.saveButton} onClick={save}>
        Save availability
      </button>
    </div>
  );
};
