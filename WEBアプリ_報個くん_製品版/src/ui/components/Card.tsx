import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card = ({ children, className = "", ...props }: CardProps) => {
    return (
        <div
            className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
