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

	let ringCount     = Number(ui.ringCountInput.value);
	let ringDiameter  = Number(ui.ringDiameterInput.value);
	let ringThickness = Number(ui.ringThicknessInput.value);

	const ctx = getElementByIdOrDie("canvas").getContext("2d");
	if(ctx == null) {
		die("failed to create a drawing context");
	}
	syncCanvasContextStateToUIState(ctx, ui);

	ui.drawButton.addEventListener("click", function() {
		drawRingsToCanvas(ctx, ringCount, ringDiameter, ringThickness);
	});

	ui.canvasSizePreviewToggle.addEventListener("change", function() {
		ctx.canvas.style.maxWidth = ctx.canvas.style.maxHeight = (
			(ui.canvasSizePreviewToggle.checked) ? "100%" : "unset"
		);
	});
	ui.canvasSizePreviewToggle.dispatchEvent(new Event("change"));

	ui.colorSwapper.addEventListener("click", function() {
		const foregroundColor = ui.ringColorPicker.value;
		const backgroundColor = ui.backgroundColorPicker.value;

		ui.ringColorPicker.value       = backgroundColor;
		ui.ringColorPicker.dispatchEvent(new Event("input"));

		ui.backgroundColorPicker.value = foregroundColor;
		ui.backgroundColorPicker.dispatchEvent(new Event("input"));
	});

	ui.ringCountInput.addEventListener("input", function(event) {
		if(event.currentTarget.value.length == 0) {
			event.currentTarget.value = String(ringCount);
		}
		else {
			ringCount = Number(event.currentTarget.value);
		}
	});

	ui.ringDiameterInput.addEventListener("input", function(event) {
		if(event.currentTarget.value.length == 0) {
			event.currentTarget.value = String(ringDiameter);
		}
		else {
			ringDiameter = Number(event.currentTarget.value);
		}
	});

	ui.ringThicknessInput.addEventListener("input", function(event) {
		if(event.currentTarget.value.length == 0) {
			event.currentTarget.value = String(ringThickness);
		}
		else {
			ringThickness = Number(event.currentTarget.value);
			ctx.lineWidth = ringThickness;
		}
	});

	ui.canvasWidthHeightSwapper.addEventListener("click", function(event) {
		const width = ui.canvasWidthInput.value;

		ui.canvasWidthInput.value = ui.canvasHeightInput.value;
		ui.canvasWidthInput.dispatchEvent(new Event("input"));

		ui.canvasHeightInput.value = width;
		ui.canvasHeightInput.dispatchEvent(new Event("input"));
	});

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
