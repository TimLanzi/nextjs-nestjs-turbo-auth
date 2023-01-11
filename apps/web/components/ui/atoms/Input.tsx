import React, { forwardRef, InputHTMLAttributes } from 'react'
import { cva, VariantProps } from 'class-variance-authority';
// import { UseFormRegisterReturn } from 'react-hook-form';

export const inputStyles = cva('border border-slate-300 rounded h-9 p-2', {
  variants: {},
});

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputStyles> {
  // register?: () => UseFormRegisterReturn<any>;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({ type, className, ...rest }, ref) => {
  return (
    <input
      className={inputStyles({ class: className })}
      ref={ref}
      type={type}
      {...rest}
      // {...(!!register && register())}
    />
  )
})

Input.displayName = "Input";