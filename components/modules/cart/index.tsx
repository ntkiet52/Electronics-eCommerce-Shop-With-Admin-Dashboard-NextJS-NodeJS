"use client"

import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import Image from "next/image"
import Link from "next/link";
import { FaCheck, FaCircleQuestion, FaClock, FaXmark } from "react-icons/fa6";
import QuantityInputCart from "@/components/QuantityInputCart";
import { sanitize } from "@/lib/sanitize";

export const CartModule = () => {

  const { products, removeFromCart, calculateTotals, total } =
    useProductStore();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    calculateTotals();
    toast.success("Product removed from the cart");
  };
  return (
    <form className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
      <section aria-labelledby="cart-heading" className="lg:col-span-7">
        <h2 id="cart-heading" className="sr-only">
          Items in your shopping cart
        </h2>

        {products.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center backdrop-blur-xl">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
            <p className="text-slate-400 text-sm mb-6">Looks like you haven't added any tech items to your cart yet.</p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <ul
            role="list"
            className="divide-y divide-slate-800/80 border-b border-t border-slate-800/80"
          >
            {products.map((product) => (
              <li key={product.id} className="flex py-6 sm:py-8 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 mb-4 backdrop-blur-md">
                <div className="flex-shrink-0 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <Image
                    width={120}
                    height={120}
                    src={product?.image ? `/${product.image}` : "/product_placeholder.jpg"}
                    alt="product image"
                    className="h-24 w-24 object-contain sm:h-32 sm:w-32"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6 text-slate-200">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-base font-bold text-white hover:text-cyan-400 transition-colors">
                          <Link href={`/product/${product.slug || '#'}`}>
                            {sanitize(product.title)}
                          </Link>
                        </h3>
                      </div>
                      <p className="mt-1 text-lg font-black text-cyan-400">
                        ${product.price}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <QuantityInputCart product={product} />
                      <div className="absolute right-0 top-0">
                        <button
                          onClick={() => handleRemoveItem(product.id)}
                          type="button"
                          className="-m-2 inline-flex p-2 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <span className="sr-only">Remove</span>
                          <FaXmark className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                    <FaCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>In stock & ready to ship</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Order summary */}
      <section
        aria-labelledby="summary-heading"
        className="mt-12 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 lg:col-span-5 lg:mt-0 backdrop-blur-xl shadow-2xl text-slate-200"
      >
        <h2
          id="summary-heading"
          className="text-xl font-black text-white uppercase tracking-wider border-b border-slate-800 pb-4"
        >
          Order Summary
        </h2>

        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">Subtotal</dt>
            <dd className="font-bold text-white">${total}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
            <dt className="flex items-center text-slate-400">
              <span>Shipping Estimate</span>
              <FaCircleQuestion className="ml-2 h-4 w-4 text-slate-500 hover:text-slate-300" aria-hidden="true" />
            </dt>
            <dd className="font-bold text-white">$5.00</dd>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
            <dt className="flex items-center text-slate-400">
              <span>Tax Estimate</span>
              <FaCircleQuestion className="ml-2 h-4 w-4 text-slate-500 hover:text-slate-300" aria-hidden="true" />
            </dt>
            <dd className="font-bold text-white">${(total / 5).toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-base">
            <dt className="font-extrabold text-white">Order Total</dt>
            <dd className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              ${total === 0 ? 0 : (total + total / 5 + 5).toFixed(2)}
            </dd>
          </div>
        </dl>

        {products.length > 0 && (
          <div className="mt-8">
            <Link
              href="/checkout"
              className="block w-full text-center py-4 px-6 rounded-xl font-extrabold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] transition-all duration-200"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </section>
    </form>
  );
};
