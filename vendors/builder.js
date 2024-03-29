function create(element)
{
	return document.createElement(element)
}

export const app = getId("App");
export const api = "http://localhost:8080//Controllers/";

export function getId(id)
{
	return document.getElementById(id)
}

export function getSelector(selector)
{
	return document.querySelectorAll(selector);
}

export function	textBox(id ,hint, type, styleClass)
{
	let text = create("input");

	text.type = type;
	text.id = id;
	text.placeholder = hint;
	text.className = styleClass;

	return text;
}

export function image(id, styleClass, source)
{
	let img = create("img");

	if (id !== null)
		img.id = id;
	img.className = styleClass;
	img.src = source;

	return img;
}

export function block(id, styleClass, childs)
{
	let block = create("div");

	if (id !== null)
		block.id = id;
	block.className = styleClass;
	if (childs !== null && childs !== undefined)
	{
		childs.forEach(child => {
			block.append(child);
		});
	}
	return block;
}

export function button(id, styleClass, textValue, html)
{
	let button = create("button");

	if (id !== null)
		button.id = id;
	button.className = styleClass;
	if(textValue !== null)
		button.textContent = textValue;
	else if (html !== null)
		button.innerHTML = html;

	return button;
}

export function textArea(id, styleClass, hint)
{
	let ta = create("textarea");

	if (id)
		ta.id = id;
	ta.className = styleClass;
	ta.placeholder = hint;

	return ta;
}

export function brdige(endpoint, method, formdata, sucess, error)
{
	let xhr = new XMLHttpRequest();

	if (method === "GET")
	{
		let params = "";
		formdata.forEach((value, key)=>{
			params+=key+"="+value+"&"
		});
		params+="EOP=NULL"
		xhr.open(method, endpoint+"?"+params);
	}
	else
		xhr.open(method, endpoint)
	xhr.onload = function ()
	{
		if (xhr.status === 200 && xhr.readyState === 4)
			sucess(xhr.responseText);
		else
			error(xhr.status);
	}
	xhr.send(formdata);
}

export function label(styleClass, value)
{
	let lab = document.createElement("span");

	lab.textContent = value;
	lab.className = styleClass;

	return lab;
}

export function isArabic(str)
{
	var arabic = /[\u0600-\u06FF]/;

	if(arabic.test(str))
		return true;
	return false;
}
export function toBase64(file, dest)
{
	let reader = new FileReader();
	reader.onload = function(evt)
	{
		dest.src = evt.target.result;
		// console.log(evt.target.result);
	}
	reader.readAsDataURL(file);
}