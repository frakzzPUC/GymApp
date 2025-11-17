'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/data-display/card"
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricPoint {
  date: string | Date
  value: number
}

interface MetricChartProps {
  data: MetricPoint[]
  title: string
  unit: string
  color?: string
  targetValue?: number
  showTrend?: boolean
}

export function MetricChart({ 
  data, 
  title, 
  unit, 
  color = '#3b82f6', 
  targetValue, 
  showTrend = true 
}: MetricChartProps) {
  // Preparar dados para o gráfico
  const chartData = data.map(point => ({
    date: new Date(point.date).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    }),
    value: point.value,
    fullDate: new Date(point.date)
  })).sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())

  // Calcular tendência
  const getTrend = () => {
    if (chartData.length < 2) return null
    
    const firstValue = chartData[0].value
    const lastValue = chartData[chartData.length - 1].value
    const difference = lastValue - firstValue
    const percentChange = (difference / firstValue) * 100
    
    return {
      direction: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
      value: Math.abs(difference),
      percentage: Math.abs(percentChange)
    }
  }

  const trend = getTrend()

  // Formatador customizado para o tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-md">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-blue-600">
            {`${payload[0].value.toFixed(1)} ${unit}`}
          </p>
          {targetValue && (
            <p className="text-gray-500 text-sm">
              Meta: {targetValue} {unit}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {title}
          </CardTitle>
          <CardDescription>Evolução ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Nenhum dado disponível
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {showTrend && trend && (
            <div className="flex items-center gap-2 text-sm">
              {trend.direction === 'up' && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+{trend.value.toFixed(1)} {unit}</span>
                </div>
              )}
              {trend.direction === 'down' && (
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  <span>-{trend.value.toFixed(1)} {unit}</span>
                </div>
              )}
              {trend.direction === 'stable' && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Minus className="h-4 w-4" />
                  <span>Estável</span>
                </div>
              )}
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Evolução ao longo do tempo
          {chartData.length > 0 && (
            <span className="ml-2">
              • {chartData.length} medição{chartData.length !== 1 ? 'ões' : ''}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
              />
              {/* Linha da meta se definida */}
              {targetValue && (
                <Line
                  type="monotone"
                  dataKey={() => targetValue}
                  stroke="#ef4444"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Estatísticas resumidas */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-500">Atual</p>
            <p className="font-semibold">
              {chartData[chartData.length - 1].value.toFixed(1)} {unit}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Média</p>
            <p className="font-semibold">
              {(chartData.reduce((sum, point) => sum + point.value, 0) / chartData.length).toFixed(1)} {unit}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Variação</p>
            <p className="font-semibold">
              {trend ? `${trend.percentage.toFixed(1)}%` : 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente específico para gráfico de peso
export function WeightChart({ data, targetWeight }: { data: MetricPoint[], targetWeight?: number }) {
  return (
    <MetricChart
      data={data}
      title="Evolução do Peso"
      unit="kg"
      color="#10b981"
      targetValue={targetWeight}
    />
  )
}

// Componente específico para gráfico de gordura corporal
export function BodyFatChart({ data, targetBodyFat }: { data: MetricPoint[], targetBodyFat?: number }) {
  return (
    <MetricChart
      data={data}
      title="Percentual de Gordura"
      unit="%"
      color="#f59e0b"
      targetValue={targetBodyFat}
    />
  )
}