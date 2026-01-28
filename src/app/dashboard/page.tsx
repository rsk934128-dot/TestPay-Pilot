'use client'

import { CheckCircle, CreditCard, Banknote } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { Badge } from '@/components/ui/badge'

export default function SettlementProofPage() {
  return (
    <div className="flex flex-col flex-1 h-full -m-6 p-0">
      {/* Page Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/90 rounded-md flex items-center justify-center">
                <Icons.logo />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight">লাইভ পেমেন্ট সিস্টেম – প্রথম সেটেলমেন্ট প্রমাণ</h1>
                <p className="text-sm text-primary-foreground/80">টেস্টপে পাইলট - বাংলাদেশ</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Icons.shurjopay className="h-8 w-auto" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 flex-1 bg-secondary/30 rounded-b-lg">
        {/* Left Column: Key Metrics */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">কী মেট্রিক্স</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">মোট লেনদেন (লাইভ)</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-chart-2" />
                  <span className="font-semibold">1</span>
                </div>
              </div>
               <div className="flex items-center justify-between">
                <span className="text-muted-foreground">নিষ্পত্তি পরিমাণ</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-chart-2" />
                  <span className="font-semibold">৳10</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">গেটওয়ে</span>
                 <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-chart-2" />
                  <span className="font-semibold">সুরজোপে</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ব্যাংক অ্যাকাউন্ট</span>
                 <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-chart-2" />
                  <span className="font-semibold">ব্যক্তিগত/অ্যাডমিন</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">স্ট্যাটাস</span>
                <div className="flex items-center gap-2">
                   <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/40">সাফল্য</Badge>
                   <CheckCircle className="w-5 h-5 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Transaction Snapshot */}
        <div className="lg:col-span-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">লেনদেনের স্ন্যাপশট</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full pt-6">
              <div className="flex items-start gap-6">
                {/* Transaction Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center p-3 rounded-md bg-muted/50">
                    <Icons.shurjopay className="h-6 w-auto" />
                    <span className="ml-2 font-semibold">সুরজোপে ড্যাশবোর্ড</span>
                  </div>
                  <div className="space-y-3 p-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">অর্ডার আইডি:</span>
                      <span className="font-mono">-----------</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">পরিমাণ:</span>
                      <span className="font-bold text-lg">৳10.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">স্ট্যাটাস:</span>
                      <Badge variant="outline" className="text-chart-2 border-chart-2/50">সাফল্য</Badge>
                    </div>
                  </div>
                  
                  {/* Mini History */}
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse"></div>
                            <span className="font-semibold">লাইভ-০০১</span>
                        </div>
                        <span className="font-semibold">৳১০.০০</span>
                        <div className="flex items-center gap-2 text-chart-2">
                            <CheckCircle className="w-4 h-4"/>
                            <span>সাফল্য</span>
                        </div>
                    </div>
                  </div>

                </div>

                {/* Phone Mockup */}
                <div className="min-w-[220px] mt-4">
                  <div className="bg-black border-4 border-gray-700 rounded-3xl p-1 shadow-xl">
                    <div className="bg-white rounded-2xl p-3 text-gray-800 space-y-2 h-[250px] flex flex-col">
                       <div className="flex justify-between items-center text-xs px-1">
                        <span className="text-gray-500">＜</span>
                        <span className="font-semibold">ব্যাংক এসএমএস</span>
                        <span className="font-bold">⋮</span>
                      </div>
                      <div className="flex-1 flex items-end pb-2">
                        <div className="bg-gray-200 rounded-lg p-3 text-xs w-full">
                          <p>আপনার A/C *1234 DBBL-এ TK. 10.00 জমা হয়েছে। ব্যালেন্স TK. xxx, ২৯ জানু ২০২৬ তারিখে।</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Process Flow */}
              <div className="flex items-center justify-around pt-4 mt-auto">
                  <div className="flex flex-col items-center gap-2 text-center w-24">
                      <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-primary rounded-full border-2 border-primary">
                          <CreditCard className="w-6 h-6"/>
                      </div>
                      <span className="text-xs font-semibold">পেমেন্ট শুরু হয়েছে</span>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed mx-2 self-center -translate-y-5"></div>
                  <div className="flex flex-col items-center gap-2 text-center w-24">
                      <div className="w-12 h-12 flex items-center justify-center bg-green-100 text-chart-2 rounded-full border-2 border-chart-2">
                          <CheckCircle className="w-6 h-6"/>
                      </div>
                      <span className="text-xs font-semibold">গেটওয়ে সফল</span>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed mx-2 self-center -translate-y-5"></div>
                  <div className="flex flex-col items-center gap-2 text-center w-24">
                      <div className="w-12 h-12 flex items-center justify-center bg-green-100 text-chart-2 rounded-full border-2 border-chart-2">
                          <Banknote className="w-6 h-6"/>
                      </div>
                      <span className="text-xs font-semibold">ব্যাংক ক্রেডিট</span>
                  </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Audit Summary */}
        <div className="lg:col-span-3">
          <Card className="border-accent">
            <CardHeader className="bg-accent/10">
              <CardTitle className="text-lg text-accent-foreground/90">অডিট সারাংশ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm pt-6">
              <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>পাইলট মোড: হ্যাঁ (সীমা ৳10)</span>
              </div>
              <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>রোলব্যাক পরীক্ষিত: <CheckCircle className="inline w-5 h-5 text-chart-2" /></span>
              </div>
              <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>পরিবেশ: <Badge className="bg-primary/80">লাইভ</Badge> .env.production</span>
              </div>
              <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>সম্মতি: নিরাপদ শংসাপত্র শুধুমাত্র অ্যাডমিন</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
