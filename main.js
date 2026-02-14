const DEFAULT_CANVAS_BACKGROUND_COLOR = "#ffffff";

const DEFAULT_RING_COLOR = "#000000";
const DEFAULT_RING_THICKNESS = 2;
const DEFAULT_RING_SIZE = 100;
const DEFAULT_RING_COUNT = 1000;

function drawRingsToCanvas(ctx, ringCount, ringSize) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.beginPath();
	for(let i = 0; i < ringCount; i++) {
		const x = Math.random() * (ctx.canvas.width  + ringSize * 2) - ringSize;
		const y = Math.random() * (ctx.canvas.height + ringSize * 2) - ringSize;
		ctx.moveTo(x + ringSize / 2, y);
		ctx.arc(x, y, ringSize / 2, 0, 2 * Math.PI);
	}
	ctx.stroke();
}

function die(message) {
	// TODO: do something fancier here
	window.alert(`error: ${message}`);
	throw new Error(errorMessage);
}

function getElementByIdOrDie(elementID, errorMessage) {
	const element = document.getElementById(elementID);
	if(element == null) {
		die(errorMessage);
	}
	return element;
}

onload = function main() {
	let ringCount = DEFAULT_RING_COUNT;
	let ringSize  = DEFAULT_RING_SIZE; // TODO: rename to `ringDiameter`
	let ringThickness = DEFAULT_RING_THICKNESS;

	const canvas = getElementByIdOrDie("canvas", "no canvas in document");
	canvas.style.backgroundColor = DEFAULT_CANVAS_BACKGROUND_COLOR;
	canvas.style.borderWidth = `${ringThickness}px`;

	const ctx = canvas.getContext("2d");
	if(ctx == null) {
		die("failed to create a drawing context");
	}
	ctx.strokeStyle = ctx.canvas.style.borderColor = DEFAULT_RING_COLOR;
	ctx.lineWidth = ringThickness;

	const backgroundColorPicker = getElementByIdOrDie("canvas-background-color-picker", "no background color picker in document");
	backgroundColorPicker.addEventListener("input", function(event) {
		canvas.style.backgroundColor = event.target.value;
	});
	backgroundColorPicker.value = DEFAULT_CANVAS_BACKGROUND_COLOR;

	const ringColorPicker = getElementByIdOrDie("ring-color-picker", "no ring color picker in document");
	ringColorPicker.addEventListener("input", function(event) {
		ctx.strokeStyle = ctx.canvas.style.borderColor = color;
	});

	const colorSwapper = getElementByIdOrDie("color-swapper", "no color swap button in document");
	colorSwapper.addEventListener("click", function() {
		const foregroundColor = ringColorPicker.value;
		const backgroundColor = backgroundColorPicker.value;

		ctx.strokeStyle              = backgroundColor;
		ctx.canvas.style.borderColor = backgroundColor;
		ringColorPicker.value        = backgroundColor;

		ctx.canvas.style.backgroundColor = foregroundColor;
		backgroundColorPicker.value      = foregroundColor;
	});

	const ringCountInput = getElementByIdOrDie("ring-count-input", "no ring count input in document");
	ringCountInput.addEventListener("input", function(event) {
		if(event.target.value.length == 0) {
			event.target.value = ringCount.toString();
		}
		else {
			ringCount = Number(event.target.value);
		}
	});
	ringCountInput.value = ringCount;

	const ringSizeInput = getElementByIdOrDie("ring-size-input", "no ring size input in document");
	ringSizeInput.addEventListener("input", function(event) {
		if(event.target.value.length == 0) {
			event.target.value = ringSize.toString();
		}
		else {
			ringSize = Number(event.target.value);
		}
	});
	ringSizeInput.value = ringSize;

	const ringThicknessInput = getElementByIdOrDie("ring-thickness-input", "no ring size input in document");
	ringThicknessInput.addEventListener("input", function(event) {
		if(event.target.value.length == 0) {
			event.target.value = ringThickness.toString();
		}
		else {
			ringThickness = Number(event.target.value);
			canvas.style.borderWidth = `${ringThickness}px`;
			ctx.lineWidth = ringThickness;
		}
	});
	ringThicknessInput.value = ringThickness;

	const drawButton = getElementByIdOrDie("draw-button", "no draw button in document");
	drawButton.addEventListener("click", function() {
		drawRingsToCanvas(ctx, ringCount, ringSize);
	});
}
