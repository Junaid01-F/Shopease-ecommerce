export const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const formatDate = (iso, month = "short") =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month,
    year: "numeric"
  });

export const estimatedDelivery = (iso, days = 5) => {
  const date = new Date(iso);
  date.setDate(date.getDate() + days);

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
};