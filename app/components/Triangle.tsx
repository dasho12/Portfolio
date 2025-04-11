import React from "react";
import { cn } from "@/app/lib/untils";

interface TriangleProps {
  size?: "sm" | "md" | "lg" | "xl" | "xxl" | "hh";
  color?: string;
  imageUrl?: string;
  text?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  className?: string;
  rotate?: number;
}

const sizeMap = {
  sm: 80,
  md: 350,
  lg: 400,
  xl: 450,
  xxl: 530,
  hh: 550,
};

const Triangle: React.FC<TriangleProps> = ({
  size = "md",
  color = "none",
  imageUrl,
  text = "",
  textColor = "#ffffff",
  borderColor = "#000000",
  borderWidth = 2,
  className,
  rotate = 0,
}) => {
  const width = sizeMap[size];
  const height = (Math.sqrt(3) / 2) * width;

  // Calculate padding for the border
  const padding = borderWidth;

  // Calculate the triangle points with proper padding
  const trianglePoints = `${width / 2},${padding} ${padding},${
    height - padding
  } ${width - padding},${height - padding}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn(className)}
    >
      <defs>
        <clipPath id={`triangle-clip-${size}`}>
          <polygon points={trianglePoints} />
        </clipPath>
      </defs>

      {/* Triangle and image with rotation */}
      <g
        transform={
          rotate ? `rotate(${rotate}, ${width / 2}, ${height / 2})` : undefined
        }
      >
        {imageUrl ? (
          <>
            {/* Background triangle */}
            <polygon points={trianglePoints} fill={color} stroke="none" />

            {/* Image clipped to triangle shape */}
            <image
              href={imageUrl}
              x="0"
              y="0"
              width={width}
              height={height}
              clipPath={`url(#triangle-clip-${size})`}
              preserveAspectRatio="xMidYMid slice"
            />

            {/* Border triangle */}
            <polygon
              points={trianglePoints}
              fill="none"
              stroke={borderColor}
              strokeWidth={borderWidth}
              strokeLinejoin="miter"
            />
          </>
        ) : (
          <polygon
            points={trianglePoints}
            fill={color}
            stroke={borderColor}
            strokeWidth={borderWidth}
            strokeLinejoin="miter"
          />
        )}
      </g>

      {/* Text that doesn't rotate */}
      {text && (
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textColor}
          fontSize={width / 10}
          fontFamily="Arial, sans-serif"
          fontWeight="normal"
          letterSpacing={width / 50}
        >
          {text}
        </text>
      )}
    </svg>
  );
};

export default Triangle;
