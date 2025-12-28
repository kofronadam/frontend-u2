import React, { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

function cssVar(name, fallback) {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name)
    return v ? v.trim() : fallback
  } catch {
    return fallback
  }
}

export default function ProgressDonut({ done = 0, total = 0, size = 100, showLabel = true }) {
  const remaining = Math.max(0, total - done)
  // read colors from CSS variables so donut matches current theme
  const accent = cssVar('--accent', '#10B981')
  const accentStrong = cssVar('--accent-strong', '#059669')
  const bgSegment = cssVar('--border', '#E5E7EB') // use border color as "track"
  const textColor = cssVar('--text-primary', '#111827')

  const data = useMemo(() => ({
    labels: ['Done', 'Remaining'],
    datasets: [
      {
        data: total === 0 ? [1, 0] : [done, remaining],
        backgroundColor: [accent, bgSegment],
        hoverBackgroundColor: [accentStrong, bgSegment],
        borderWidth: 0
      }
    ]
  }), [done, total, accent, accentStrong, bgSegment, remaining])

  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  const options = useMemo(() => ({
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}`
        }
      }
    }
  }), [])

  return (
    <div style={{ width: size, height: size, display: 'inline-block', position: 'relative' }}>
      <Doughnut data={data} options={options} />
      {showLabel && (
        <div
          className="progress-overlay"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: Math.max(12, size * 0.20),
            fontWeight: 700,
            color: textColor,
            pointerEvents: 'none'
          }}
          aria-hidden
        >
          {percent}%
        </div>
      )}
    </div>
  )
}