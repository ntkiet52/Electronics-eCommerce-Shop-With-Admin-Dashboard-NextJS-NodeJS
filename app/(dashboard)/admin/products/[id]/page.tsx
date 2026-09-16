"use client";
import { CustomButton, DashboardSidebar, SectionTitle } from "@/components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import {
  convertCategoryNameToURLFriendly as convertSlugToURLFriendly,
  formatCategoryName,
} from "../../../../../utils/categoryFormating";
import { nanoid } from "nanoid";
import apiClient from "@/lib/api";

interface DashboardProductDetailsProps {
  params: Promise<{ id: string }>;
}

const DashboardProductDetails = ({ params }: DashboardProductDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>();
  const [otherImages, setOtherImages] = useState<OtherImages[]>([]);
  const router = useRouter();

  // functionality for deleting product
  const deleteProduct = async () => {
    const requestOptions = {
      method: "DELETE",
    };
    apiClient
      .delete(`/api/products/${id}`, requestOptions)
      .then((response) => {
        if (response.status !== 204) {
          if (response.status === 400) {
            toast.error(
              "Cannot delete the product because of foreign key constraint"
            );
          } else {
            throw Error("There was an error while deleting product");
          }
        } else {
          toast.success("Product deleted successfully");
          router.push("/admin/products");
        }
      })
      .catch((error) => {
        toast.error("There was an error while deleting product");
      });
  };

  // functionality for updating product
  const updateProduct = async () => {
    if (
      product?.title === "" ||
      product?.slug === "" ||
      product?.price.toString() === "" ||
      product?.manufacturer === "" ||
      product?.description === ""
    ) {
      toast.error("You need to enter values in input fields");
      return;
    }

    try {
      const response = await apiClient.put(`/api/products/${id}`, product);

      if (response.status === 200) {
        await response.json();
        toast.success("Product successfully updated");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || "There was an error while updating product"
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("There was an error while updating product");
    }
  };

  // functionality for uploading main image file
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
        toast.error("File upload unsuccessful.");
      }
    } catch (error) {
      console.error("There was an error while during request sending:", error);
      toast.error("There was an error during request sending");
    }
  };

  // fetching main product data including other product images
  const fetchProductData = async () => {
    apiClient
      .get(`/api/products/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      });

    const imagesData = await apiClient.get(`/api/images/${id}`, {
      cache: "no-store",
    });
    const images = await imagesData.json();
    setOtherImages((currentImages) => images);
  };

  // fetching all product categories. It will be used for displaying categories in select category input
  const fetchCategories = async () => {
    apiClient
      .get(`/api/categories`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      });
  };

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);

  const inputClass = "w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";
  const selectClass = "w-full bg-slate-800/60 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/60 transition-all duration-200";

  return (
    <div className="bg-slate-950 min-h-screen flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 xl:ml-5 w-full max-xl:px-5 py-6">
        <h1 className="text-2xl font-bold text-slate-100">Product Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Product name */}
          <div>
            <label className={labelClass}>Product name</label>
            <input
              type="text"
              className={inputClass}
              value={product?.title || ""}
              onChange={(e) => setProduct({ ...product!, title: e.target.value })}
            />
          </div>

          {/* Product price */}
          <div>
            <label className={labelClass}>Product price ($)</label>
            <input
              type="text"
              className={inputClass}
              value={product?.price || ""}
              onChange={(e) => setProduct({ ...product!, price: Number(e.target.value) })}
            />
          </div>

          {/* Manufacturer */}
          <div>
            <label className={labelClass}>Manufacturer</label>
            <input
              type="text"
              className={inputClass}
              value={product?.manufacturer || ""}
              onChange={(e) => setProduct({ ...product!, manufacturer: e.target.value })}
            />
          </div>

          {/* Slug */}
          <div>
            <label className={labelClass}>Slug</label>
            <input
              type="text"
              className={inputClass}
              value={product?.slug ? convertSlugToURLFriendly(product?.slug) : ""}
              onChange={(e) => setProduct({ ...product!, slug: convertSlugToURLFriendly(e.target.value) })}
            />
          </div>

          {/* In Stock */}
          <div>
            <label className={labelClass}>In Stock?</label>
            <select
              className={selectClass}
              value={product?.inStock ?? 1}
              onChange={(e) => setProduct({ ...product!, inStock: Number(e.target.value) })}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={selectClass}
              value={product?.categoryId || ""}
              onChange={(e) => setProduct({ ...product!, categoryId: e.target.value })}
            >
              {categories && categories.map((category: Category) => (
                <option key={category?.id} value={category?.id}>
                  {formatCategoryName(category?.name)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main image upload */}
        <div>
          <label className={labelClass}>Main Image</label>
          <input
            type="file"
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 file:border file:border-cyan-500/30 transition-all"
            onChange={(e) => {
              // @ts-ignore
              const selectedFile = e.target.files[0];
              if (selectedFile) {
                uploadFile(selectedFile);
                setProduct({ ...product!, mainImage: selectedFile.name });
              }
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

        {/* Other images */}
        {otherImages && otherImages.length > 0 && (
          <div>
            <label className={labelClass}>Other Images</label>
            <div className="flex gap-2 flex-wrap">
              {otherImages.map((image) => (
                <div key={nanoid()} className="w-20 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                  <Image
                    src={`/${image.image}`}
                    alt="product image"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className={labelClass}>Product description</label>
          <textarea
            className={`${inputClass} h-32 resize-none`}
            value={product?.description || ""}
            onChange={(e) => setProduct({ ...product!, description: e.target.value })}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap pb-8">
          <button
            type="button"
            onClick={updateProduct}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-cyan-500/20"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={deleteProduct}
            className="px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl text-sm uppercase tracking-wider border border-rose-500/30 hover:border-rose-500/50 transition-all duration-200"
          >
            Delete Product
          </button>
        </div>
        <p className="text-sm text-rose-400/80 -mt-4 pb-4">
          To delete the product you first need to delete all its records in orders (customer_order_product table).
        </p>
      </div>
    </div>
  );
};

export default DashboardProductDetails;
