onload = function main() {
	// maybe this should be renamed to `inputs`
	const ui = {
		drawButton:               getElementByIdOrDie("draw-button"),
		saveButton:               getElementByIdOrDie("save-button"),
		ringCountInput:           getElementByIdOrDie("ring-count-input"),
		ringDiameterInput:        getElementByIdOrDie("ring-diameter-input"),
		ringThicknessInput:       getElementByIdOrDie("ring-thickness-input"),
		colorSwapper:             getElementByIdOrDie("color-swapper"),
		backgroundColorPicker:    getElementByIdOrDie("canvas-background-color-picker"),
		ringColorPicker:          getElementByIdOrDie("ring-color-picker"),
		canvasWidthHeightSwapper: getElementByIdOrDie("canvas-width-height-swapper"),
		canvasWidthInput:         getElementByIdOrDie("canvas-width-input"),
		canvasHeightInput:        getElementByIdOrDie("canvas-height-input"),
		canvasSizePreviewToggle:  getElementByIdOrDie("preview-size-toggle"),
	};

	const ctx = getElementByIdOrDie("canvas").getContext("2d");
	if(ctx == null) {
		die("failed to create a drawing context");
	}
	syncCanvasContextStateToUIState(ctx, ui);

	ui.drawButton.addEventListener("click", function() {
		const ringCount     = Number(ui.ringCountInput.value);
		const ringDiameter  = Number(ui.ringDiameterInput.value);
		syncCanvasContextStateToUIState(ctx, ui);
		drawRingsToCanvas(ctx, ringCount, ringDiameter);
	});

	ui.saveButton.addEventListener("click", createCanvasContextImageDownloader(ctx, "rings.png"));

	ui.colorSwapper.addEventListener("click", function() {
		swapInputValues(ui.ringColorPicker, ui.backgroundColorPicker);
	});

	ui.canvasWidthHeightSwapper.addEventListener("click", function(event) {
		swapInputValues(ui.canvasWidthInput, ui.canvasHeightInput);
		syncCanvasContextStateToUIState(ctx, ui)
	});

	ui.canvasSizePreviewToggle.addEventListener("click", function() {
		const maxWidth = (ui.canvasSizePreviewToggle.checked) ? "100%" : "unset";
		ctx.canvas.style.maxWidth = ctx.canvas.style.maxHeight = maxWidth;
	});
	ui.canvasSizePreviewToggle.dispatchEvent(new Event("click"));

	for(const input of [ui.ringCountInput, ui.ringDiameterInput, ui.ringThicknessInput, ui.canvasWidthInput, ui.canvasHeightInput]) {
		input.addEventListener("input", createPositiveIntegerInputValidator(input));
	}

	ui.canvasWidthInput.addEventListener("input", function() {
		syncCanvasContextStateToUIState(ctx, ui);
	});
	ui.canvasHeightInput.addEventListener("input", function() {
		syncCanvasContextStateToUIState(ctx, ui);
	});
}

function drawRingsToCanvas(ctx, ringCount, ringDiameter) {
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.beginPath();
	for(let i = 0; i < ringCount; i++) {
		const x = Math.random() * (ctx.canvas.width  + ringDiameter * 2) - ringDiameter;
		const y = Math.random() * (ctx.canvas.height + ringDiameter * 2) - ringDiameter;
		ctx.moveTo(x + ringDiameter / 2, y);
		ctx.arc(x, y, ringDiameter / 2, 0, 2 * Math.PI);
	}
	ctx.stroke();
}

function syncCanvasContextStateToUIState(ctx, ui) {
	ctx.canvas.width  = Number(ui.canvasWidthInput.value);
	ctx.canvas.height = Number(ui.canvasHeightInput.value);

	ctx.lineWidth   = Number(ui.ringThicknessInput.value);
	ctx.strokeStyle = ui.ringColorPicker.value;
	ctx.fillStyle   = ui.backgroundColorPicker.value;

	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// this could also use a better name.
function createCanvasContextImageDownloader(ctx, defaultFileName) {
	// this might be over-engineered since this is only used in one place and
	// creating new `<a>` elements on each event is probably not too slow

	const a = document.createElement("a");
	a.download = defaultFileName;

	let imageFormat = undefined;
	if(defaultFileName.indexOf(".") != -1) {
		const imageExtension = defaultFileName.match(/[^.]+$/)[0];
		if(imageExtension != undefined) {
			imageFormat = `image/${imageExtension}`;
		}
	}

	return function() {
		a.href = ctx.canvas.toDataURL(imageFormat);
		a.click();
		a.href = "";
	};
}

// this could maybe use a clearer and shorter name
function createPositiveIntegerInputValidator(element) {
	element.dataset.previousValue = element.value;

	return function(event) {
		const previousValue = element.dataset.previousValue;
		const value = element.value.replaceAll(/[^0-9]/g, "");
		const min = Number(element.min);
		const max = Number(element.max);

		element.value = element.dataset.previousValue = (
			(value == "") ? (
				previousValue
			)
			: (value < min) ? (
				min
			)
			: (value > max) ? (
				max
			)
			: (
				value
			)
		);
	}
}

function swapInputValues(input1, input2) {
	const value1 = input1.value;
	const value2 = input2.value;
	input1.value = value2;
	input2.value = value1;
}

function getElementByIdOrDie(elementID) {
	const element = document.getElementById(elementID);
	if(element == null) {
		die(`no element with id "#${elementID}" in document`);
	}
	return element;
}

function die(message) {
	// TODO: do something fancier here
	window.alert(`error: ${message}`);
	throw new Error(message);
}
