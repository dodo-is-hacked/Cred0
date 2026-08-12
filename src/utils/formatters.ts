/**
  Formatting helper for Indian Numbering System (Lakhs and Crores)
  e.g., 100000 -> ₹1,00,000
        2000000 -> ₹20,00,000
        5000 -> ₹5,000
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const val = Math.round(amount);
  const str = val.toString();
  if (str.length <= 3) {
    return `₹${str}`;
  }
  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  const formattedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `₹${formattedOthers},${lastThree}`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculates approximate Monthly EMI for a loan amount, interest rate p.a., and tenure in months
 */
export function calculateEmi(principal: number, ratePerAnnum: number, months: number): number {
  if (!principal || !months || months <= 0) return 0;
  const monthlyRate = ratePerAnnum / 12 / 100;
  if (monthlyRate === 0) return Math.round(principal / months);
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}
