import * as builder from "../builder/builder.js";


export function floatingBlock(...childs)
{
	let backgroundBlock = builder.block("backBlock", "backBlock"),
		creationSpace = builder.block("creationSpace", "creationSpace", childs),
		container = builder.block("createBlock", "createBlock", [backgroundBlock, creationSpace]);

	backgroundBlock.onclick = (()=>{builder.app.removeChild(container)});
	return container;
}