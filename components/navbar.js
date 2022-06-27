import * as builder from "../builder/builder.js"
import { toast } from "./alert.js";
import { floatingBlock} from './floatingBlock.js'
import { createProfile } from "./profile.js";
import { gateway } from "./YCP.js";

function createItem(id, icon, content)
{
	let item = builder.block(id, "listItem");

	item.innerHTML = "<div style='padding-left:8px;'>"+icon+"<div/>";
	item.innerHTML += content;

	return item;
}

let logo = builder.image('sLogo', 'smallLogo', 'dice.png'),
	profile = createItem("profile", '<i class="fal fa-user"></i>', "الملف الشخصي"),
	logout = createItem("logout", '<i class="far fa-sign-out"></i>', "خروج"),
	payments = createItem("payments", '<i class="far fa-credit-card"></i>', "شحن الحساب"),
	list = builder.block("menuList", "menuList", [profile, payments, logout]),
	menu = builder.block("menu", "floatingMenu"),
	addPost = builder.button("add", "navButton", null, '<i class="far fa-plus"></i>'),
	myParticipations = builder.button("participations", "navButton", null, '<i class="far fa-heart"></i>'),
	searchBtn = builder.button("search", "navButton", null, '<i class="far fa-search"></i>'),
	toolsBlock = builder.block("tools", "tools", [searchBtn, myParticipations, addPost, menu]),
	header = builder.block("navbar", "navbar", [logo, toolsBlock]);


logout.onclick = function ()
{
	localStorage.clear();
	document.location.reload();
}

profile.onclick = (()=>{
		let menu = createProfile(JSON.parse(localStorage.getItem("user")));
		builder.app.append(menu);
})

payments.onclick = (()=>{
	let ycp = gateway();
	builder.app.append(ycp);
})

addPost.onclick = (()=>{
	let title = builder.textBox("productName", "العنوان", "text", "textin"),
		desc = builder.textBox("description", "وصف المعروض", "text", "textin"),
		targetPrice = builder.textBox("price", "الثمن", "number", "textin"),
		dateEnd = builder.textBox("endDate", "تاريخ نهاية العرض", "date", "textin"),
		addPost = builder.button("addPost", "go", "التالي"),
		floats1 = floatingBlock(title, desc, targetPrice, dateEnd, addPost);

		desc.setAttribute('maxlength',1000);
		addPost.onclick = (()=>{
			if (title.value == '' || desc.value == '' || targetPrice.value == '' || dateEnd.value == '')
				toast("المرجو ملء جميع الحقول", 3000, "danger");
			else
			{
				let files = builder.textBox("file", "upload", "file", "mediaFiles"),
					uploadBlock = builder.block("uploadMedia", "upload", [files]),
					image1 = builder.image("i1", "postUploadImage", "dice.png"),
					image2 = builder.image("i2", "postUploadImage", "dice.png"),
					image3 = builder.image("i3", "postUploadImage", "dice.png"),
					image4 = builder.image("i4", "postUploadImage", "dice.png"),
					imageContainer = builder.block("postIMages", "postImageConatianer", [image1, image2, builder.block("void", "postSeparator"), image3, image4]),
					validatePost = builder.button("validatePost", "go", "أنشر المعروض"),
					floats = floatingBlock(uploadBlock, imageContainer, validatePost);

				uploadBlock.innerHTML = '<i class="far fa-image"></i>  أضف الصور';
				files.multiple=true;
				files.accept="image/*"
				uploadBlock.onclick = (()=>{files.click()});
				builder.app.removeChild(floats1);
				builder.app.append(floats);
				files.onchange = (()=>{
					if(files.files.length != 4)
						toast("المرجو اختيار اربع صور", 3000, "danger");
					let images = files.files;
					builder.toBase64(images[0], image1);
					builder.toBase64(images[1], image2);
					builder.toBase64(images[2], image3);
					builder.toBase64(images[3], image4);
					
				})
				validatePost.onclick = (()=>{
					if(files.files.length != 4)
						toast("المرجو اختيار اربع صور", 3000, "danger");
					let data = new FormData();
					data.append("operation", "add_listing");
					data.append("title", title.value);
					data.append("desc", desc.value);
					data.append("price", targetPrice.value);
					data.append("dateEnd", dateEnd.value);
					data.append("user", (JSON.parse(localStorage.getItem("user")).id));
					data.append("pic1", files.files[0]);
					data.append("pic2", files.files[1]);
					data.append("pic3", files.files[2]);
					data.append("pic4", files.files[3]);
					builder.brdige(builder.api+"listingController.php", "POST", data,
					function (response){
						if (!response.includes("error"))
							toast("تمت إضافة المنشور بنجاح", 3000, "info");
						else
							toast("حدث خطأ، المرجو إعادة المحاولة بعد قليل", 3000, "warn")
					},
					function (response){
						toast("حدث خطأ، المرجو إعادة المحاولة بعد قليل", 3000, "warn")
					})
				})
			}
		});

		builder.app.append(floats1);
});

export function addNavBar()
{
	builder.app.append(header);
}

export function getUserImage()
{
	if (localStorage.getItem('user') !== null)
	{
		let form = new FormData(),
		user = JSON.parse(localStorage.getItem("user"));

		form.append("operation", "user_photo");
		form.append("id", user.id);
		
		if (localStorage.getItem('userImage') === null)
		{
			builder.brdige(builder.api+"userController.php", "GET", form,
			function(data){
				if (data === "false")
					data = "#"
				localStorage.setItem("userImage", data);
				let userImage = builder.image("userPic", "upp", (JSON.parse(localStorage.getItem("userImage")).image));
				menu.append(userImage, list);
				
			},
			function (status){
				toast("حدث خطأ، المرجو إعادة المحاولة بعد قليل", 3000, "warn")
			})
		}
		else
		{
			if (JSON.parse(localStorage.getItem("userImage")).image === "data:;base64,")
					localStorage.setItem("userImage", JSON.stringify({"image":"profileImage.png"}));
			let userImage = builder.image("userPic", "upp", (JSON.parse(localStorage.getItem("userImage")).image));
			menu.append(userImage, list);
		}
	}
}