import { Mic, Cpu, FileCheck } from "lucide-react";

export default function Solution() {
    const steps = [
        {
            icon: Mic,
            title: "Step 1: 話す",
            desc: "マイクボタンを押して、いつものように話してください。",
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            icon: Cpu,
            title: "Step 2: AIが解析",
            desc: "最新のAIが内容を理解し、自動で項目別に仕分けます。",
            color: "text-purple-400",
            bg: "bg-purple-400/10",
        },
        {
            icon: FileCheck,
            title: "Step 3: PDF完成",
            desc: "その場できれいなPDF請求書が完成。LINEやメールですぐ送れます。",
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
        },
    ];

    return (
        <section className="py-24 bg-[#0A0A0A]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        <span className="text-yellow-400">TalkInvoice</span>なら、話すだけ。
                    </h2>
                    <p className="text-gray-400 text-lg">
                        3つのステップで、請求書作成が完了します。
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-yellow-500/20" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center">
                            <div className={`w-24 h-24 rounded-full ${step.bg} flex items-center justify-center mb-8 relative z-10 border border-white/5`}>
                                <step.icon className={`w-10 h-10 ${step.color}`} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                            <p className="text-gray-400 leading-relaxed px-4">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
