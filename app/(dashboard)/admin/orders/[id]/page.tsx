"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { isValidEmailAddressFormat, isValidNameOrLastname } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface OrderProduct {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    rating: number;
    description: string;
    manufacturer: string;
    inStock: number;
    categoryId: string;
  };
}

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>();
  const [order, setOrder] = useState<Order>({
    id: "",
    adress: "",
    apartment: "",
    company: "",
    dateTime: "",
    email: "",
    lastname: "",
    name: "",
    phone: "",
    postalCode: "",
    city: "",
    country: "",
    orderNotice: "",
    status: "processing",
    total: 0,
  });
  const params = useParams<{ id: string }>();

  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = async () => {
      const response = await apiClient.get(
        `/api/orders/${params?.id}`
      );
      const data: Order = await response.json();
      setOrder(data);
    };

    const fetchOrderProducts = async () => {
      const response = await apiClient.get(
        `/api/order-product/${params?.id}`
      );
      const data: OrderProduct[] = await response.json();
      setOrderProducts(data);
    };

    fetchOrderData();
    fetchOrderProducts();
  }, [params?.id]);

  const updateOrder = async () => {
    if (
      order?.name.length > 0 &&
      order?.lastname.length > 0 &&
      order?.phone.length > 0 &&
      order?.email.length > 0 &&
      order?.company.length > 0 &&
      order?.adress.length > 0 &&
      order?.apartment.length > 0 &&
      order?.city.length > 0 &&
      order?.country.length > 0 &&
      order?.postalCode.length > 0
    ) {
      if (!isValidNameOrLastname(order?.name)) {
        toast.error("You entered invalid name format");
        return;
      }

      if (!isValidNameOrLastname(order?.lastname)) {
        toast.error("You entered invalid lastname format");
        return;
      }

      if (!isValidEmailAddressFormat(order?.email)) {
        toast.error("You entered invalid email format");
        return;
      }

      apiClient.put(`/api/orders/${order?.id}`, {
        method: "PUT", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Order updated successfuly");
          } else {
            throw Error("There was an error while updating a order");
          }
        })
        .catch((error) =>
          toast.error("There was an error while updating a order")
        );
    } else {
      toast.error("Please fill all fields");
    }
  };

  const deleteOrder = async () => {
    const requestOptions = {
      method: "DELETE",
    };

    apiClient.delete(
      `/api/order-product/${order?.id}`,
      requestOptions
    ).then((response) => {
      apiClient.delete(
        `/api/orders/${order?.id}`,
        requestOptions
      ).then((response) => {
        toast.success("Order deleted successfully");
        router.push("/admin/orders");
      });
    });
  };

  const inputClass = "w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";
  const selectClass = "w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 transition-all duration-200";

  return (
    <div className="bg-slate-950 min-h-screen flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 xl:ml-5 w-full max-xl:px-5 py-6">
        <h1 className="text-2xl font-bold text-slate-100">Order Details</h1>

        {/* Order ID */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</span>
          <p className="text-slate-200 font-mono mt-1">{order?.id}</p>
        </div>

        {/* Customer info fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Name</label>
            <input type="text" className={inputClass} value={order?.name} onChange={(e) => setOrder({ ...order, name: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Lastname</label>
            <input type="text" className={inputClass} value={order?.lastname} onChange={(e) => setOrder({ ...order, lastname: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Phone number</label>
            <input type="text" className={inputClass} value={order?.phone} onChange={(e) => setOrder({ ...order, phone: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Email address</label>
            <input type="email" className={inputClass} value={order?.email} onChange={(e) => setOrder({ ...order, email: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Company (optional)</label>
            <input type="text" className={inputClass} value={order?.company} onChange={(e) => setOrder({ ...order, company: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input type="text" className={inputClass} value={order?.adress} onChange={(e) => setOrder({ ...order, adress: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Apartment, suite, etc.</label>
            <input type="text" className={inputClass} value={order?.apartment} onChange={(e) => setOrder({ ...order, apartment: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input type="text" className={inputClass} value={order?.city} onChange={(e) => setOrder({ ...order, city: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input type="text" className={inputClass} value={order?.country} onChange={(e) => setOrder({ ...order, country: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Postal Code</label>
            <input type="text" className={inputClass} value={order?.postalCode} onChange={(e) => setOrder({ ...order, postalCode: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Order Status</label>
            <select
              className={selectClass}
              value={order?.status}
              onChange={(e) => setOrder({ ...order, status: e.target.value as "processing" | "delivered" | "canceled" })}
            >
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>

        {/* Order notice */}
        <div>
          <label className={labelClass}>Order Notice</label>
          <textarea
            className={`${inputClass} h-24 resize-none`}
            value={order?.orderNotice || ""}
            onChange={(e) => setOrder({ ...order, orderNotice: e.target.value })}
          />
        </div>

        {/* Order products */}
        <div>
          <h2 className="text-lg font-bold text-slate-100 mb-4">Ordered Products</h2>
          <div className="space-y-3">
            {orderProducts?.map((product) => (
              <div key={product?.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                  <Image
                    src={product?.product?.mainImage ? `/${product?.product?.mainImage}` : "/product_placeholder.jpg"}
                    alt={product?.product?.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${product?.product?.slug}`} className="text-slate-200 font-semibold hover:text-cyan-400 transition-colors line-clamp-1">
                    {product?.product?.title}
                  </Link>
                  <p className="text-sm text-slate-500 mt-0.5">
                    ${product?.product?.price} Ã— {product?.quantity} items
                  </p>
                </div>
                <span className="text-slate-200 font-bold">
                  ${(product?.product?.price * product?.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Order totals */}
          <div className="mt-6 p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Subtotal</span>
              <span>${order?.total}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Tax 20%</span>
              <span>${(order?.total / 5).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-sm">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between text-slate-100 font-bold text-lg pt-2 border-t border-slate-800">
              <span>Total</span>
              <span>${(order?.total + order?.total / 5 + 5).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap pb-8">
          <button
            type="button"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-cyan-500/20"
            onClick={updateOrder}
          >
            Update Order
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl text-sm uppercase tracking-wider border border-rose-500/30 hover:border-rose-500/50 transition-all duration-200"
            onClick={deleteOrder}
          >
            Delete Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSingleOrder;
