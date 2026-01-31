export const fixIfDecimal = (value: Number) => {
  const num = Number(value);
  return Number.isInteger(num) ? num : Number(num.toFixed(2));
};

