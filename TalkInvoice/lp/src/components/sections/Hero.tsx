import { Button } from "@/components/ui/button";
import { Mic, ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-yellow-400 mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    New: AI精度が大幅に向上しました
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight">
                    現場の帰り道、<br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                        声だけで請求書
                    </span>
                    が完成。
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    PC不要。スマホに向かって話すだけ。
                    <br />
                    AIがあなたの代わりに請求書を作成・PDF化します。
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-white text-black hover:bg-gray-100 font-bold">
                        無料で試してみる
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-white/20 text-white hover:bg-white/10">
                        デモを見る
                    </Button>
                </div>

                {/* Mockup Placeholder */}
                <div className="relative mx-auto w-full max-w-[320px] md:max-w-[800px] perspective-1000">
                    <div className="relative z-10 bg-[#1A1A1E] rounded-[3rem] border-8 border-[#2A2A2E] shadow-2xl overflow-hidden aspect-[9/19.5] md:aspect-auto md:h-[600px] mx-auto md:w-[300px]">
                        {/* Replace with actual App Screenshot */}
                        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-6 text-center">
                            <Mic className="w-16 h-16 text-yellow-500 mb-4 animate-pulse" />
                            <p className="text-gray-400 font-medium">聞いています...</p>
                            <div className="mt-8 space-y-2 w-full">
                                <div className="h-2 bg-yellow-500/20 rounded-full w-full animate-pulse" style={{ animationDelay: '0ms' }} />
                                <div className="h-2 bg-yellow-500/20 rounded-full w-3/4 animate-pulse" style={{ animationDelay: '150ms' }} />
                                <div className="h-2 bg-yellow-500/20 rounded-full w-5/6 animate-pulse" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>

                    {/* Glow effect behind phone */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[600px] bg-yellow-500/20 blur-[80px] -z-10 rounded-full" />
                </div>
            </div>
        </section>
    );
}
