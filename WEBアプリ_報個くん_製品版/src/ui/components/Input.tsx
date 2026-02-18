import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", error, ...props }, ref) => {
        return (
            <div className="w-full">
                <input
                    ref={ref}
                    className={`
            w-full p-4 rounded-xl border-2 bg-white text-slate-800 font-bold placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
            disabled:cursor-not-allowed disabled:opacity-50
            dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500
            ${error ? "border-red-500 focus:ring-red-500" : "border-slate-200"}
            ${className}
          `}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-500 font-bold">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";
