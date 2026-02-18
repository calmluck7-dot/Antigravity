"use client";

import { useEffect } from "react";
import { Button } from "@/ui/components/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-black mb-4">Something went wrong!</h2>
            <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6 max-w-lg overflow-auto">
                <p className="font-mono text-sm text-red-600">{error.message}</p>
            </div>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </Button>
        </div>
    );
}
