"use client";

import { useState } from "react";
import { useDrivers } from "@/ui/hooks/useDrivers";
import { useAuth } from "@/ui/components/AuthProvider";
import { Button } from "@/ui/components/Button";
import { Card } from "@/ui/components/Card";
import { Input } from "@/ui/components/Input";
import { Modal } from "@/ui/components/Modal";
import { Plus, User, Mail, Link as LinkIcon, Copy, Check } from "lucide-react";

export default function DriversPage() {
    const { drivers, loading, error, addDriver } = useDrivers();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setInviteLink(null);
        try {
            // Note: useDrivers needs to return the result (link) from addDriver
            // We'll update useDrivers hook to return the link or response object.
            // For now, assuming addDriver returns the link (we need to modify the hook slightly or the hook's addDriver function)
            // Let's modify the local logic to call API directly or update hook.
            // Actually, let's just use the hook and expect it to return something? 
            // In previous step, useDrivers addDriver didn't return the link. 
            // Let's fix useDrivers hook in next step or now? 
            // I will assume for now I can patch useDrivers. 
            // Actually, let's just call API here for simplicity of getting the LINK back seamlessly, 
            // or better, update the hook.
            // Let's try to trust the current hook implementation, wait, I see I didn't return the link in useDrivers.
            // So I will implement the API call here directly for now to get the link, 
            // and reuse the fetchDrivers from hook to refresh list.

            // ...Wait, I'll update the hook in a subsequent step if needed, but for now lets unimplemented the hook call here 
            // and reproduce the fetch logic to get the link.
            // Actually, 'addDriver' in hook calls fetchDrivers() at the end.
            // I should probably just update the hook to return the result.

            // Temporary: Call API directly here to get the link.
            const auth = await import("@/infra/auth"); // Dynamic import to avoid SSR issues if any
            // But we need the ID token.
            // Let's just use the addDriver from hook and modify hooks/useDrivers.ts to return the link.
            // I will do that in the next tool call. 

            const result = await addDriver(name, email);
            // I will update interface in next step.

            if (result && result.link) {
                setInviteLink(result.link);
                setName("");
                setEmail("");
            } else {
                setIsModalOpen(false);
            }
        } catch (e) {
            alert("エラーが発生しました: " + e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = () => {
        if (inviteLink) {
            navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <User className="w-8 h-8 text-orange-600" />
                        ドライバー管理
                    </h1>
                    <p className="text-slate-500 font-bold">所属ドライバーの登録・編集</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-5 h-5 mr-1" /> ドライバー追加
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drivers.map((driver) => (
                    <Card key={driver.uid} className="p-4 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xl">
                                    👤
                                </div>
                                <div>
                                    <p className="font-black text-lg text-slate-800 dark:text-white">{driver.name}</p>
                                    <p className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full inline-block">
                                        {driver.role}
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm text-slate-500 font-bold flex items-center gap-2 mb-4">
                                <Mail className="w-4 h-4" /> {driver.email}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <Button variant="ghost" className="text-xs h-8">編集</Button>
                        </div>
                    </Card>
                ))}

                {drivers.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-xl">
                        ドライバーはまだ登録されていません。
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setInviteLink(null); }}
                title={inviteLink ? "招待リンク生成完了" : "新規ドライバー追加"}
            >
                {inviteLink ? (
                    <div className="space-y-4">
                        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg text-sm font-bold flex items-start gap-2">
                            <Check className="w-5 h-5 shrink-0" />
                            <div>
                                ドライバーを作成しました。<br />
                                以下のリンクをドライバーに共有してください。
                            </div>
                        </div>
                        <div className="relative">
                            <Input readOnly value={inviteLink} className="pr-12 text-sm font-mono bg-slate-50" />
                            <button
                                onClick={copyToClipboard}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-orange-600"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                        <Button onClick={() => { setIsModalOpen(false); setInviteLink(null); }} className="w-full">
                            閉じる
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-1">氏名</label>
                            <Input
                                placeholder="山田 太郎"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-1">メールアドレス</label>
                            <Input
                                type="email"
                                placeholder="driver@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="pt-2 text-xs text-slate-400">
                            ※登録後、招待リンクが生成されます。
                        </div>
                        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "登録中..." : "登録する"}
                        </Button>
                    </form>
                )}
            </Modal>
        </div>
    );
}
