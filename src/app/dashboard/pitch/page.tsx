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
    { time: '0:00–0:30', section: 'সূচনা', points: ['লাইভে যাওয়ার জন্য অনুরোধ', 'ডেটা, অনুমান নয়'] },
    { time: '0:30–1:15', section: 'ঝুঁকি প্রথম', points: ['স্যান্ডবক্স টেস্টিং', 'ব্যর্থতা সমাধান করা হয়েছে'] },
    { time: '1:15–1:55', section: 'প্রমাণ', points: ['শূন্য গুরুতর সমস্যা', 'কোনো নীরব ব্যর্থতা নেই'] },
    { time: '1:55–3:00', section: 'সুপারিশ', points: ['সূচকটি সবুজ', 'অনুমোদনের জন্য অনুরোধ'] },
  ]

  const deliveryTips = [
    'পরিষ্কার এবং আত্মবিশ্বাসের সাথে কথা বলুন',
    'মূল বিবৃতির পরে বিরতি দিন',
    'এই বলে শেষ করুন, "আমরা লাইভে যাওয়ার জন্য অনুমোদনের অনুরোধ করছি।"',
  ]

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h1 className="font-headline text-3xl font-semibold">এক্সিকিউটিভ লাইভ পিচ গাইড</h1>
        <p className="text-muted-foreground">
          সিইও / বোর্ডের কাছে ৩-মিনিটের লাইভ অনুমোদনের পিচের জন্য দ্রুত নির্দেশিকা
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            <span>পিচের সংক্ষিপ্ত বিবরণ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><strong className="text-foreground">উদ্দেশ্য:</strong> লাইভে যাওয়ার চূড়ান্ত অনুমোদন নিশ্চিত করা</p>
          <p><strong className="text-foreground">শ্রোতা:</strong> সিইও, বোর্ড, সিনিয়র ম্যানেজমেন্ট</p>
          <p><strong className="text-foreground">সময়কাল:</strong> ৩ মিনিট</p>
          <p><strong className="text-foreground">ধরন:</strong> আত্মবিশ্বাসী, ডেটা-চালিত</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            <span>পিচের বিভাজন</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">সময়</TableHead>
                <TableHead className="w-[150px]">বিভাগ</TableHead>
                <TableHead>মূল বিষয়</TableHead>
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
                              সূচকটি <Badge variant="outline" className="border-chart-2/60 bg-chart-2/10 font-semibold text-chart-2">সবুজ</Badge>
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
            <span>আপত্তি মোকাবেলা</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-semibold text-foreground">প্রশ্ন: "লাইভের পরে যদি কিছু ভুল হয়?"</p>
            <p className="text-muted-foreground pl-4">উত্তর: "আমাদের পর্যবেক্ষণ, সতর্কতা এবং রোলব্যাক প্রস্তুত আছে।"</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mic className="h-5 w-5 text-primary" />
            <span>উপস্থাপনার টিপস</span>
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
