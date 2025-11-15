'use client'

import { useCallback } from 'react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: ['push', 'bubble'],
            },
            onHover: {
              enable: true,
              mode: ['grab', 'connect'],
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            grab: {
              distance: 200,
              links: {
                opacity: 0.5,
                color: '#00ff88',
              },
            },
            connect: {
              distance: 150,
              radius: 200,
              links: {
                opacity: 0.5,
              },
            },
            bubble: {
              distance: 250,
              size: 8,
              duration: 2,
              opacity: 0.8,
            },
            repulse: {
              distance: 120,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ['#FF9933', '#138808', '#00d4ff', '#FFD700', '#ff00ff', '#00ff88'],
          },
          links: {
            color: {
              value: ['#FF9933', '#138808', '#00d4ff'],
            },
            distance: 180,
            enable: true,
            opacity: 0.35,
            width: 1.5,
            triangles: {
              enable: true,
              opacity: 0.05,
            },
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'out',
              bottom: 'out',
              left: 'out',
              right: 'out',
              top: 'out',
            },
            random: true,
            speed: 2,
            straight: false,
            attract: {
              enable: true,
              rotate: {
                x: 600,
                y: 1200,
              },
            },
          },
          number: {
            density: {
              enable: true,
              area: 900,
            },
            value: 80,
          },
          opacity: {
            value: { min: 0.3, max: 0.7 },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1,
              sync: false,
            },
          },
          shape: {
            type: ['circle', 'triangle', 'polygon'],
            options: {
              polygon: {
                sides: 6,
              },
            },
          },
          size: {
            value: { min: 1, max: 5 },
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.5,
              sync: false,
            },
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.05,
              opacity: 1,
            },
          },
        },
        emitters: [
          {
            position: {
              x: 0,
              y: 50,
            },
            rate: {
              quantity: 2,
              delay: 0.5,
            },
            size: {
              width: 0,
              height: 0,
            },
            particles: {
              move: {
                direction: 'right',
                speed: 3,
              },
              color: {
                value: '#FFD700',
              },
            },
          },
          {
            position: {
              x: 100,
              y: 50,
            },
            rate: {
              quantity: 2,
              delay: 0.5,
            },
            size: {
              width: 0,
              height: 0,
            },
            particles: {
              move: {
                direction: 'left',
                speed: 3,
              },
              color: {
                value: '#00ff88',
              },
            },
          },
        ],
        detectRetina: true,
      }}
      className="absolute inset-0 -z-10"
    />
  )
}
