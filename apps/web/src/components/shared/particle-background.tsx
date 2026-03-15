"use client";

import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

const particlesOptions: ISourceOptions = {
  fullScreen: { enable: false },
  background: {
    color: { value: "transparent" },
  },
  fpsLimit: 60,
  particles: {
    color: {
      value: ["#3B82F6", "#8B5CF6", "#06B6D4"],
    },
    links: {
      color: "#3B82F6",
      distance: 150,
      enable: true,
      opacity: 0.08,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.8,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "bounce" },
    },
    number: {
      density: { enable: true },
      value: 60,
    },
    opacity: {
      value: { min: 0.1, max: 0.4 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    shape: { type: "circle" },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
};

export function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async () => {}, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={particlesOptions}
      className="absolute inset-0 -z-10"
    />
  );
}

export default ParticleBackground;
