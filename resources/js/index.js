function getGridContainerDimensions(gridContainerEl) {
  if (!gridContainerEl) {
    throw new Error("Grid container Element not found.");
  }
  const height = gridContainerEl.clientHeight;
  const width = gridContainerEl.clientWidth;
  return { width, height };
}

function calculateGridCellDimensions(gridContainerSize, noOfCellsPerRow) {
  if (noOfCellsPerRow < 16) {
    throw new Error("Number of cell per row must be greater than 16.");
  }
  const height = gridContainerSize.height / noOfCellsPerRow;
  const width = gridContainerSize.width / noOfCellsPerRow;
  return { width, height };
}
function createGridCells(cellDimension, totalCells) {
  const fragment = document.createDocumentFragment();

  const cells = Array.from({ length: totalCells }, (el) => {
    const newEl = document.createElement("div");
    newEl.classList.add("cell");

    newEl.style.width = `${cellDimension.width}px`;
    newEl.style.height = `${cellDimension.height}px`;
    // newEl.style.opacity = "0.1";
    return newEl;
  });
  //   for (let i = 0; i < totalCells; i++) {
  //     const newEl = document.createElement("div");
  //     newEl.style.width = cellDimension + "px";
  //     newEl.style.height = cellDimension + "px";
  //     fragment.append(newEl);
  //   }
  console.log(cells);
  fragment.append(...cells);
  return fragment;
}

function renderCells(container, cells) {
  if (!container || !cells) {
    throw new Error("Either container or cells doesn't exists");
  }
  container.replaceChildren();
  container.append(cells);
}

function updateGridSizeLabel(sizeLabelEl, value) {
  if (!sizeLabelEl) {
    throw new Error("Size Label element doesn't exist");
  }
  sizeLabelEl.value = `${value} X ${value}`;
}

function GridSizeChangeHandler(target, gridContainerEl) {
  if (!target.value) {
    throw new Error("invalid input Element");
  }
  if (!gridContainerEl) {
    throw new Error("Invalid container");
  }
  const gridCellsPerRow = target.value;
  const gridCellsPerCol = target.value;

  const gridContainerElDimension = getGridContainerDimensions(gridContainerEl);
  const gridCellDimension = calculateGridCellDimensions(
    gridContainerElDimension,
    gridCellsPerCol
  );
  const totalCells = gridCellsPerCol * gridCellsPerRow;
  const gridCellElements = createGridCells(gridCellDimension, totalCells);
  renderCells(gridContainerEl, gridCellElements);
}
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
function generateRandomRGBColor() {
  return `rgb(${getRandomInt(0, 256)},${getRandomInt(0, 256)},${getRandomInt(
    0,
    256
  )})`;
}
function init() {
  const gridSizeInputEl = document.querySelector("[data-grid-size-input]");
  const gridContainerEl = document.querySelector("[data-grid-container]");
  const gridSizeLabelEl = document.querySelector("[data-grid-size-label]");
  const colorPickerInputEl = document.querySelector("[data-color-picker]");
  const rainbowBtnEl = document.querySelector("[data-rainbow]");
  const brushBtnEl = document.querySelector("[data-brush]");
  const eraserBtnEl = document.querySelector("[data-eraser]");
  const resetBtnEl = document.querySelector("[data-reset]");

  let cellBackgroundColor = "#363636";
  let previousColor = "#363636";
  let drawState = false;
  let brushModeOm = false;
  let rainbowModeOn = false;
  let eraserModeOn = false;

  GridSizeChangeHandler(gridSizeInputEl, gridContainerEl);

  colorPickerInputEl.addEventListener("change", (e) => {
    cellBackgroundColor = e.target.value;
    previousColor = e.target.value;
    brushModeOm = false;
    brushBtnEl.classList.remove("active");
    eraserModeOn = false;
    eraserBtnEl.classList.remove("active");
    rainbowModeOn = false;
    rainbowBtnEl.classList.remove("active");
  });

  gridContainerEl.addEventListener("mousedown", (e) => (drawState = true));
  document.addEventListener("mouseup", (e) => (drawState = false));

  gridContainerEl.addEventListener("mouseover", (e) => {
    if (!e.target.closest(".cell")) {
      return;
    }

    if (rainbowModeOn) {
      cellBackgroundColor = generateRandomRGBColor();
    }
    if (drawState) {
      if (brushModeOm) {
        e.target.style.opacity =
          e.target.style.opacity === ""
            ? "0.1"
            : `${0.1 + +e.target.style.opacity}`;
      }
      if (eraserModeOn && +e.target.style.opacity < 1) {
        e.target.style.opacity = "1";
      }
      e.target.style.backgroundColor = cellBackgroundColor;
    }
    return;
  });

  gridSizeInputEl.addEventListener("input", (e) => {
    GridSizeChangeHandler(e.target, gridContainerEl);
    updateGridSizeLabel(gridSizeLabelEl, e.target.value);
  });

  rainbowBtnEl.addEventListener("click", (e) => {
    e.target.classList.toggle("active");
    if (brushModeOm) {
      brushModeOm = false;
      brushBtnEl.classList.remove("active");
    }
    eraserModeOn = false;
    eraserBtnEl.classList.remove("active");
    rainbowModeOn = !rainbowModeOn;
  });

  brushBtnEl.addEventListener("click", (e) => {
    if (eraserModeOn) {
      cellBackgroundColor = previousColor;
      eraserModeOn = false;
      eraserBtnEl.classList.remove("active");
    }
    if (rainbowModeOn) {
      rainbowModeOn = false;
      rainbowBtnEl.classList.remove("active");
      cellBackgroundColor = previousColor;
    }
    if (!brushModeOm) {
      brushBtnEl.classList.add("active");
      brushModeOm = !brushModeOm;
    } else {
      brushModeOm = !brushModeOm;

      brushBtnEl.classList.remove("active");
    }
  });

  eraserBtnEl.addEventListener("click", (e) => {
    e.target.classList.toggle("active");

    brushModeOm = false;
    brushBtnEl.classList.remove("active");
    eraserModeOn = !eraserModeOn;
    rainbowModeOn = false;
    rainbowBtnEl.classList.remove("active");
    if (eraserModeOn) {
      cellBackgroundColor = "#ddd";
    } else {
      cellBackgroundColor = previousColor;
    }
  });

  resetBtnEl.addEventListener("click", (e) => {
    brushModeOm = false;
    brushBtnEl.classList.remove("active");
    eraserModeOn = false;
    eraserBtnEl.classList.remove("active");
    rainbowModeOn = false;
    rainbowBtnEl.classList.remove("active");
    e.target.classList.add("active");
    GridSizeChangeHandler(gridSizeInputEl, gridContainerEl);
    cellBackgroundColor = previousColor;
    setTimeout(() => {
      e.target.classList.remove("active");
    }, 210);
  });
}
document.addEventListener("DOMContentLoaded", init);
