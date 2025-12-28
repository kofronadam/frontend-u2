import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ProgressDonut({ done = 0, total = 0, size = 100, showLabel = true }) {
  const remaining = Math.max(0, total - done)
  const data = {
    labels: ['Hotovo', 'Nehotovo'],
    datasets: [
      {
        data: total === 0 ? [1, 0] : [done, remaining],
        backgroundColor: ['#10B981', '#E5E7EB'],
        hoverBackgroundColor: ['#059669', '#D1D5DB'],
        borderWidth: 0
      }
    ]
  }

  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  const options = {
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
  }

  return (
    <div style={{ width: size, height: size, display: 'inline-block', position: 'relative' }}>
      <Doughnut data={data} options={options} />
      {showLabel && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: Math.max(12, size * 0.2),
          fontWeight: 600,
          color: 'var(--text-primary)'
        }}>
          {percent}%
        </div>
      )}
    </div>
  )
}