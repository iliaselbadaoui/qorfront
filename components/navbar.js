import * as builder from "../builder/builder.js"
import { toast } from "./alert.js";
import { floatingBlock } from './floatingBlock.js'

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
	payments = createItem("payments", '<i class="far fa-credit-card"></i>', "وسائل الدفع"),
	accountSettings = createItem("settings", '<i class="far fa-cogs"></i>', "إعدادات الحساب"),
	list = builder.block("menuList", "menuList", [profile, accountSettings, payments, logout]),
	menu = builder.block("menu", "floatingMenu"),
	addPost = builder.button("add", "navButton", "add", '<i class="far fa-plus"></i>'),
	searchBtn = builder.button("search", "navButton", "search", '<i class="far fa-search"></i>'),
	toolsBlock = builder.block("tools", "tools", [searchBtn, addPost, menu]),
	header = builder.block("navbar", "navbar", [logo, toolsBlock]);


logout.onclick = function ()
{
	localStorage.clear();
	document.location.reload();
}

addPost.onclick = (()=>{
	let title = builder.textBox("productName", "العنوان", "text", "textin"),
		desc = builder.textBox("description", "وصف المعروض", "text", "textin"),
		targetPrice = builder.textBox("price", "الثمن", "number", "textin"),
		dateEnd = builder.textBox("endDate", "تاريخ نهاية العرض", "date", "textin"),
		addPost = builder.button("addPost", "go", "التالي"),
		floats1 = floatingBlock(title, desc, targetPrice, dateEnd, addPost);

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
				uploadBlock.onclick = (()=>{files.click()});
				builder.app.removeChild(floats1);
				builder.app.append(floats);
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
			builder.brdige("http://localhost:8080//Controllers/userController.php/", "GET", form,
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
			let userImage = builder.image("userPic", "upp", (JSON.parse(localStorage.getItem("userImage")).image));
			menu.append(userImage, list);
		}
	}
}