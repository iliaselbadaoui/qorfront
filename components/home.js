import * as builder from '../builder/builder.js'
import { toast } from './alert.js'
import { addNavBar, getUserImage } from './navbar.js'
import { floatingBlock } from './floatingBlock.js'
import { addPostsSpace } from './postSpace.js';

if (localStorage.getItem('user') === null)
{
	let logo = builder.image("logo", "logo", "Logo.png"),
	email = builder.textBox("email", "البريد الإلكتروني", "email", "textin"),
	password = builder.textBox("password", "كلمة المرور", "password", "textin"),
	connect = builder.button("connect", "go", "دخول"),
	Logintro = builder.block("Logintro", "Logintro", [logo, email, password, connect]),
	create = builder.button("create", "go createAcc", "إنشاء حساب جديد"),
	overBlock = builder.block("overBlock", "overBlock", [Logintro, create]);

	connect.onclick = function()
	{
		if (email.value === '' || password.value === '')
			toast("المرجو ملء جميع الحقول", 3000, "danger");
		else
		{
			let form = new FormData();

			form.append("operation", "login");
			form.append("email", email.value);
			form.append("password", password.value);
			builder.brdige(builder.api+"userController.php", "GET", form,
			function(data){
				if (data === "false")
					toast("المعلومات خاطئة", 3000, "danger")
				else
					startSession((JSON.parse(data)));
			},
			function (status){
				toast("حدث خطأ، المرجو إعادة المحاولة بعد قليل", 3000, "warn")
			})
		}
	}

	create.onclick = function()
	{
		let label = builder.block("newAccLabel", "bigLabel"),
			name = builder.textBox("name", "الاسم الشخصي", "text", "textin"),
			last = builder.textBox("last", "الاسم العائلي", "text", "textin"),
			address = builder.textBox("address", "العنوان", "text", "textin"),
			phone = builder.textBox("phone", "الهاتف", "text", "textin"),
			cemail = builder.textBox("creationEmail", "البريد الإلكتروني", "email", "textin"),
			cpassword = builder.textBox("creationPassword", "كلمة المرور", "password", "textin"),
			go = builder.button("createAcc", "go", "تسجيل"),
			container = floatingBlock(label, name, last, address, phone, cemail, cpassword, go);

			label.textContent = "إنشاء حساب جديد";
			go.onclick = function ()
			{
				if (email.value === '' || password.value === '' || name.value === '' || last.value === '' || phone.value === '' || address.value === '')
					toast("المرجو ملء جميع الحقول", 3000, "danger");
				else
				{

					let formcreate = new FormData();

					formcreate.append("operation", "create_user");
					formcreate.append("name", name.value);
					formcreate.append("last", last.value);
					formcreate.append("address", address.value);
					formcreate.append("phone", phone.value);
					formcreate.append("email", cemail.value);
					formcreate.append("password", cpassword.value);

					builder.brdige(builder.api+"userController.php", "POST", formcreate,
					function(data){
						if (data === "email")
							toast("البريد الإلكتروني مستعمل", 3000, "danger")
						else
							toast("تم إنشاء الحساب بنجاح", 3000, "info")
					},
					function (status){
						toast("حدث خطأ، المرجو إعادة المحاولة بعد قليل", 3000, "warn")
					})
				}
			}

			builder.app.append(container);

	}

	builder.app.append(overBlock);
}
else
	startSession(JSON.parse(localStorage.getItem('user')))


function startSession(user)
{
	let over = document.getElementById("overBlock")
	
	if (over !== null)
		over.style.display = "none";
	if (localStorage.getItem('user') === null)
		localStorage.setItem("user", JSON.stringify(user));
	getUserImage();
	addNavBar();
	addPostsSpace();
	builder.app.append(builder.block(null, "footer"))
}
