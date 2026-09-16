
import {
  SectionTitle
} from "@/components";
import { Loader } from "@/components/Loader";
import { CartModule } from "@/components/modules/cart";
import { Suspense } from "react";

const CartPage = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <SectionTitle title="Shopping Cart" path="Home | Cart" />
      <div className="bg-slate-950 py-12">
        <div className="mx-auto max-w-screen-2xl px-6 md:px-12 pb-24">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-8">
            Your Shopping Cart
          </h1>
          <Suspense fallback={<Loader />}>
            <CartModule />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
