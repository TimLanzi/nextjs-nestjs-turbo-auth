import React, { PropsWithChildren } from 'react'

export const FormField: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <div className='mb-5 flex flex-col'>
      {children}
    </div>
  )
}
