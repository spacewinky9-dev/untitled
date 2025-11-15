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
              mode: ['push', 'bubble', 'repulse'],
            },
            onHover: {
              enable: true,
              mode: ['grab', 'bubble'],
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 5,
            },
            grab: {
              distance: 250,
              links: {
                opacity: 0.7,
                color: '#FFD700',
              },
            },
            connect: {
              distance: 200,
              radius: 250,
              links: {
                opacity: 0.6,
              },
            },
            bubble: {
              distance: 300,
              size: 10,
              duration: 2.5,
              opacity: 1,
              color: {
                value: ['#FF9933', '#FFD700'],
              },
            },
            repulse: {
              distance: 150,
              duration: 0.6,
            },
          },
        },
        particles: {
          color: {
            value: ['#FF9933', '#138808', '#00d4ff', '#FFD700', '#ff6b6b', '#4ecdc4', '#95e1d3'],
          },
          links: {
            color: {
              value: '#FF9933',
            },
            distance: 150,
            enable: true,
            opacity: 0.25,
            width: 1.2,
            triangles: {
              enable: true,
              opacity: 0.08,
              color: '#138808',
            },
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
              bottom: 'bounce',
              left: 'bounce',
              right: 'bounce',
              top: 'bounce',
            },
            random: true,
            speed: 1.5,
            straight: false,
            attract: {
              enable: true,
              rotate: {
                x: 800,
                y: 1600,
              },
            },
            bounce: true,
            decay: 0.01,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 100,
          },
          opacity: {
            value: { min: 0.3, max: 0.8 },
            animation: {
              enable: true,
              speed: 0.8,
              minimumValue: 0.2,
              sync: false,
            },
          },
          shape: {
            type: ['circle', 'triangle', 'polygon', 'star'],
            options: {
              polygon: {
                sides: 6,
              },
              star: {
                sides: 5,
              },
            },
          },
          size: {
            value: { min: 1, max: 6 },
            animation: {
              enable: true,
              speed: 3,
              minimumValue: 0.5,
              sync: false,
            },
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.08,
              opacity: 1,
            },
          },
          rotate: {
            value: 0,
            direction: 'clockwise',
            animation: {
              enable: true,
              speed: 5,
              sync: false,
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
