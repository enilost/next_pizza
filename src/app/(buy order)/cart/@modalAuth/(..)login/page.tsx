import LoginRegistration from "@/components/LoginRegistration/LoginRegistration";
import { Modal } from "@/components/Modal/Modal";
import { FunctionComponent } from "react";


export const dynamic = 'force-static';
export const revalidate = false;



interface ProductIdProps {

}

const CartLogin: FunctionComponent<ProductIdProps> = () => {

  return (
    <>
      <Modal>
        {/* <Suspense> */}
      <LoginRegistration></LoginRegistration>
      {/* </Suspense> */}
        {/* <div>modal карточка продукта {params.id}</div>
        <pre>{JSON.stringify(product, null, 2)}</pre> */}
      </Modal>
    </>
  );
};

export default CartLogin;
