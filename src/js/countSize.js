const countSize = (container, y) => {
  // y это координата курсора
  const allTasks = container.querySelectorAll(".task"); // добираемся до всех задач
  let closestElement = null; // ближайший элемент в данный момент null пока не найден
  let closestCoordinates = Number.NEGATIVE_INFINITY; // число, которое будет меньше любого другого числа

  for (let task of allTasks) {
    let coords = task.getBoundingClientRect(); // получаем координаты нашего элемента
    // console.log(coords)
    const centralCoords = coords.top + coords.height / 2;
    const differenceBetweenCoordidinates = y - centralCoords;
    if (
      differenceBetweenCoordidinates < 0 &&
      differenceBetweenCoordidinates > closestCoordinates
    ) {
      closestCoordinates = differenceBetweenCoordidinates;
      closestElement = task;
      // placeholder.style.height = coords.height + "px"; // когда мы к любому числу добавляенм строковое значение, число становится строковым
    }
    // rezult.push(coords.height)
  }
  return closestElement;
};

export { countSize };
