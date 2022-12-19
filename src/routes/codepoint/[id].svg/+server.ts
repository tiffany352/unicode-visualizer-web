import type { RequestHandler } from "@sveltejs/kit";
import { createCanvas } from "canvas";

export const GET: RequestHandler = async ({ params, url, fetch }) => {
	const { id } = params;
	let color = url.searchParams.get("color");
	let colorInt = parseInt(color || "ffffff", 16);
	color = "#" + colorInt.toString(16);

	const canvas = createCanvas(128, 128, "svg");
	const ctx = canvas.getContext("2d", {
		alpha: true,
	});

	ctx.fillStyle = color;
	ctx.font = "100px sans-serif";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.textDrawingMode = "path";

	const text = String.fromCodePoint(parseInt(id || "0", 16));
	const textSize = ctx.measureText(text);
	const scaleX = Math.min(1.0, 128 / textSize.width);
	ctx.font = `${scaleX * 100}px sans-serif`;
	ctx.fillText(text, 64, 64);

	const buffer = canvas.toBuffer();
	return new Response(buffer, {
		headers: {
			"Content-Type": "image/svg+xml",
		},
	});
};
