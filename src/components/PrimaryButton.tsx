import { FC, PropsWithChildren } from "react";

export const PrimaryButton: FC<PropsWithChildren<{
  onClick?: () => void
}>> = ({ children }) => {
  return (
    <div className="btn-primary">
      {children}
    </div>
  )
}
