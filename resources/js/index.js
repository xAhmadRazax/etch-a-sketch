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
  const switchOffEraserMode = (
    eraserBtnEl,
    eraserModeOn,
    changeBgColor = false
  ) => {
    if (eraserModeOn) {
      if (changeBgColor) {
        // since eraser mode is onl changing the bg colors of cell
        // so we need a ref to a color which user was using for drawing before he
        // active eraser mode
        inkColor = previousInkColor;
      }
      eraserModeOn = false;
      eraserBtnEl.classList.remove("active");
    }
  };
  const switchOffBrushMode = () => {
    if (brushModeOm) {
      brushModeOm = false;
      brushBtnEl.classList.remove("active");
    }
  };
  const switchOffRainbowMode = (changeBgColor = false) => {
    if (rainbowModeOn) {
      rainbowModeOn = false;
      rainbowBtnEl.classList.remove("active");
      if (changeBgColor) {
        inkColor = previousInkColor;
      }
    }
  };
  const gridSizeInputEl = document.querySelector("[data-grid-size-input]");
  const gridContainerEl = document.querySelector("[data-grid-container]");
  const gridSizeLabelEl = document.querySelector("[data-grid-size-label]");
  const colorPickerInputEl = document.querySelector("[data-color-picker]");
  const rainbowBtnEl = document.querySelector("[data-rainbow]");
  const brushBtnEl = document.querySelector("[data-brush]");
  const eraserBtnEl = document.querySelector("[data-eraser]");
  const resetBtnEl = document.querySelector("[data-reset]");

  let inkColor = "#363636";
  let previousInkColor = "#363636";
  let drawState = false;
  let brushModeOm = false;
  let rainbowModeOn = false;
  let eraserModeOn = false;

  //on initial page load add 16 x 16 grid cells
  GridSizeChangeHandler(gridSizeInputEl, gridContainerEl);

  colorPickerInputEl.addEventListener("change", (e) => {
    inkColor = e.target.value;
    previousInkColor = e.target.value;

    switchOffBrushMode();
    switchOffEraserMode();
    switchOffRainbowMode();
  });

  gridContainerEl.addEventListener("mousedown", (e) => (drawState = true));
  document.addEventListener("mouseup", (e) => (drawState = false));

  gridContainerEl.addEventListener("mouseover", (e) => {
    // if elements are not cell do nothing
    if (!e.target.closest(".cell")) {
      return;
    }

    // if element are cells and have rainbow mode on
    // generate random color
    if (rainbowModeOn) {
      inkColor = generateRandomRGBColor();
    }
    // if we are drawing and brush mode is on than increase the opacity
    if (drawState) {
      if (brushModeOm) {
        e.target.style.opacity =
          e.target.style.opacity === ""
            ? "0.1"
            : `${0.1 + +e.target.style.opacity}`;
      }
      // resetting element opacity when we are on pen/default mode or erasing mode
      if (
        (eraserModeOn && +e.target.style.opacity < 1) ||
        (!brushModeOm && +e.target.style.opacity < 1)
      ) {
        e.target.style.opacity = "1";
      }
      // changing cell colors to make drawing effect
      e.target.style.backgroundColor = inkColor;
    }
    return;
  });

  gridSizeInputEl.addEventListener("input", (e) => {
    GridSizeChangeHandler(e.target, gridContainerEl);
    updateGridSizeLabel(gridSizeLabelEl, e.target.value);
  });

  rainbowBtnEl.addEventListener("click", (e) => {
    switchOffBrushMode();
    switchOffEraserMode();

    e.target.classList.toggle("active");
    rainbowModeOn = !rainbowModeOn;
  });

  brushBtnEl.addEventListener("click", (e) => {
    switchOffEraserMode(eraserBtnEl, eraserModeOn, true);
    switchOffRainbowMode(true);

    brushBtnEl.classList.toggle("active");
    brushModeOm = !brushModeOm;
  });

  eraserBtnEl.addEventListener("click", (e) => {
    switchOffBrushMode();
    switchOffRainbowMode();
    e.target.classList.toggle("active");
    eraserModeOn = !eraserModeOn;

    if (eraserModeOn) {
      inkColor = "#ddd";
    } else {
      inkColor = previousInkColor;
    }
  });

  resetBtnEl.addEventListener("click", (e) => {
    switchOffEraserMode();
    switchOffEraserMode();
    switchOffRainbowMode();

    e.target.classList.add("active");
    // resetting grid by removing all child and then add new child
    GridSizeChangeHandler(gridSizeInputEl, gridContainerEl);
    // setting pen color to
    inkColor = previousInkColor;
    setTimeout(() => {
      e.target.classList.remove("active");
    }, 210);
  });
}
document.addEventListener("DOMContentLoaded", init);
