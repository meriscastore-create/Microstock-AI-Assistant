
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    ...props 
}) => {
    const baseClasses = "font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark transition-all duration-200 ease-in-out inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: 'bg-brand-secondary hover:bg-blue-500 text-white focus:ring-brand-secondary',
        secondary: 'bg-gray-600 hover:bg-gray-500 text-white focus:ring-gray-500',
        accent: 'bg-brand-accent hover:bg-blue-400 text-brand-dark focus:ring-brand-accent',
    };

    const sizeClasses = {
        sm: 'py-2 px-3 text-sm',
        md: 'py-2.5 px-5 text-base',
        lg: 'py-3 px-6 text-lg',
    };
    
    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    
    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
};

export default Button;
