// src/components/AnalogClock.tsx
import React from "react";

interface Props {
  date: Date;
  size?: number;
}

export default function AnalogClock({ date, size = 120 }: Props) {
  const sec = date.getSeconds();
  const min = date.getMinutes();
  const hr = date.getHours() % 12;

  const secondAngle = (sec / 60) * 360;
  const minuteAngle = ((min + sec / 60) / 60) * 360;
  const hourAngle = ((hr + min / 60) / 12) * 360;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Analog klocka">
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#e6e6e6" />
      <g transform={`translate(${cx},${cy})`}>
        <line x1="0" y1="0" x2="0" y2={-r * 0.5} stroke="#111" strokeWidth={3} transform={`rotate(${hourAngle})`} strokeLinecap="round" />
        <line x1="0" y1="0" x2="0" y2={-r * 0.75} stroke="#333" strokeWidth={2} transform={`rotate(${minuteAngle})`} strokeLinecap="round" />
        <line x1="0" y1="0" x2="0" y2={-r * 0.9} stroke="#d00" strokeWidth={1} transform={`rotate(${secondAngle})`} strokeLinecap="round" />
        <circle cx={0} cy={0} r="2" fill="#000" />
      </g>
    </svg>
  );
}
