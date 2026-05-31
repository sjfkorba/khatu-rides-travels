const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertHundreds(num: number): string {
  let result = "";

  if (num > 99) {
    result += ones[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }

  if (num > 19) {
    result += tens[Math.floor(num / 10)] + " ";
    num %= 10;
  }

  if (num > 0) {
    result += ones[num] + " ";
  }

  return result.trim();
}

export function amountToWords(amount: number): string {
  if (amount === 0) {
    return "Zero Rupees Only";
  }

  const crore = Math.floor(amount / 10000000);
  amount %= 10000000;

  const lakh = Math.floor(amount / 100000);
  amount %= 100000;

  const thousand = Math.floor(amount / 1000);
  amount %= 1000;

  const hundred = amount;

  let words = "";

  if (crore) words += convertHundreds(crore) + " Crore ";
  if (lakh) words += convertHundreds(lakh) + " Lakh ";
  if (thousand) words += convertHundreds(thousand) + " Thousand ";
  if (hundred) words += convertHundreds(hundred);

  return words.trim() + " Rupees Only";
}