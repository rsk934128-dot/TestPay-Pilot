'use client'

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface TransactionStats {
  success: number
  failed: number
}

export function TransactionChart({ stats }: { stats: TransactionStats }) {
  const data = [
    {
      name: 'Transactions',
      success: stats.success,
      failed: stats.failed,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Overview</CardTitle>
        <CardDescription>
          A visual summary of successful vs. failed payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={100}>
          <BarChart
            layout="vertical"
            data={data}
            stackOffset="expand"
            margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
          >
            <XAxis type="number" hide domain={[0, 1]} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
                formatter={(value, name, props) => {
                    const total = props.payload.success + props.payload.failed;
                    const percentage = total > 0 ? (Number(value) / total * 100).toFixed(0) : 0;
                    const key = name === 'success' ? 'Successful' : 'Failed'
                    return [`${value} (${percentage}%)`, key]
                }}
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                }}
            />
            <Bar dataKey="success" name="success" fill="hsl(var(--chart-2))" stackId="a" radius={[4, 0, 0, 4]} />
            <Bar dataKey="failed" name="failed" fill="hsl(var(--chart-1))" stackId="a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
