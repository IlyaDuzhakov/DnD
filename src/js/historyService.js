import { loadArchive } from "./archiveService";

const HISTORY_KEY = "historyByDate";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function loadHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)) || {};
}

export function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function moveTodayCompletedToHistory() {
  const completedTasks = loadArchive();

  if (completedTasks.length === 0) {
    return;
  }

  const todayKey = getTodayKey();
  const history = loadHistory();

  const oldTasks = history[todayKey] || [];

  history[todayKey] = [...oldTasks, ...completedTasks];

  saveHistory(history);

  localStorage.removeItem("completedTasks");
}