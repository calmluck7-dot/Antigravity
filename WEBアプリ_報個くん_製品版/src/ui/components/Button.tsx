import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "success" | "info";
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", isLoading, children, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-xl font-black transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none py-4 px-6 text-lg";

        const variants = {
            primary: "bg-orange-600 text-white shadow-md hover:bg-orange-700",
            secondary: "bg-slate-700 text-white shadow-sm hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500",
            outline: "border-2 border-slate-200 text-slate-600 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700",
            danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30",
            ghost: "text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800",
            success: "bg-emerald-600 text-white shadow-md hover:bg-emerald-700",
            info: "bg-sky-500 text-white shadow-md hover:bg-sky-600"
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${className}`}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";
