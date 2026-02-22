import { AlertCircle, Clock, FileWarning } from "lucide-react";

export default function Problem() {
    const problems = [
        {
            icon: Clock,
            text: "疲れて帰ってきてからの\nPC作業がつらい...",
        },
        {
            icon: FileWarning,
            text: "請求書を作るためだけに\n事務所に戻っている...",
        },
        {
            icon: AlertCircle,
            text: "移動中の車内で\nサクッと終わらせたい...",
        },
    ];

    return (
        <section className="py-20 bg-[#1A1A1E] relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                    <span className="text-gray-400 block text-lg font-normal mb-2">毎月末、</span>
                    こんな悩みありませんか？
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {problems.map((item, index) => (
                        <div key={index} className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-colors group">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-500/10 transition-colors">
                                <item.icon className="w-8 h-8 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                            </div>
                            <p className="text-xl text-center text-gray-200 whitespace-pre-line leading-relaxed">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/5 via-[#1A1A1E] to-[#1A1A1E] pointer-events-none" />
        </section>
    );
}
