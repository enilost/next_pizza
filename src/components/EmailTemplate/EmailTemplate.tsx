import { FunctionComponent } from "react";

export interface EmailTemplateProps {
  fullName: string;
  orderId: string | number;
  totalAmount: string | number;
  url: string;
}

const EmailTemplate: FunctionComponent<EmailTemplateProps> = ({
  fullName,
  orderId,
  totalAmount,
  url
}) => {
  return (
    <div>
      <h1>Привет, {fullName}</h1>
      <h1>Заказ №{orderId}</h1>
      <p>
        Оплата в размере {totalAmount}₽. Перейдите
        <a href={url}> по этой ссылке, для оплаты заказа</a>.
      </p>
    </div>
  );
};

export default EmailTemplate;
