import { block, app } from "../builder/builder.js";


export function toast(message, delay, type)
{
	let alert = block("alert", "alert");

	alert.textContent = message;
	if (type === "danger")
		alert.className = "danger";
	else if (type === "info")
		alert.className = "info";
	else if (type === "warn")
		alert.className = "warn";
	app.append(alert);
	setTimeout(()=>{
	app.removeChild(alert)
	}, delay)
}