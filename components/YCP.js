import * as builder from "../builder/builder.js";
import { toast } from "./alert.js";
import { floatingBlock, floatingMenu } from "./floatingBlock.js";


export function gateway()
{
	let error_container = builder.block("error_container", "YCP"),
		payment_container = builder.block("payment_container", "YCP"),
		pay = builder.button("pay", "YCP", "ادفع", null),
		YCP_container = floatingMenu("YCP_container", error_container, payment_container, pay);

	const ycPay = new YCPay('pub_sandbox_key', {
		formContainer: '#payment_container',
		locale: 'ar',
		isSandbox: true,
		errorContainer: '#error_container',
	});
	return YCP_container;
}