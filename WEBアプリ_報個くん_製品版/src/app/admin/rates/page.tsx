"use client";

import { useState } from "react";
import { useRates } from "@/ui/hooks/useRates";
import { useAuth } from "@/ui/components/AuthProvider";
import { Button } from "@/ui/components/Button";
import { Card } from "@/ui/components/Card";
import { Input } from "@/ui/components/Input";
import { Modal } from "@/ui/components/Modal";
import { Plus, CreditCard, Trash2, Coins } from "lucide-react";

export default function RatesPage() {
    const { rates, loading, error, addRateTable, deleteRateTable } = useRates();
    const { role } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addRateTable(name, Number(unitPrice), description);
            setIsModalOpen(false);
            setName("");
            setUnitPrice("");
            setDescription("");
        } catch (e) {
            alert("エラーが発生しました: " + e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("本当に削除しますか？")) return;
        try {
            await deleteRateTable(id);
        } catch (e) {
            alert("削除に失敗しました: " + e);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <CreditCard className="w-8 h-8 text-indigo-600" />
                        単価設定
                    </h1>
                    <p className="text-slate-500 font-bold">配送単価パターンの管理</p>
                </div>
                {role !== "developer" && (
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="w-5 h-5 mr-1" /> 単価追加
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rates.map((rate) => (
                    <Card key={rate.id} className="p-4 flex flex-col justify-between group">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-black text-lg text-slate-800 dark:text-white">{rate.name}</p>
                                <div className="bg-orange-100 text-orange-700 font-black px-2 py-1 rounded text-sm flex items-center gap-1">
                                    <Coins className="w-3 h-3" />
                                    ¥{rate.unitPrice.toLocaleString()}
                                </div>
                            </div>
                            {rate.description && (
                                <p className="text-sm text-slate-500 font-bold mb-4 line-clamp-2">
                                    {rate.description}
                                </p>
                            )}
                        </div>
                        {role !== "developer" && (
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                                <Button
                                    variant="ghost"
                                    className="text-xs h-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(rate.id)}
                                >
                                    <Trash2 className="w-4 h-4" /> 削除
                                </Button>
                            </div>
                        )}
                    </Card>
                ))}

                {rates.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-xl">
                        単価設定はまだありません。「単価追加」から登録してください。
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="新規単価追加"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">単価名（例：通常、夜間、長距離）</label>
                        <Input
                            placeholder="通常配送"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">単価 (円)</label>
                        <Input
                            type="number"
                            placeholder="150"
                            value={unitPrice}
                            onChange={e => setUnitPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">説明・メモ</label>
                        <Input
                            placeholder="近距離エリアの配送"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "登録中..." : "登録する"}
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
