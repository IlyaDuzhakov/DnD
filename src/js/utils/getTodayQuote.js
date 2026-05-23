import quotes from './motivational_quotes_2025.json';

export function getTodayQuote() {
  const today = new Date();

  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const todayKey = `${month}-${day}`;

  const found = quotes.find((q) => {
    const quoteKey = q.date.slice(5); // "05-22"
    return quoteKey === todayKey;
  });

  return found || {
    quote: "Начни делать всё, что можешь, прямо сейчас.",
    author: "Теодор Рузвельт"
  };
}