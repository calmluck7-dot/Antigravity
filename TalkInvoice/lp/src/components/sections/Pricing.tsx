import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
    const plans = [
        {
            name: "Free",
            price: "¥0",
            limit: "3枚",
            features: [
                "AI音声入力",
                "PDF作成・共有",
                "端末内保存",
            ],
            notIncluded: ["発行枚数無制限"],
            button: "無料で始める",
            highlight: false,
        },
        {
            name: "Basic",
            price: "¥500",
            period: "/月",
            limit: "30枚",
            features: [
                "AI音声入力",
                "PDF作成・共有",
                "端末内保存",
                "月間30枚まで発行",
            ],
            notIncluded: ["発行枚数無制限"],
            button: "Basicプランで始める",
            highlight: true,
            badge: "一番人気",
        },
        {
            name: "Pro",
            price: "¥1,000",
            period: "/月",
            limit: "無制限",
            features: [
                "AI音声入力",
                "PDF作成・共有",
                "端末内保存",
                "発行枚数 無制限",
                "優先サポート",
            ],
            notIncluded: [],
            button: "Proプランで始める",
            highlight: false,
        },
    ];

    return (
        <section id="pricing" className="py-24 bg-[#0A0A0A]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                    シンプルでわかりやすい料金プラン
                </h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-2xl border flex flex-col ${plan.highlight
                                    ? "bg-[#1A1A1E] border-yellow-500 shadow-2xl shadow-yellow-500/10 scale-105 z-10"
                                    : "bg-[#0A0A0A] border-white/10"
                                }`}
                        >
                            {plan.badge && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-xl font-medium text-gray-400 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    {plan.period && <span className="text-sm text-gray-400">{plan.period}</span>}
                                </div>
                                <div className="mt-4 text-sm font-medium text-yellow-400">
                                    月間発行枚数: <span className="text-lg">{plan.limit}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0" />
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </div>
                                ))}
                                {plan.notIncluded.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 opacity-50">
                                        <XCircle className="w-5 h-5 text-gray-600 shrink-0" />
                                        <span className="text-gray-500 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                className={`w-full font-bold ${plan.highlight
                                        ? "bg-yellow-400 text-black hover:bg-yellow-500"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                    }`}
                            >
                                {plan.button}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
