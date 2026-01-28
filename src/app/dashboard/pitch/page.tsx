'use client'

import { Target, Clock, Brain, Mic } from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function PitchGuidePage() {
  const pitchBreakdown = [
    { time: '0:00–0:30', section: 'Opening', points: ['Ask to go LIVE', 'Data, not assumptions'] },
    { time: '0:30–1:15', section: 'Risk First', points: ['Sandbox testing', 'Failures resolved'] },
    { time: '1:15–1:55', section: 'Evidence', points: ['Zero critical issues', 'No silent failures'] },
    { time: '1:55–3:00', section: 'Recommendation', points: ['Indicator is GREEN', 'Ask for approval'] },
  ]

  const deliveryTips = [
    'Speak clearly and confidently',
    'Pause after key statements',
    'End with, "We request approval to proceed to LIVE."',
  ]

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h1 className="font-headline text-3xl font-semibold">Executive Live Pitch Readme</h1>
        <p className="text-muted-foreground">
          Quick Guide for 3-Minute LIVE Approval Pitch to CEO / Board
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            <span>Pitch Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><strong className="text-foreground">Purpose:</strong> Secure final approval to go LIVE</p>
          <p><strong className="text-foreground">Audience:</strong> CEO, Board, Senior Management</p>
          <p><strong className="text-foreground">Duration:</strong> 3 minutes</p>
          <p><strong className="text-foreground">Tone:</strong> Confident, data-driven</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            <span>Pitch Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Time</TableHead>
                <TableHead className="w-[150px]">Section</TableHead>
                <TableHead>Key Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pitchBreakdown.map((item) => (
                <TableRow key={item.section}>
                  <TableCell className="font-mono text-xs">{item.time}</TableCell>
                  <TableCell className="font-semibold">{item.section}</TableCell>
                  <TableCell>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {item.points.map((point, index) => (
                        <li key={index}>
                          {point.includes("GREEN") ? (
                            <>
                              Indicator is <Badge variant="outline" className="border-chart-2/60 bg-chart-2/10 font-semibold text-chart-2">GREEN</Badge>
                            </>
                          ) : (
                            point
                          )}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            <span>Objection Handling</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-semibold text-foreground">Q: "What if something goes wrong after LIVE?"</p>
            <p className="text-muted-foreground pl-4">A: "We have monitoring, alerts, and rollback ready."</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mic className="h-5 w-5 text-primary" />
            <span>Delivery Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {deliveryTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
