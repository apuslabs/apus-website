import { FC } from "react"

export const MainButton: FC<{
  text: string
  onClick: () => void
}> = ({ text, onClick }) => {
  return <div className="btn-main btn-" onClick={onClick}>{text}</div>
}