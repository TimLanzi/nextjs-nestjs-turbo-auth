import React, { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, VariantProps } from 'class-variance-authority';

const button = cva('font-medium inline-flex items-center justify-center border-2', {
  variants: {
    intent: {
      primary: 'bg-indigo-500 text-white border-indigo-500 transition-colors hover:bg-indigo-600 hover:border-indigo-600',
      secondary: 'bg-transparent text-indigo-500 border-indigo-500 transition-colors hover:text-indigo-600 hover:border-indigo-600',
      danger: 'text-white bg-red-600 border-red-600 transition-colors hover:bg-red-700 hover:border-red-700',
    },
    size: {
      inline: 'text-base',
      sm: 'text-sm px-2 h-8',
      md: 'text-base px-4 h-10',
      lg: 'text-lg px-6 h-12',
    },
    rounded: {
      normal: 'rounded',
      lg: 'rounded-3xl'
    },
  },
  defaultVariants: {
    intent: "primary",
    size: 'md',
    rounded: 'normal',
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  label: string;
  icon?: React.ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    label,
    className,
    intent,
    size,
    rounded,
    icon,
    ...rest
  }, ref) => {
    return (
      <button
        {...rest}
        ref={ref}
        className={button({ intent, size, rounded, class: className })}
      >
        {label}
        {icon || null}
      </button>
    )
  }
)

Button.displayName = "Button";