import { Mic } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0A0A0A] border-t border-white/10 py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <Mic className="w-5 h-5 text-yellow-400" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">TalkInvoice</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">利用規約</a>
                        <a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a>
                        <a href="#" className="hover:text-white transition-colors">特定商取引法に基づく表記</a>
                        <a href="#" className="hover:text-white transition-colors">お問い合わせ</a>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-600">
                    &copy; {new Date().getFullYear()} TalkInvoice. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
