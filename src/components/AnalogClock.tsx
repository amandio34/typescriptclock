// src/components/AnalogClock.tsx
import React from "react";

interface Props {
  date: Date;
  size?: number; // Optional size of the clock in pixels
}

export default function AnalogClock({ date, size = 120 }: Props) {
  // Extract hours, minutes, and seconds from the date
  const sec = date.getSeconds();
  const min = date.getMinutes();
  const hr = date.getHours() % 12;

  // Calculate angles for each hand
  const secondAngle = (sec / 60) * 360;
  const minuteAngle = ((min + sec / 60) / 60) * 360;
  const hourAngle = ((hr + min / 60) / 12) * 360;

  // Center and radius for the clock face
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Analog klocka">
      {/* Clock face */}
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#e6e6e6" />
      {/* Hour hand */}
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - r * 0.5}
        stroke="#111"
        strokeWidth={3}
        strokeLinecap="round"
        transform={`rotate(${hourAngle},${cx},${cy})`}
      />
      {/* Minute hand */}
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - r * 0.75}
        stroke="#333"
        strokeWidth={2}
        strokeLinecap="round"
        transform={`rotate(${minuteAngle},${cx},${cy})`}
      />
      {/* Second hand */}
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - r * 0.9}
        stroke="#d00"
        strokeWidth={1}
        strokeLinecap="round"
        transform={`rotate(${secondAngle},${cx},${cy})`}
      />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="2" fill="#000" />
    </svg>
  );
}
