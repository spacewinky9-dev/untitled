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
        fullScreen: {
          enable: false,
          zIndex: 0,
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: ['push', 'bubble'],
            },
            onHover: {
              enable: true,
              mode: ['grab', 'connect', 'bubble'],
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 6,
            },
            grab: {
              distance: 300,
              links: {
                opacity: 0.8,
                color: '#FFD700',
              },
            },
            connect: {
              distance: 180,
              radius: 280,
              links: {
                opacity: 0.5,
              },
            },
            bubble: {
              distance: 400,
              size: 12,
              duration: 3,
              opacity: 0.9,
              color: {
                value: ['#FF9933', '#FFD700', '#00ff88'],
              },
            },
            repulse: {
              distance: 200,
              duration: 0.8,
            },
          },
        },
        particles: {
          color: {
            value: ['#FF9933', '#FFD700', '#138808', '#00ff88', '#00d4ff', '#4ecdc4', '#95e1d3', '#ff6b6b', '#ffa500'],
          },
          links: {
            color: {
              value: '#FF9933',
            },
            distance: 180,
            enable: true,
            opacity: 0.4,
            width: 1.5,
            triangles: {
              enable: true,
              opacity: 0.12,
              color: ['#138808', '#FFD700', '#00d4ff'],
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
            speed: 2,
            straight: false,
            attract: {
              enable: true,
              rotate: {
                x: 1200,
                y: 2000,
              },
            },
            bounce: true,
            decay: 0.02,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: { min: 0.4, max: 0.9 },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.3,
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
            value: { min: 2, max: 8 },
            animation: {
              enable: true,
              speed: 4,
              minimumValue: 1,
              sync: false,
            },
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.1,
              opacity: 1,
            },
          },
          rotate: {
            value: 0,
            direction: 'clockwise',
            animation: {
              enable: true,
              speed: 6,
              sync: false,
            },
          },
          shadow: {
            enable: true,
            color: '#FF9933',
            blur: 5,
          },
        },
        emitters: [
          {
            position: {
              x: 0,
              y: 30,
            },
            rate: {
              quantity: 3,
              delay: 0.4,
            },
            size: {
              width: 0,
              height: 0,
            },
            particles: {
              move: {
                direction: 'right',
                speed: 4,
              },
              color: {
                value: '#FFD700',
              },
              opacity: {
                value: 0.7,
              },
            },
          },
          {
            position: {
              x: 100,
              y: 30,
            },
            rate: {
              quantity: 3,
              delay: 0.4,
            },
            size: {
              width: 0,
              height: 0,
            },
            particles: {
              move: {
                direction: 'left',
                speed: 4,
              },
              color: {
                value: '#00ff88',
              },
              opacity: {
                value: 0.7,
              },
            },
          },
          {
            position: {
              x: 50,
              y: 100,
            },
            rate: {
              quantity: 2,
              delay: 0.6,
            },
            size: {
              width: 0,
              height: 0,
            },
            particles: {
              move: {
                direction: 'top',
                speed: 3,
              },
              color: {
                value: '#00d4ff',
              },
              opacity: {
                value: 0.6,
              },
            },
          },
        ],
        detectRetina: true,
        pauseOnBlur: true,
        pauseOnOutsideViewport: false,
      }}
      className="absolute inset-0 w-full h-full"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
  )
}
