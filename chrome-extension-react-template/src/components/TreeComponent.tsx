import React, { useEffect, useState, useMemo } from 'react'

interface Point { x: number; y: number }
interface Lettuce { center: Point; size: number; rotation: number }
interface Topping { position: Point; size: number; type: 'tomato' | 'parmesan' | 'crouton' }
interface Dressing { start: Point; length: number; rotation: number }

interface TreeComponentProps {
  growth: number // 20-100
}

const TreeComponent: React.FC<TreeComponentProps> = ({ growth }) => {
  const healthFactor = (growth - 50) / 50
  const bowlScale = Math.min(1.4, 1 + (growth - 20) / 80)
  const baseSize = 200
  const bowlColor = '#f5f5f5'
  const darkerBowlColor = '#e0e0e0'
  const lighterBowlColor = '#ffffff'

  const colors = {
    lettuce: healthFactor >= 0
      ? `rgb(${Math.floor(100 + healthFactor * 30)}, ${Math.floor(150 + healthFactor * 50)}, ${Math.floor(50 + healthFactor * 30)})`
      : `rgb(${Math.floor(150 - healthFactor * 50)}, ${Math.floor(150 + healthFactor * 30)}, ${Math.floor(50 - healthFactor * 20)})`,
    bowl: '#f5f5f5',
    tomato: '#ff6b6b',
    parmesan: '#fff9c4',
    crouton: '#d4a373',
    dressing: 'rgba(255, 250, 220, 0.6)'
  }

  const generateLettuce = (numLeaves: number): Lettuce[] => {
    const leaves: Lettuce[] = []
    const bowlRadius = 65 * bowlScale
    const bowlHeight = 90 * bowlScale
    
    const layers = 4
    for (let layer = 0; layer < layers; layer++) {
      const layerRadius = bowlRadius * (0.6 + (layer * 0.2))
      const leavesInLayer = Math.floor(numLeaves / layers)
      const layerHeight = 150 + (bowlHeight * 0.3) - (layer * (bowlHeight * 0.15))
      
      for (let i = 0; i < leavesInLayer; i++) {
        const angle = (i / leavesInLayer) * Math.PI * 2
        const radiusVariation = 0.8 + Math.random() * 0.4
        const radius = Math.min(layerRadius * radiusVariation, bowlRadius * 0.95)
        
        const x = 100 + Math.cos(angle) * radius
        const y = layerHeight + Math.sin(angle) * (radius * 0.4)

        leaves.push({
          center: { x, y },
          size: 15 + Math.random() * 15 + (layer * 3),
          rotation: Math.random() * 360,
          layer: layer
        })
      }
    }
    return leaves
  }

  const generateToppings = (numToppings: number, type: Topping['type']): Topping[] => {
    const toppings: Topping[] = []
    const bowlRadius = 60 * bowlScale
    const bowlHeight = 90 * bowlScale

    for (let i = 0; i < numToppings; i++) {
      const angle = Math.random() * Math.PI * 2
      const radiusVariation = Math.random() * 0.6
      const radius = bowlRadius * radiusVariation
      
      const x = 100 + Math.cos(angle) * radius
      const y = 150 + Math.sin(angle) * (radius * 0.4) - (bowlHeight * 0.2)

      toppings.push({
        position: { x, y },
        size: type === 'crouton' 
          ? 18 + Math.random() * 8
          : type === 'tomato'
            ? 16 + Math.random() * 8
            : 8 + Math.random() * 4,
        type
      })
    }
    return toppings
  }

  const generateDressing = (numDrizzles: number): Dressing[] => {
    const drizzles: Dressing[] = []
    const bowlRadius = 70 * bowlScale

    for (let i = 0; i < numDrizzles; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * bowlRadius * 0.7
      drizzles.push({
        start: {
          x: 100 + Math.cos(angle) * radius,
          y: 150 + Math.sin(angle) * radius * 0.5
        },
        length: 15 + Math.random() * 25,
        rotation: Math.random() * 360
      })
    }
    return drizzles
  }

  const { lettuce, toppings, dressing } = useMemo(() => {
    const lettuceCount = Math.floor(growth / 2) + 25
    const tomatoCount = growth > 40 ? Math.floor((growth - 40) / 8) + 3 : 0
    const parmesanCount = growth > 60 ? Math.floor((growth - 60) / 4) + 4 : 0
    const croutonCount = growth > 80 ? Math.floor((growth - 80) / 4) + 3 : 0
    const dressingCount = Math.floor(growth / 8)

    return {
      lettuce: generateLettuce(lettuceCount),
      toppings: [
        ...generateToppings(tomatoCount, 'tomato'),
        ...generateToppings(parmesanCount, 'parmesan'),
        ...generateToppings(croutonCount, 'crouton')
      ],
      dressing: generateDressing(dressingCount)
    }
  }, [growth, bowlScale])

  return (
    <div className="relative" style={{ width: '200px', height: '300px' }}>
      {/* Bowl shadow */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: `${baseSize * bowlScale * 1.1}px`,
          height: '20px',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          transform: 'translateX(-50%) scaleY(0.3)',
          zIndex: 1
        }}
      />

      {/* SVG Bowl */}
      <svg
        width={baseSize * bowlScale}
        height={baseSize * bowlScale}
        viewBox="0 0 200 200"
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{ zIndex: 2 }}
      >
        <defs>
          {/* Gradient for bowl depth */}
          <linearGradient id="bowlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: lighterBowlColor }} />
            <stop offset="100%" style={{ stopColor: darkerBowlColor }} />
          </linearGradient>
          
          {/* Inner shadow filter */}
          <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feOffset dx="-2" dy="-2" />
            <feComposite
              operator="arithmetic"
              k2="-1"
              k3="1"
              in="SourceGraphic"
            />
          </filter>
        </defs>

        {/* Back rim */}
        <path
          d="M 20 80 Q 100 60, 180 80"
          stroke={darkerBowlColor}
          strokeWidth="8"
          fill="none"
          style={{ filter: 'url(#innerShadow)' }}
        />

        {/* Back of bowl */}
        <path
          d="M 20 80 Q 100 140, 180 80 Q 100 160, 20 80"
          fill="url(#bowlGradient)"
          style={{ filter: 'url(#innerShadow)' }}
        />

        {/* Front of bowl */}
        <path
          d="M 20 80 Q 100 100, 180 80 L 180 120 Q 100 180, 20 120 Z"
          fill={bowlColor}
        />

        {/* Front rim */}
        <path
          d="M 20 80 Q 100 100, 180 80"
          stroke={lighterBowlColor}
          strokeWidth="8"
          fill="none"
        />

        {/* Rim highlight */}
        <path
          d="M 20 80 Q 100 100, 180 80"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Salad container */}
      <div className="relative" style={{ 
        width: '100%', 
        height: '100%',
        zIndex: 3,
        position: 'absolute',
        top: '0'
      }}>
        {/* Lettuce layers */}
        {lettuce.map((leaf, i) => (
          <div key={`leaf-${i}`}
            className="absolute transition-all duration-500"
            style={{
              width: `${leaf.size}px`,
              height: `${leaf.size * 1.5}px`,
              backgroundColor: colors.lettuce,
              borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%',
              left: `${leaf.center.x}px`,
              top: `${leaf.center.y}px`,
              transform: `translate(-50%, -50%) rotate(${leaf.rotation}deg)`,
              filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))',
              zIndex: 10 + leaf.layer,
            }}
          />
        ))}

        {/* Toppings */}
        {toppings.map((topping, i) => (
          <div key={`topping-${i}`}
            className="absolute transition-all duration-500"
            style={{
              width: `${topping.size}px`,
              height: `${topping.size}px`,
              backgroundColor: colors[topping.type],
              borderRadius: topping.type === 'crouton' ? '3px' : '50%',
              left: `${topping.position.x}px`,
              top: `${topping.position.y}px`,
              transform: 'translate(-50%, -50%)',
              boxShadow: topping.type === 'crouton' 
                ? '2px 2px 4px rgba(0,0,0,0.2)' 
                : '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 50,
            }}
          />
        ))}

        {/* Dressing */}
        {dressing.map((drizzle, i) => (
          <div key={`drizzle-${i}`}
            className="absolute transition-all duration-500"
            style={{
              width: `${drizzle.length}px`,
              height: '3px',
              backgroundColor: colors.dressing,
              left: `${drizzle.start.x}px`,
              top: `${drizzle.start.y}px`,
              transform: `translate(-50%, -50%) rotate(${drizzle.rotation}deg)`,
              boxShadow: '0 0 4px rgba(255,250,220,0.6)',
              zIndex: 100,
            }}
          />
        ))}
      </div>

      {/* Front bowl overlay (for occlusion) */}
      <svg
        width={baseSize * bowlScale}
        height={baseSize * bowlScale}
        viewBox="0 0 200 200"
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{ zIndex: 4 }}
      >
        <path
          d="M 20 80 Q 100 100, 180 80 L 180 120 Q 100 180, 20 120 Z"
          fill={bowlColor}
          fillOpacity="0.9"
        />
      </svg>
    </div>
  )
}

export default TreeComponent