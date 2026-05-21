const ARCHIVE_KEY = "completedTasks";

export function loadArchive() {
  return JSON.parse(localStorage.getItem(ARCHIVE_KEY)) || [];
}

export function saveArchive(archiveList) {
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archiveList));
}

export function addTaskToArchive(task) {
  const archiveList = loadArchive();

  const alreadyInArchive = archiveList.some((item) => item.id === task.id);

  if (alreadyInArchive) {
    return;
  }

  const archivedTask = {
    ...task,
    completedAt: new Date().toISOString(),
  };

  archiveList.push(archivedTask);
  saveArchive(archiveList);
}