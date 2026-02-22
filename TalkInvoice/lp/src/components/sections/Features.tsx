import { Moon, Sparkles, ShieldCheck } from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: Moon,
            title: "完全ダークモード",
            desc: "夜間の車内でも目に優しい。疲れ目に配慮したUIデザインで、作業の負担を減らします。",
        },
        {
            icon: Sparkles,
            title: "AI精度",
            desc: "曖昧な言い回しもしっかり理解。日付や金額、取引先名も文脈から自動で補正します。",
        },
        {
            icon: ShieldCheck,
            title: "安心のセキュリティ",
            desc: "入力データはAI学習に一切使用されません。情報はあなたの端末内で安全に完結します。",
        },
    ];

    return (
        <section id="features" className="py-24 bg-[#1A1A1E]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                    プロフェッショナルのための機能
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6">
                                <feature.icon className="w-6 h-6 text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
