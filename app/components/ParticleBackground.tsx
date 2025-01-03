"use client";
import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";

const ParticleBackground = () => {
  // Initialize tsparticles engine
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  // Particle configuration (this can be customized)
  const particleOptions = {
    fullScreen: {
      enable: false,
      zIndex: 1,
    },
    particles: {
      number: {
        value: 50, // Number of particles
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#888888", // Particle color
      },
      shape: {
        type: "circle", // circle, edge, polygon, star, etc.
      },
      opacity: {
        value: 0.3,
      },
      size: {
        value: { min: 1, max: 5 },
      },
      links: {
        enable: true,
        distance: 150,
        color: "#888888",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        outModes: {
          default: "out",
        },
      },
    },
    // If you want an on-hover effect
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse", // or "grab", "bubble"
        },
        onClick: {
          enable: true,
          mode: "push",
        },
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
        push: {
          quantity: 4,
        },
      },
    },
    retina_detect: true,
  };

  return (
    <Particles
      className="absolute inset-0 -z-10"
      id="tsparticles"
      init={particlesInit}
      options={particleOptions as any}
    />
  );
};

export default ParticleBackground;
