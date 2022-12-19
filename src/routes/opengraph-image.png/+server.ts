import type { RequestHandler } from "@sveltejs/kit";
import { createCanvas, loadImage } from "canvas";

function getLines(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number
) {
	var words = text.split(" ");
	var lines = [];
	var currentLine = words[0];

	for (var i = 1; i < words.length; i++) {
		var word = words[i];
		var width = ctx.measureText(currentLine + " " + word).width;
		if (width < maxWidth) {
			currentLine += " " + word;
		} else {
			lines.push(currentLine);
			currentLine = word;
		}
	}
	lines.push(currentLine);
	return lines;
}

export const GET: RequestHandler = async ({ url, fetch }) => {
	const title = url.searchParams.get("title") || "Insert Title Here";
	const summary =
		url.searchParams.get("summary") ||
		"Insert summary here. The quick brown fox jumps over the lazy dog.";
	const previewText = url.searchParams.get("previewText") || "";

	const canvas = createCanvas(1200, 630);
	const ctx = canvas.getContext("2d", {
		alpha: false,
		pixelFormat: "RGB24",
	});

	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, 1200, 630);

	ctx.fillStyle = "#000";
	ctx.font = "56px Segoe UI SemiBold, Roboto SemiBold, sans-serif";
	ctx.fillText(title, 50, 100);

	ctx.font = "42px Segoe UI, Roboto, sans-serif";
	const lines = getLines(ctx, summary, 500);
	for (let i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], 50, 200 + i * 60);
	}

	const faviconReq = await fetch("/favicon.png");
	const faviconData = await faviconReq.arrayBuffer();

	const image = await loadImage(Buffer.from(faviconData));
	ctx.drawImage(image, 32, 630 - 32 - 128, 128, 128);

	ctx.font = "48px Segoe UI, Roboto, sans-serif";
	ctx.fillStyle = "#444";
	ctx.fillText("Unicode Visualizer", 32 + 128 + 32, 630 - 32 - 32);

	ctx.font = "300px sans-serif";
	ctx.textBaseline = "bottom";
	ctx.fillText(previewText, 1200 - 400 - 50, 630 - 50 - 32);

	const buffer = canvas.toBuffer("image/png");
	return new Response(buffer, {
		headers: {
			"Content-Type": "image/png",
		},
	});
};
