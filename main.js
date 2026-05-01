function die(message) {
	// TODO: do something fancier here
	window.alert(`error: ${message}`);
	throw new Error(message);
}

function getElementByIdOrDie(elementID) {
	const element = document.getElementById(elementID);
	if(element == null) {
		die(`no element with id "#${elementID}" in document`);
	}
	return element;
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

function syncCanvasContextStateToUIState(ctx, ui) {
	ctx.canvas.width  = Number(ui.canvasWidthInput.value);
	ctx.canvas.height = Number(ui.canvasHeightInput.value);

	ctx.lineWidth   = Number(ui.ringThicknessInput.value);
	ctx.strokeStyle = ui.ringColorPicker.value;
	ctx.fillStyle   = ui.backgroundColorPicker.value;

	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawRingsToCanvas(ctx, ringCount, ringDiameter, ringThickness) {
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.lineWidth = ringThickness;
	ctx.beginPath();
	for(let i = 0; i < ringCount; i++) {
		const x = Math.random() * (ctx.canvas.width  + ringDiameter * 2) - ringDiameter;
		const y = Math.random() * (ctx.canvas.height + ringDiameter * 2) - ringDiameter;
		ctx.moveTo(x + ringDiameter / 2, y);
		ctx.arc(x, y, ringDiameter / 2, 0, 2 * Math.PI);
	}
	ctx.stroke();
}

onload = function main() {
	// maybe this should be renamed to `inputs`
	const ui = {
		drawButton:               getElementByIdOrDie("draw-button"),
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

	for(const input of [ui.ringCountInput, ui.ringDiameterInput, ui.ringThicknessInput, ui.canvasWidthInput, ui.canvasHeightInput]) {
		input.addEventListener("input", createPositiveIntegerInputValidator(input));
	}

	ui.drawButton.addEventListener("click", function() {
		const ringCount     = Number(ui.ringCountInput.value);
		const ringDiameter  = Number(ui.ringDiameterInput.value);
		const ringThickness = Number(ui.ringThicknessInput.value);
		drawRingsToCanvas(ctx, ringCount, ringDiameter, ringThickness);
	});

	ui.colorSwapper.addEventListener("click", function() {
		const foregroundColor = ui.ringColorPicker.value;
		const backgroundColor = ui.backgroundColorPicker.value;

		ui.ringColorPicker.value       = backgroundColor;
		ui.ringColorPicker.dispatchEvent(new Event("input"));

		ui.backgroundColorPicker.value = foregroundColor;
		ui.backgroundColorPicker.dispatchEvent(new Event("input"));
	});

	ui.canvasWidthHeightSwapper.addEventListener("click", function(event) {
		const width = ui.canvasWidthInput.value;

		ui.canvasWidthInput.value = ui.canvasHeightInput.value;
		ui.canvasWidthInput.dispatchEvent(new Event("input"));

		ui.canvasHeightInput.value = width;
		ui.canvasHeightInput.dispatchEvent(new Event("input"));
	});

	ui.canvasSizePreviewToggle.addEventListener("input", function() {
		ctx.canvas.style.maxWidth = ctx.canvas.style.maxHeight = (
			(ui.canvasSizePreviewToggle.checked) ? "100%" : "unset"
		);
	});
	ui.canvasSizePreviewToggle.dispatchEvent(new Event("input"));

	ui.canvasWidthInput.addEventListener("input", function(event) {
		syncCanvasContextStateToUIState(ctx, ui);
	});
	ui.canvasHeightInput.addEventListener("input", function(event) {
		syncCanvasContextStateToUIState(ctx, ui);
	});
	ui.backgroundColorPicker.addEventListener("input", function(event) {
		ctx.fillStyle = event.currentTarget.value;
	});
	ui.ringColorPicker.addEventListener("input", function(event) {
		ctx.strokeStyle = event.currentTarget.value;
	});
}
