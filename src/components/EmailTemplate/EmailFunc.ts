import type { NextApiRequest, NextApiResponse } from "next";

import { Resend } from "resend";
import { ReactNode } from "react";
import axios from "axios";

const resend = new Resend("re_Qrb3dzE8_2LgACRYb7vjgrqeDqJcijVec");

const EmailFunc = async (
  emailTo: string = "delivered@resend.dev",
  emailSubject: string = "Hello world",
  templateComponent: ReactNode,
  req?: NextApiRequest,
  res?: NextApiResponse
) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [emailTo],
    subject: emailSubject,
    react: templateComponent,
  });

  if (error) {
    throw error;
    // return res.status(400).json(error);
  }

  //   res.status(200).json(data);
  return data;
};
export default EmailFunc;

interface Idetails{
  amount: number;
  description: string;
  order_id: number;
  url: string;
}
export const createUmoneyPay = async (details: Idetails) => {
  const { data } = await axios.post<Idata>("https://api.yookassa.ru/v3/payments", {
    amount: {
      value: details.amount,
      currency: "RUB",
    },
    capture: true,
    description: details.description,
    metadata: {
      order_id: details.order_id,
      // sdfsdf:"sdfsdf"? любую метадату можно передать
    },
    confirmation: {
      type: "redirect",
      return_url: details.url, //"https://ya.ru"
    },
  },{
    auth:{
      username: "your_username",
      password: "your_password"
    },
    headers:{
      "Idempotency-Key": "your_idempotency_random_key"
    }
  });

  return data;
};
 interface Idata {
  id: string;
  status: string;
  amount:Amount
  description: string;
  recipient: Recipient
  created_at: string;
  confirmation: Confirmation
  test: boolean
  paid: boolean
  refundable: boolean
  metadata: Metadata
 }
 interface Amount {
  value: string;
  currency: string;
}
interface Recipient {
  account_id: string;
  gateway_id: string;
}
interface Confirmation{
  type: string;
  confirmation_url: string;
}
interface Metadata {
  order_id: string;
}