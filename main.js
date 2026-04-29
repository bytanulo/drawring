function drawRingsToCanvas(ctx, ringCount, ringDiameter, ringThickness) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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

function die(message) {
	// TODO: do something fancier here
	window.alert(`error: ${message}`);
	throw new Error(message);
}

function getElementByIdOrDie(elementID, errorMessage) {
	const element = document.getElementById(elementID);
	if(element == null) {
		die(errorMessage);
	}
	return element;
}

onload = function main() {
	const drawButton               = getElementByIdOrDie("draw-button",                    "no draw button in document");
	const ringCountInput           = getElementByIdOrDie("ring-count-input",               "no ring count input in document");
	const ringDiameterInput        = getElementByIdOrDie("ring-diameter-input",            "no ring diameter input in document");
	const ringThicknessInput       = getElementByIdOrDie("ring-thickness-input",           "no ring size input in document");
	const colorSwapper             = getElementByIdOrDie("color-swapper",                  "no color swap button in document");
	const backgroundColorPicker    = getElementByIdOrDie("canvas-background-color-picker", "no background color picker in document");
	const ringColorPicker          = getElementByIdOrDie("ring-color-picker",              "no ring color picker in document");
	const canvasWidthHeightSwapper = getElementByIdOrDie("canvas-width-height-swapper",    "no canvas width and height swapper in document");
	const canvasWidthInput         = getElementByIdOrDie("canvas-width-input",             "no canvas width input in document");
	const canvasHeightInput        = getElementByIdOrDie("canvas-height-input",            "no canvas height input in document");
	const canvasSizePreviewToggle  = getElementByIdOrDie("preview-size-toggle",            "no preview size toggle in document");

	let ringCount     = Number(ringCountInput.value);
	let ringDiameter  = Number(ringDiameterInput.value);
	let ringThickness = Number(ringThicknessInput.value);

	const canvas = getElementByIdOrDie("canvas", "no canvas in document");
	canvas.width  = Number(canvasWidthInput.value);
	canvas.height = Number(canvasHeightInput.value);
	canvas.style.backgroundColor = backgroundColorPicker.value;
	canvas.style.borderWidth = `${ringThickness}px`;

	const ctx = canvas.getContext("2d");
	if(ctx == null) {
		die("failed to create a drawing context");
	}
	ctx.strokeStyle = ringColorPicker.value;
	ctx.lineWidth = ringThickness;

	drawButton.addEventListener("click", function() {
		drawRingsToCanvas(ctx, ringCount, ringDiameter, ringThickness);
	});

	canvasSizePreviewToggle.addEventListener("change", function() {
		canvas.style.maxWidth = canvas.style.maxHeight = (
			(canvasSizePreviewToggle.checked) ? "100%" : "unset"
		);
	});
	canvasSizePreviewToggle.dispatchEvent(new Event("change"));

	colorSwapper.addEventListener("click", function() {
		const foregroundColor = ringColorPicker.value;
		const backgroundColor = backgroundColorPicker.value;

		ctx.strokeStyle              = backgroundColor;
		ringColorPicker.value        = backgroundColor;

		ctx.canvas.style.backgroundColor = foregroundColor;
		backgroundColorPicker.value      = foregroundColor;
	});

	ringCountInput.addEventListener("input", function(event) {
		if(event.target.value.length == 0) {
			event.target.value = String(ringCount);
		}
		else {
			ringCount = Number(event.target.value);
		}
	});

	ringDiameterInput.addEventListener("input", function(event) {
		if(event.target.value.length == 0) {
			event.target.value = String(ringDiameter);
		}
		else {
			ringDiameter = Number(event.target.value);
		}
	});

	ringThicknessInput.addEventListener("input", function(event) {
		if(event.target.value.length == 0) {
			event.target.value = String(ringThickness);
		}
		else {
			ringThickness = Number(event.target.value);
			ctx.lineWidth = ringThickness;
		}
	});

	canvasWidthHeightSwapper.addEventListener("click", function(event) {
		const width = canvasWidthInput.value;
		canvasWidthInput.value = canvasHeightInput.value;
		canvasHeightInput.value = width;

		canvasWidthInput.dispatchEvent(new Event("input"));
		canvasHeightInput.dispatchEvent(new Event("input"));
	});

	canvasWidthInput.addEventListener("input", function(event) {
		canvas.width = Number(event.target.value);
	});
	canvasHeightInput.addEventListener("input", function(event) {
		canvas.height = Number(event.target.value);
	});
	backgroundColorPicker.addEventListener("input", function(event) {
		canvas.style.backgroundColor = event.target.value;
	});
	ringColorPicker.addEventListener("input", function(event) {
		ctx.strokeStyle = ctx.canvas.style.borderColor = event.target.color;
	});
}
