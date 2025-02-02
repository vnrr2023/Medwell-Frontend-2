"use client"

import { AreaChart } from "@tremor/react"

interface SparkAreaChartProps {
  data: number[]
  categories: string[]
  index: string
  colors: string[]
  className?: string
}

export function SparkAreaChart({ data, categories, index, colors, className }: SparkAreaChartProps) {
  const chartData = data.map((value, idx) => ({
    [index]: idx + 1,
    [categories[0]]: value,
  }))

  return (
    <AreaChart
      className={className}
      data={chartData}
      index={index}
      categories={categories}
      colors={colors}
      showXAxis={false}
      showYAxis={false}
      showLegend={false}
      showGridLines={false}
      showAnimation={true}
      curveType="monotone"
      startEndOnly={false}
      showTooltip={true}
    />
  )
}

