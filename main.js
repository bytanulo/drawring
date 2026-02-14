const DEFAULT_CANVAS_BACKGROUND_COLOR = "#ffffff";

const DEFAULT_RING_COLOR = "#000000";
const DEFAULT_RING_THICKNESS = 2;
const DEFAULT_RING_SIZE = 100;
const DEFAULT_RING_COUNT = 1000;

function showErrorMessage(message) {
	// TODO: do something fancier here
	window.alert(`error: ${message}`);
}

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

onload = function main() {
	let ringCount = DEFAULT_RING_COUNT;
	let ringSize  = DEFAULT_RING_SIZE; // TODO: rename to `ringDiameter`
	let ringThickness = DEFAULT_RING_THICKNESS;

	const canvas = document.getElementById("canvas");
	if(canvas == null) {
		showErrorMessage("no canvas in document");
		return;
	}
	Object.assign(canvas.style, {
		backgroundColor: DEFAULT_CANVAS_BACKGROUND_COLOR,
		border: `${ringThickness}px solid black`,
	})

	const ctx = canvas.getContext("2d");
	if(ctx == null) {
		showErrorMessage("failed to create a drawing context");
		return;
	}
	ctx.strokeStyle = DEFAULT_RING_COLOR;
	ctx.lineWidth = ringThickness;

	const backgroundColorPicker = document.getElementById("canvas-background-color-picker");
	if(backgroundColorPicker == null) {
		showErrorMessage("no background color picker in document");
		return;
	}
	backgroundColorPicker.addEventListener("input", function(event) {
		canvas.style.backgroundColor = event.target.value;
	});
	backgroundColorPicker.value = DEFAULT_CANVAS_BACKGROUND_COLOR;

	const ringColorPicker = document.getElementById("ring-color-picker");
	if(ringColorPicker == null) {
		showErrorMessage("no ring color picker in document");
		return;
	}
	ringColorPicker.addEventListener("input", function(event) {
		ctx.strokeStyle = event.target.value;
		ctx.canvas.style.borderColor = event.target.value;
	});

	const ringCountInput = document.getElementById("ring-count-input");
	if(ringCountInput == null) {
		showErrorMessage("no ring count input in document");
		return;
	}
	ringCountInput.addEventListener("input", function(event) {
		if(event.target.value.length == 0) {
			event.target.value = ringCount.toString();
		}
		else {
			ringCount = Number(event.target.value);
		}
	});
	ringCountInput.value = ringCount;

	const ringSizeInput = document.getElementById("ring-size-input");
	if(ringSizeInput == null) {
		showErrorMessage("no ring size input in document");
		return;
	}
	ringSizeInput.addEventListener("input", function(event) {
		if(event.target.value.length == 0) {
			event.target.value = ringSize.toString();
		}
		else {
			ringSize = Number(event.target.value);
		}
	});
	ringSizeInput.value = ringSize;

	const ringThicknessInput = document.getElementById("ring-thickness-input");
	if(ringThicknessInput == null) {
		showErrorMessage("no ring size input in document");
		return;
	}
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

	const drawButton = document.getElementById("draw-button");
	if(drawButton == null) {
		showErrorMessage("no draw button in document");
		return;
	}
	drawButton.addEventListener("click", function() {
		drawRingsToCanvas(ctx, ringCount, ringSize);
	});
}
