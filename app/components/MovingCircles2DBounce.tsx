"use client";

import React, { useRef, useEffect } from "react";

const CIRCLE_COUNT = 8;
const MIN_CIRCLE_SIZE = 2;
const MAX_CIRCLE_SIZE = 150;
const MIN_SPEED = 0.2;
const MAX_SPEED = 0.3;
const START_AREA_RATIO = 0.8; // Circles will start within 30% of the center
const BOUNCE_DISTANCE = 5000; // Distance at which circles start to repel each other
const FADE_IN_DURATION = 1000; // Number of frames for fade-in effect
const CIRCLE_COLOR = "#E07F3F";

interface Circle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  fadeInProgress: number;
}

export default function MovingCircles2DBounce() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initial size set
    updateCanvasSize();

    // Update size on window resize
    window.addEventListener("resize", updateCanvasSize);

    function createCircle(canvas: HTMLCanvasElement): Circle {
      const size =
        Math.random() * (MAX_CIRCLE_SIZE - MIN_CIRCLE_SIZE) + MIN_CIRCLE_SIZE;
      const speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;

      // Calculate start position within the central area
      const startAreaWidth = canvas.width * START_AREA_RATIO;
      const startAreaHeight = canvas.height * START_AREA_RATIO;
      const x = canvas.width / 2 + (Math.random() - 0.5) * startAreaWidth;
      const y = canvas.height / 2 + (Math.random() - 0.5) * startAreaHeight;

      // Generate a random angle for movement direction
      const angle = Math.random() * Math.PI * 2;

      // Calculate speed components based on the angle
      const speedX = Math.cos(angle) * speed;
      const speedY = Math.sin(angle) * speed;

      return {
        x,
        y,
        size,
        speedX,
        speedY,
        color: CIRCLE_COLOR,
        opacity: 0,
        fadeInProgress: 0,
      };
    }

    // Create circles
    const circles: Circle[] = Array.from({ length: CIRCLE_COUNT }, () =>
      createCircle(canvas)
    );

    function handleCollisions(circle: Circle, index: number) {
      for (let i = 0; i < circles.length; i++) {
        if (i !== index) {
          const other = circles[i];
          const dx = other.x - circle.x;
          const dy = other.y - circle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < BOUNCE_DISTANCE) {
            // Calculate the angle of collision
            const angle = Math.atan2(dy, dx);

            // Calculate the components of the repulsion force
            const force = (BOUNCE_DISTANCE - distance) / BOUNCE_DISTANCE;
            const forceX = Math.cos(angle) * force;
            const forceY = Math.sin(angle) * force;

            // Apply the repulsion force to both circles
            circle.speedX -= forceX * 0.05;
            circle.speedY -= forceY * 0.05;
            other.speedX += forceX * 0.05;
            other.speedY += forceY * 0.05;

            // Normalize speeds to maintain consistent movement
            const speed = Math.sqrt(
              circle.speedX * circle.speedX + circle.speedY * circle.speedY
            );
            circle.speedX =
              (circle.speedX / speed) * ((MAX_SPEED + MIN_SPEED) / 2);
            circle.speedY =
              (circle.speedY / speed) * ((MAX_SPEED + MIN_SPEED) / 2);
          }
        }
      }
    }

    // Animation function
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circles.forEach((circle, index) => {
        // Handle collisions
        handleCollisions(circle, index);

        // Move the circle
        circle.x += circle.speedX;
        circle.y += circle.speedY;

        // Update fade-in progress
        if (circle.fadeInProgress < FADE_IN_DURATION) {
          circle.fadeInProgress++;
          circle.opacity = circle.fadeInProgress / FADE_IN_DURATION;
        }

        // Reset circle if it's off-screen
        if (
          circle.x < -circle.size ||
          circle.x > canvas.width + circle.size ||
          circle.y < -circle.size ||
          circle.y > canvas.height + circle.size
        ) {
          const newCircle = createCircle(canvas);
          Object.assign(circle, newCircle);
        }

        // Draw the circle with current opacity
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 127, 63, ${circle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    // Start the animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}
