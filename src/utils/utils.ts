import dayjs from "dayjs";

export function formatNumberWithSuffix(value: number): string {
  if (Number.isNaN(Number(value))) {
    return value as any;
  }
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value) + suffixes[suffixIndex];
}

export const formatNumber = new Intl.NumberFormat('en-US').format

export function timeFormat(value: number): string {
  const date = new Date(value);
  return dayjs(value).format('YYYY-MM-DD HH:mm');
}