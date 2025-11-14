import { motion } from 'motion/react'

export default function PageTransition({ isTransitioning }) {
  const panels = [
    { name: 'top-left', x: '-100%', y: '-100%' },
    { name: 'top-right', x: '100%', y: '-100%' },
    { name: 'bottom-left', x: '-100%', y: '100%' },
    { name: 'bottom-right', x: '100%', y: '100%' }
  ]

  const panelVariants = {
    initial: (custom) => ({
      x: custom.x,
      y: custom.y
    }),
    animate: {
      x: 0,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.65, 0, 0.35, 1] // power3.inOut equivalent
      }
    },
    exit: (custom) => ({
      x: custom.x,
      y: custom.y,
      transition: {
        duration: 0.7,
        ease: [0.65, 0, 0.35, 1]
      }
    })
  }

  if (!isTransitioning) return null

  return (
    <div className="transition-overlay">
      {panels.map((panel, i) => (
        <motion.div
          key={panel.name}
          className="transition-panel"
          custom={{ x: panel.x, y: panel.y }}
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      ))}
    </div>
  )
}
