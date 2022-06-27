import * as builder from "../builder/builder.js";
import { toast } from "./alert.js";
import { floatingBlock, floatingMenu } from "./floatingBlock.js";


function listUserPosts(posts, parent)
{
	posts.forEach(post => {
		let photo = builder.image(null, "userProfilePostImage", post.miniature),
			title = builder.label("userProfilePostTitle", post.title),
			trash = builder.button(null, "userProfilePostDelete", null, '<i class="far fa-trash-alt"></i>'),
			container = builder.block(null, "userProfilePost", [photo, title, trash]);
		parent.append(container);

		trash.onclick = (()=>{
			let form = new FormData();
			form.append("operation", "delete_listing");
			form.append("id", post.id);
			builder.brdige(builder.api+"listingController.php", "POST", form,
			function(res){
				document.location.reload();
			},
			function(err){
				console.log(err);
			})
		})
	});
}

export function createProfile(userObj)
{
	let userImageObj = JSON.parse(localStorage.getItem("userImage")),
		userProfileImage = builder.image("profileUserImage", "profileUserImage", userImageObj.image),
		cameraFAIcon = builder.block("CAM", "CAM", null),
		profileFileIN = builder.textBox("UPIFILE", "UPIFILE", "file", "UPIFILE"),
		userProfileImageMask = builder.block("UPIMask", "UPIMask", [profileFileIN, cameraFAIcon]),
		userImageContainer = builder.block('UIContainer', "UIC", [userProfileImage, userProfileImageMask]),
		userName = builder.block("profileUserName", "userProfileData"),
		editProfile = builder.button('editProfile',"EditBTN", "تعديل المعلومات", null),
		EditableData = builder.block("userEditableData", "UED_profile", [userName, editProfile]),
		solde = builder.block(null, "userNumbers",[builder.label("userNumbersLabel", "الرصيد")]),
		publications = builder.block(null, "userNumbers",[builder.label("userNumbersLabel", "المنشورات")]),
		finishedGames = builder.block(null, "userNumbers", [builder.label("userNumbersLabel", "المسابقات الناجحة")]),
		numbers = builder.block("userNumbers", "UN_profile", [solde, publications, finishedGames]),
		userDataBlock = builder.block("userDataBlock", "UDB_profile", [EditableData, numbers]),
		userProfileDataContainer = builder.block("UPDContainer", "UPDContainer", [userImageContainer, userDataBlock]),
		posts = builder.block("userPosts", "userPosts"),
		menu = floatingMenu("profile", userProfileDataContainer, posts);

		userName.textContent = userObj.name + " " + userObj.last;
		cameraFAIcon.innerHTML = '<i class="far fa-camera"></i>';
		profileFileIN.accept="image/*"

		let data = new FormData();
		data.append("operation", 'user_numbers');
		data.append("id", userObj.id);
		builder.brdige(builder.api+"userController.php", "GET",data,
		function(res){
			const userResults = JSON.parse(res);
			solde.append(builder.label("userNumbersLabelValue", userResults.solde+" درهم"));
			publications.append(builder.label("userNumbersLabelValue", userResults.pubs));
			finishedGames.append(builder.label("userNumbersLabelValue", userResults.games));
		},
		function(err){
			console.log(err);
		})
		let postsData = new FormData();
		postsData.append("operation", "user_posts");
		postsData.append("user", userObj.id);
		builder.brdige(builder.api+"listingController.php", "GET", postsData,
		function(res){
			const feed = JSON.parse(res);
			listUserPosts(feed, posts, userObj);
		},
		function(err){
			console.log(err);
		})
		
		if (!builder.isArabic(userName.textContent))
			userName.style.direction = 'ltr';
		userImageContainer.onclick = (()=>{profileFileIN.click()});
		profileFileIN.onchange = (()=>{
			let imageUpdateData = new FormData();
			imageUpdateData.append("operation", "user_photo");
			imageUpdateData.append("id", userObj.id);
			imageUpdateData.append("photo", profileFileIN.files[0]);
			builder.brdige(builder.api+"userController.php", "POST", imageUpdateData,
			function(res){
				let reader = new FileReader();
				reader.onload = function(evt)
				{
					let imageObj = {"image": evt.target.result }
					localStorage.userImage = JSON.stringify(imageObj);
					document.location.reload();
				}
				reader.readAsDataURL(profileFileIN.files[0]);
			},
			function(err){

			})
		})

		editProfile.onclick = (()=>{
			let lab = builder.label("bigLabel", "تحديث المعلومات"),
				email = builder.textBox("creationEmail", "البريد الإلكتروني", "email", "textin"),
				phone = builder.textBox("creationPassword", "الهاتف", "text", "textin"),
				go = builder.button("createAcc", "go", "تحديث"),
				editingBlock = floatingBlock(lab, email, phone, go);

				builder.app.append(editingBlock);
				email.value = userObj.email;
				phone.value = userObj.phone;

				go.onclick = function() {updateUser(userObj, email.value, phone.value)}
		})

		return menu;
}

function updateUser(userObj, email, phone)
{
	if (email === '' || phone === '')
	{
		toast("المرجو ملء جميع الحقول", 3000, "danger");
		return false;
	}
	
	let form = new FormData();
	form.append("operation", "update_user");
	form.append("id", userObj.id);
	form.append("email", email)
	form.append("phone", phone);
	builder.brdige(builder.api+"userController.php", "POST", form,
	function (res)
	{
		if (res === 'true')
		{
			localStorage.clear();
			location.reload();
		}
		else
			toast("حدث خطأ", 3000, "info")
	},
	function (err)
	{
		toast("حدث خطأ", 3000, "info")
	})
}