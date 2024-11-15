"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Stage, Layer, Circle, Rect, RegularPolygon } from "react-konva";

interface ShapeProps {
  type: "circle" | "square" | "triangle";
  size: number;
  color: string;
  x: number;
  y: number;
  isHollow: boolean;
}

const getRandomPosition = (
  size: number,
  existingShapes: ShapeProps[]
): { x: number; y: number } => {
  let position: { x: any; y: any };
  let isOverlapping;
  const maxAttempts = 100;
  let attempts = 0;

  do {
    position = {
      x: Math.random() * (window.innerWidth - size),
      y: Math.random() * (window.innerHeight - size),
    };

    isOverlapping = existingShapes.some((shape) => {
      const distance = Math.sqrt(
        Math.pow(position.x - shape.x, 2) + Math.pow(position.y - shape.y, 2)
      );
      return distance < (size + shape.size) / 2;
    });

    attempts++;
  } while (isOverlapping && attempts < maxAttempts);

  return position;
};

const getRandomColor = () => `hsl(${Math.random() * 60}, 100%, 50%)`;

const generateRandomShapes = (count: number): ShapeProps[] => {
  const shapes: ShapeProps[] = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 50 + 20;
    const position = getRandomPosition(size, shapes);

    shapes.push({
      type: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)] as
        | "circle"
        | "square"
        | "triangle",
      size,
      color: getRandomColor(),
      isHollow: Math.random() > 0.5,
      x: position.x,
      y: position.y,
    });
  }
  return shapes;
};

const Background: React.FC = () => {
  const pathname = usePathname(); 
  const [shapes, setShapes] = useState<ShapeProps[]>([]);

  useEffect(() => {
    setShapes(generateRandomShapes(10));
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {shapes.map((shape, index) => {
            const commonProps: any = {
              key: index,
              x: shape.x,
              y: shape.y,
              opacity: 0.09,
              strokeWidth: shape.isHollow ? 10 : 0,
            };

            if (shape.isHollow) {
              commonProps["stroke"] = shape.color;
            } else {
              commonProps["fill"] = shape.color;
            }

            switch (shape.type) {
              case "circle":
                return <Circle {...commonProps} radius={shape.size} />;
              case "square":
                return (
                  <Rect
                    {...commonProps}
                    width={shape.size}
                    height={shape.size}
                  />
                );
              case "triangle":
                return (
                  <RegularPolygon
                    {...commonProps}
                    sides={3}
                    radius={shape.size}
                  />
                );
              default:
                return null;
            }
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default Background;
