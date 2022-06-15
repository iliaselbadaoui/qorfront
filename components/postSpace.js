import * as builder from "../builder/builder.js";
import { postsFactory } from "./post.js";

const	posts = builder.block("postsContainer","postsContainer"),
		filters = builder.block("postFilter","postFilter"),
		space = builder.block("postSpace", "postSpace", [filters, posts]);

export function addPostsSpace()
{
	builder.app.append(space);
	let form = new FormData();
	form.append("operation", "posts");
	builder.brdige(builder.api+"listingController.php", "GET", form,
	function (data)
	{
		postsFactory(data, posts);
	},
	function (err)
	{

	})
}