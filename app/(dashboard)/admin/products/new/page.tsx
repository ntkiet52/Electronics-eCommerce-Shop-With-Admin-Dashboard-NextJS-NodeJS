"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly as convertSlugToURLFriendly } from "@/utils/categoryFormating";
import { sanitizeFormData } from "@/lib/form-sanitize";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddNewProduct = () => {
  const [product, setProduct] = useState<{
    merchantId?: string;
    title: string;
    price: number;
    manufacturer: string;
    inStock: number;
    mainImage: string;
    description: string;
    slug: string;
    categoryId: string;
  }>({
    merchantId: "",
    title: "",
    price: 0,
    manufacturer: "",
    inStock: 1,
    mainImage: "",
    description: "",
    slug: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const addProduct = async () => {
    if (
      !product.merchantId ||
      product.title === "" ||
      product.manufacturer === "" ||
      product.description == "" ||
      product.slug === ""
    ) {
      toast.error("Please enter values in input fields");
      return;
    }

    try {
      // Sanitize form data before sending to API
      const sanitizedProduct = sanitizeFormData(product);

      console.log("Sending product data:", sanitizedProduct);

      // Correct usage of apiClient.post
      const response = await apiClient.post(`/api/products`, sanitizedProduct);

      if (response.status === 201) {
        const data = await response.json();
        console.log("Product created successfully:", data);
        toast.success("Product added successfully");
        setProduct({
          merchantId: "",
          title: "",
          price: 0,
          manufacturer: "",
          inStock: 1,
          mainImage: "",
          description: "",
          slug: "",
          categoryId: categories[0]?.id || "",
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to create product:", errorData);
        toast.error(`"Error:" ${errorData.message || "Failed to add product"}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const fetchMerchants = async () => {
    try {
      const res = await apiClient.get("/api/merchants");
      const data: Merchant[] = await res.json();
      setMerchants(data || []);
      setProduct((prev) => ({
      ...prev,
        merchantId: prev.merchantId || data?.[0]?.id || "",
      }));
    } catch (e) {
      toast.error("Failed to load merchants");
    }
  };

  const uploadFile = async (file: any) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);

    try {
      const response = await apiClient.post("/api/main-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
      } else {
        console.error("File upload unsuccessfull");
      }
    } catch (error) {
      console.error("Error happend while sending request:", error);
    }
  };

  const fetchCategories = async () => {
    apiClient
      .get(`/api/categories`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setProduct({
          merchantId: product.merchantId || "",
          title: "",
          price: 0,
          manufacturer: "",
          inStock: 1,
          mainImage: "",
          description: "",
          slug: "",
          categoryId: data[0]?.id,
        });
      });
  };

  useEffect(() => {
    fetchCategories();
    fetchMerchants();
  }, []);

  const inputClass = "w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";
  const selectClass = "w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 transition-all duration-200";

  return (
    <div className="bg-slate-950 min-h-screen flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 xl:ml-5 max-xl:px-5 w-full py-6">
        <h1 className="text-2xl font-bold text-slate-100">Add New Product</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Merchant */}
          <div className="md:col-span-2">
            <label className={labelClass}>Merchant</label>
            <select
              className={selectClass}
              value={product?.merchantId}
              onChange={(e) => setProduct({ ...product, merchantId: e.target.value })}
            >
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>{merchant.name}</option>
              ))}
            </select>
            {merchants.length === 0 && (
              <span className="text-xs text-rose-400 mt-1 block">Please create a merchant first.</span>
            )}
          </div>

          {/* Product name */}
          <div>
            <label className={labelClass}>Product name</label>
            <input
              type="text"
              className={inputClass}
              value={product?.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
            />
          </div>

          {/* Slug */}
          <div>
            <label className={labelClass}>Product slug</label>
            <input
              type="text"
              className={inputClass}
              value={convertSlugToURLFriendly(product?.slug)}
              onChange={(e) => setProduct({ ...product, slug: convertSlugToURLFriendly(e.target.value) })}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={selectClass}
              value={product?.categoryId}
              onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
            >
              {categories && categories.map((category: any) => (
                <option key={category?.id} value={category?.id}>{category?.name}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className={labelClass}>Product price ($)</label>
            <input
              type="text"
              className={inputClass}
              value={product?.price}
              onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            />
          </div>

          {/* Manufacturer */}
          <div>
            <label className={labelClass}>Manufacturer</label>
            <input
              type="text"
              className={inputClass}
              value={product?.manufacturer}
              onChange={(e) => setProduct({ ...product, manufacturer: e.target.value })}
            />
          </div>

          {/* In Stock */}
          <div>
            <label className={labelClass}>In Stock?</label>
            <select
              className={selectClass}
              value={product?.inStock}
              onChange={(e) => setProduct({ ...product, inStock: Number(e.target.value) })}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </div>

          {/* Main image */}
          <div className="md:col-span-2">
            <label className={labelClass}>Main Image</label>
            <input
              type="file"
              ref={undefined}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 file:border file:border-cyan-500/30 transition-all"
              onChange={(e: any) => {
                uploadFile(e.target.files[0]);
                setProduct({ ...product, mainImage: e.target.files[0].name });
              }}
            />
            {product?.mainImage && (
              <div className="mt-3 w-24 h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                <Image
                  src={`/` + product?.mainImage}
                  alt={product?.title}
                  className="w-full h-full object-contain"
                  width={100}
                  height={100}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className={labelClass}>Product description</label>
            <textarea
              className={`${inputClass} h-32 resize-none`}
              value={product?.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pb-8">
          <button
            onClick={addProduct}
            type="button"
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-cyan-500/20"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;

