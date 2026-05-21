import quotes from './motivational_quotes_2025.json';

export function getTodayQuote() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const found = quotes.find(q => q.date === todayStr);

  return found || {
    quote: "Начни делать всё, что можешь, прямо сейчас.",
    author: "Теодор Рузвельт"
  };
}
