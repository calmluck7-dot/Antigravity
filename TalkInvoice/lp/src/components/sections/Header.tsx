import { Button } from "@/components/ui/button";
import { Mic, FileText, CheckCircle2, DollarSign, ShieldCheck, ArrowRight, Menu } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">TalkInvoice</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">機能</Link>
                    <Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">料金プラン</Link>
                    <Link href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">よくある質問</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="hidden md:inline-flex border-white/20 hover:bg-white/10 text-white">
                        ログイン
                    </Button>
                    <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:opacity-90 transition-opacity">
                        アプリをダウンロード
                    </Button>
                </div>
            </div>
        </header>
    );
}
