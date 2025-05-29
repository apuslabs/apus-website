import { Skeleton } from "antd";
import Decimal from "decimal.js";

export function NumberBox({
  fontSize = 14,
  lineHeight = 20,
  value,
  loading,
  className,
  precision = 12,
  fixed = 2,
  placeholder = "",
  suffix = "",
  skeleton = { width: 20 }
}: {
  value: number | string | undefined;
  fontSize?: number;
  lineHeight?: number;
  loading?: boolean;
  className?: string;
  precision?: number;
  fixed?: number;
  placeholder?: string;
  suffix?: string;
  skeleton?: {
    width?: number | string;
  };
}) {
  return loading ? (
    <Skeleton.Input active={true} style={{ display: "inline-flex", height: lineHeight, width: skeleton.width, minWidth: skeleton.width }} />
  ) : (
    <span className={className} style={{ fontSize, height: lineHeight, lineHeight:`${lineHeight}px` }}>
      {formatNumber(value, {
        precision, fixed, placeholder, suffix
      })}
    </span>
  );
}

export function formatNumber(value: number | string | undefined, {
  precision = 12,
  fixed = 2,
  placeholder = "",
  suffix = ""
}: {
  precision?: number; fixed?: number; placeholder?: string; suffix?: string
}): string {
  let numDecimal = new Decimal(value || 0);
  if (precision < 0) {
    numDecimal = numDecimal.mul(Math.pow(10, -precision));
  } else {
    numDecimal = numDecimal.div(Math.pow(10, precision));
  }
  let num: string | number = numDecimal.toNumber()
  if(fixed === -1) {
    num = numDecimal.toString();
  } else {
    num = numDecimal.toFixed(fixed);
  }
  return value === undefined ? placeholder : (precision === fixed ? num : Intl.NumberFormat("en-US", {}).format(Number(num))) + suffix;
}