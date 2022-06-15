import * as builder from "../builder/builder.js"


export function postsFactory(rawData, parent)
{
	let array = JSON.parse(rawData);

	array.forEach(row => {
		parent.append(createPost(row));
		// console.log(row);
	});
}

function createPost(data)
{
	let	userImage = builder.image(null, "postUserImage", data.userPhoto),
		userName = builder.block(null, "postUserName"),
		topBlock = builder.block(null, "userData", [userImage, userName]),
		getTicket = builder.button(null, "postGetTicket", "احجز تذكرة"),
		desc = builder.block(null, "postDescription"),
		title = builder.block(null, "postTitle"),
		image1 = builder.image(null, "postImage", data.pic1),
		image2 = builder.image(null, "postImage", data.pic2),
		image3 = builder.image(null, "postImage", data.pic3),
		image4 = builder.image(null, "postImage", data.pic4),
		sliderBlock = builder.block(null, "postSlider", [image1, image2, image3, image4]),
		postContainer = builder.block(null, "postContainer", [topBlock, sliderBlock, title, desc, getTicket]);

		userName.textContent = data.userFullName;

		return postContainer;
}