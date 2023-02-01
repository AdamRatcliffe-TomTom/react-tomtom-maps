import React from "react";

interface Props {
  color?: string;
  width?: number;
  height?: number;
}

const Icon: React.SFC<Props> = ({
  color = "black",
  width = 30,
  height = 36
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0, 0, 30, 36"
  >
    <defs>
      <linearGradient
        id="a"
        gradientUnits="userSpaceOnUse"
        x1="15"
        x2="15"
        y2="34.5"
      >
        <stop offset="0" stopColor="#FFF" stopOpacity="0" />
        <stop offset="1" stopOpacity=".25" />
      </linearGradient>
    </defs>
    <ellipse cx="15" cy="34" rx="7.661" ry="2" opacity=".2" />
    <path
      d="M25.6 4.4C22.9 1.7 19.1 0 15 0S7.1 1.7 4.4 4.4C1.7 7.1 0 10.9 0 15s1.7 7.9 4.4 10.6C7.1 28.3 15 34.5 15 34.5s7.9-6.2 10.6-8.9C28.3 22.9 30 19.1 30 15s-1.7-7.9-4.4-10.6z"
      fill={color}
    />
    <path
      d="M285.81 179.765a11.96 11.96 0 0 0-8.483-3.513 11.97 11.97 0 0 0-8.486 3.514 11.962 11.962 0 0 0-3.51 8.486c0 3.315 1.344 6.316 3.517 8.488 2.17 2.17 8.482 7.112 8.482 7.112s6.312-4.943 8.484-7.115a11.962 11.962 0 0 0 3.515-8.485 11.97 11.97 0 0 0-3.518-8.487zM22.957 13.3L13.03 8.53v9.535zM11.71 7.674c.01-1.144-1.99-1.202-1.99-.096v16.207h1.986"
      fill="white"
    />
    <path
      d="M25.6 4.4C22.9 1.7 19.1 0 15 0S7.1 1.7 4.4 4.4C1.7 7.1 0 10.9 0 15s1.7 7.9 4.4 10.6C7.1 28.3 15 34.5 15 34.5s7.9-6.2 10.6-8.9C28.3 22.9 30 19.1 30 15s-1.7-7.9-4.4-10.6z"
      fill="url(#a)"
    />
    <circle className="innerCircle" cx="15" cy="15" r="12" fill="none" />
  </svg>
);

export default Icon;
