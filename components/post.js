import * as builder from "../builder/builder.js"
import { toast } from "./alert.js"

export function postsFactory(rawData, parent)
{
	let array = JSON.parse(rawData);

	// console.log(rawData);
	array.forEach(row => {
		parent.append(createPost(row));
		// console.log(row);
	});
}

function createPost(data)
{
	if (data.userPhoto === 'data:;base64,')
		data.userPhoto = "profileImage.png";
	let	userImage = builder.image(null, "postUserImage", data.userPhoto),
		userName = builder.block(null, "postUserName"),
		topBlock = builder.block(null, "userData", [userImage, userName]),
		getTicket = builder.button(null, "postGetTicket", null,'<i class="fad fa-ticket"></i>&nbsp;احجز تذكرة'),
		dateBlock = builder.block(null, "dateBlock"),
		bottomBlock = builder.block(null, "postBottomBlock", [getTicket, dateBlock]),
		desc = builder.block(null, "postDescription"),
		title = builder.block(null, "postTitle"),
		image1 = builder.block(null, "postImageContainer currentPostImage", [builder.image(null, "postImage", data.pic1)]),
		image2 = builder.block(null, "postImageContainer", [builder.image(null, "postImage", data.pic2)]),
		image3 = builder.block(null, "postImageContainer", [builder.image(null, "postImage", data.pic3)]),
		image4 = builder.block(null, "postImageContainer", [builder.image(null, "postImage", data.pic4)]),
		nextLeft = builder.button(null, "navigationLeft", null, '<i class="far fa-angle-left"></i>'),
		nextRight = builder.button(null, "navigationRight", null, '<i class="far fa-angle-right"></i>'),
		sliderBlock = builder.block(null, "postSlider", [image1, image2, image3, image4, nextLeft, nextRight]),
		postContainer = builder.block(null, "postContainer", [topBlock, sliderBlock, title, desc, bottomBlock]);

		if (builder.isArabic(data.userFullName))
			userName.style.direction = "rtl";
		if (!builder.isArabic(data.title))
			title.style.direction = "ltr";
		if (!builder.isArabic(data.desc))
			desc.style.direction = "ltr";
		userName.textContent = data.userFullName;
		title.textContent = data.title;
		desc.textContent = data.desc;

		var countDownDate = new Date(data.expires).getTime();

		setInterval(function() {
			var now = new Date().getTime();
			var timeleft = countDownDate - now;
				
			var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
			var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			
			dateBlock.textContent = " ينتهي بعد : "+days+" يوم "+hours+" ساعة ";
			dateBlock.title = data.expires;
		}, 1000)

		let layers = [image1,image2,image3,image4];
		nextLeft.onclick = (()=>{
			for (let i = 0; i < layers.length; i++) {
				if (layers[i].className.includes("currentPostImage"))
				{
					layers[i].classList.remove("currentPostImage");
					layers[i+1].className += " currentPostImage";
					layers.push(layers.shift())
				}
			}
		})
		nextRight.onclick = (()=>{
			for (let i = 0; i < layers.length; i++) {
				if (layers[i].className.includes("currentPostImage"))
				{
					layers[i].classList.remove("currentPostImage");
					layers[layers.length - 1].className += " currentPostImage";
					layers.unshift(layers.pop())
				}
			}
		})

		getTicket.onclick = (()=>{
			buyTicket(JSON.parse(localStorage.user), data.listingID);
		})

		return postContainer;
}

function buyTicket(user, listing)
{
	let form = new FormData();
	form.append("operation", "create_ticket");
	form.append("user", user.id);
	form.append("listing", listing);
	builder.brdige(builder.api+"/listingController.php", "POST", form,
	((res)=>{
		if (res === "Solde")
		{
			toast("رصيدك غير كافي", 3000, "warn");
			return 0;
		}
		else if (res === "Wrong")
		{
			toast("حدث خطأ", 3000, "danger");
			return 0;
		}
		localStorage.user = res;
		toast("تم حجز التذكرة بنجاح", 3000, "info");
	}),
	((err)=>{

	}))
}