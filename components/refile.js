import * as builder from "../builder/builder.js";
import { toast } from "./alert.js";
import { floatingBlock, floatingMenu } from "./floatingBlock.js";


export function gateway(orderID)
{
	const paylike = Paylike({key: '2f2522f0-e56b-4e2f-944c-c890139482d5'})
  paylike.pay(
    {
      test: true,
      amount: {currency: 'MAD', exponent: 3, value: 2000},
      title: 'QOR3A REFILL',
      description: '200DH de solde sur Qor3a.ma',
      custom: {orderId: },
      text: 'Any Tool Shop*1234',
    },
    (err, result) => {
      if (err) return console.log(err)
      console.log(result.transaction.id)
    }
  )
}