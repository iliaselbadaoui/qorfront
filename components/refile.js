import * as builder from "../builder/builder.js";
import { toast } from "./alert.js";
import { floatingBlock, floatingMenu } from "./floatingBlock.js";
import { updateUserLocalData } from "./profile.js";



export function gateway(orderID, amount, user)
{
	const paylike = Paylike({key: '2f2522f0-e56b-4e2f-944c-c890139482d5'})
	paylike.pay(
		{
			test: true,
			amount: {currency: 'MAD', exponent: 1, value: amount*10},
			title: 'QOR3A REFILL',
			description: amount+'DH de solde sur Qor3a.ma',
			custom: {orderId: orderID},
			text: user.name+" "+user.last,
		},
		(err, result) => {
			if (err) return 0;


			let form = new FormData();

			form.append("operation", "add_balance");
			form.append("user", user.id);
			form.append("balance", amount);
			builder.brdige(builder.api+"/userController.php", "POST", form,
			((res)=>{
				if (res === 'true')
					toast("تم شحن الحساب بنجاح", 3000, 'info')
				else
					toast("حدث خطأ! المرجو إعادة المحاولة", 3000, 'danger')
			}),
			((err)=>{
				toast("حدث خطأ! المرجو إعادة المحاولة", 3000, 'danger')
			}))
		}
	)
}