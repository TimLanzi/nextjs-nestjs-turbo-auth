import React, { PropsWithChildren } from "react";

export const FormLabel: React.FC<PropsWithChildren> = ({ children }) => {
  return <label className="font-light">{children}</label>;
};
