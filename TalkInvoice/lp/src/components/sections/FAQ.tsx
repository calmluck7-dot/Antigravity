import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQ() {
    const faqs = [
        {
            question: "インボイス制度に対応していますか？",
            answer: "はい、適格請求書発行事業者の登録番号（T番号）の入力に対応しており、要件を満たした請求書を作成可能です。",
        },
        {
            question: "Android版はありますか？",
            answer: "現在はiOS版のみの提供となっております。Android版の開発も検討中です。",
        },
        {
            question: "領収書は作れますか？",
            answer: "はい、請求書だけでなく領収書モードへの切り替えも可能です。",
        },
        {
            question: "解約はいつでもできますか？",
            answer: "はい、Apple IDのサブスクリプション管理画面からいつでも解約可能です。解約後も期間終了までは有料プランをご利用いただけます。",
        },
    ];

    return (
        <section id="faq" className="py-24 bg-[#1A1A1E]">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-16">
                    よくある質問
                </h2>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/10">
                            <AccordionTrigger className="text-left text-lg py-6 hover:text-yellow-400 hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-400 leading-relaxed pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
