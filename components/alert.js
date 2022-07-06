import { block, app } from "../builder/builder.js";


export function toast(message, delay, type)
{
	let alert = block("alert", "alert");

	alert.textContent = message;
	if (type === "danger")
		alert.className = "dangerAlert";
	else if (type === "info")
		alert.className = "infoAlert";
	else if (type === "warn")
		alert.className = "warnAlert";
	app.append(alert);
	setTimeout(()=>{
	app.removeChild(alert)
	}, delay)
}