"use client";
import { SectionTitle } from "@/components";
import { useProductStore } from "../_zustand/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
    company: "",
    adress: "",
    apartment: "",
    city: "",
    country: "",
    postalCode: "",
    orderNotice: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { products, total, clearCart } = useProductStore();
  const router = useRouter();

  // Add validation functions that match server requirements
  const validateForm = () => {
    const errors: string[] = [];
    
    // Name validation
    if (!checkoutForm.name.trim() || checkoutForm.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }
    
    // Lastname validation
    if (!checkoutForm.lastname.trim() || checkoutForm.lastname.trim().length < 2) {
      errors.push("Lastname must be at least 2 characters");
    }
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!checkoutForm.email.trim() || !emailRegex.test(checkoutForm.email.trim())) {
      errors.push("Please enter a valid email address");
    }
    
    // Phone validation (must be at least 10 digits)
    const phoneDigits = checkoutForm.phone.replace(/[^0-9]/g, '');
    if (!checkoutForm.phone.trim() || phoneDigits.length < 10) {
      errors.push("Phone number must be at least 10 digits");
    }
    
    // Company validation
    if (!checkoutForm.company.trim() || checkoutForm.company.trim().length < 5) {
      errors.push("Company must be at least 5 characters");
    }
    
    // Address validation
    if (!checkoutForm.adress.trim() || checkoutForm.adress.trim().length < 5) {
      errors.push("Address must be at least 5 characters");
    }
    
    // Apartment validation (updated to 1 character minimum)
    if (!checkoutForm.apartment.trim() || checkoutForm.apartment.trim().length < 1) {
      errors.push("Apartment is required");
    }
    
    // City validation
    if (!checkoutForm.city.trim() || checkoutForm.city.trim().length < 5) {
      errors.push("City must be at least 5 characters");
    }
    
    // Country validation
    if (!checkoutForm.country.trim() || checkoutForm.country.trim().length < 5) {
      errors.push("Country must be at least 5 characters");
    }
    
    // Postal code validation
    if (!checkoutForm.postalCode.trim() || checkoutForm.postalCode.trim().length < 3) {
      errors.push("Postal code must be at least 3 characters");
    }
    
    return errors;
  };

  const makePurchase = async () => {
    // Client-side validation first
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => {
        toast.error(error);
      });
      return;
    }

    // Basic client-side checks for required fields (UX only)
    const requiredFields = [
      'name', 'lastname', 'phone', 'email', 'company', 
      'adress', 'apartment', 'city', 'country', 'postalCode'
    ];
    
    const missingFields = requiredFields.filter(field => 
      !checkoutForm[field as keyof typeof checkoutForm]?.trim()
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (products.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (total <= 0) {
      toast.error("Invalid order total");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🚀 Starting order creation...");
      
      // Get user ID if logged in
      let userId = null;
      if (session?.user?.email) {
        try {
          console.log("🔍 Getting user ID for logged-in user:", session.user.email);
          const userResponse = await apiClient.get(`/api/users/email/${session.user.email}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            userId = userData.id;
            console.log("✅ Found user ID:", userId);
          } else {
            console.log("❌ Could not find user with email:", session.user.email);
          }
        } catch (userError) {
          console.log("⚠️  Error getting user ID:", userError);
        }
      }
      
      // Prepare the order data
      const orderData = {
        name: checkoutForm.name.trim(),
        lastname: checkoutForm.lastname.trim(),
        phone: checkoutForm.phone.trim(),
        email: checkoutForm.email.trim().toLowerCase(),
        company: checkoutForm.company.trim(),
        adress: checkoutForm.adress.trim(),
        apartment: checkoutForm.apartment.trim(),
        postalCode: checkoutForm.postalCode.trim(),
        status: "pending",
        total: total,
        city: checkoutForm.city.trim(),
        country: checkoutForm.country.trim(),
        orderNotice: checkoutForm.orderNotice.trim(),
        userId: userId // Add user ID for notifications
      };

      console.log("📋 Order data being sent:", orderData);

      // Send order data to server for validation and processing
      const response = await apiClient.post("/api/orders", orderData);

      console.log("📡 API Response received:");
      console.log("  Status:", response.status);
      console.log("  Status Text:", response.statusText);
      console.log("  Response OK:", response.ok);
      
      // Check if response is ok before parsing
      if (!response.ok) {
        console.error("❌ Response not OK:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        
        // Try to parse as JSON to get detailed error info
        try {
          const errorData = JSON.parse(errorText);
          console.error("Parsed error data:", errorData);
          
          // Handle different error types
          if (response.status === 409) {
            // Duplicate order error
            toast.error(errorData.details || errorData.error || "Duplicate order detected");
            return; // Don't throw, just return to stop execution
          } else if (errorData.details && Array.isArray(errorData.details)) {
            // Validation errors
            errorData.details.forEach((detail: any) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else if (typeof errorData.details === 'string') {
            // Single error message in details
            toast.error(errorData.details);
          } else {
            // Fallback error message
            toast.error(errorData.error || "Order creation failed");
          }
        } catch (parseError) {
          console.error("Could not parse error as JSON:", parseError);
          toast.error("Order creation failed. Please try again.");
        }
        
        return; // Stop execution instead of throwing
      }

      const data = await response.json();
      console.log("✅ Parsed response data:", data);
      
      const orderId: string = data.id;
      console.log("🆔 Extracted order ID:", orderId);

      if (!orderId) {
        console.error("❌ Order ID is missing or falsy!");
        console.error("Full response data:", JSON.stringify(data, null, 2));
        throw new Error("Order ID not received from server");
      }

      console.log("✅ Order ID validation passed, proceeding with product addition...");

      // Add products to order
      for (let i = 0; i < products.length; i++) {
        console.log(`🛍️ Adding product ${i + 1}/${products.length}:`, {
          orderId,
          productId: products[i].id,
          quantity: products[i].amount
        });
        
        await addOrderProduct(orderId, products[i].id, products[i].amount);
        console.log(`✅ Product ${i + 1} added successfully`);
      }

      console.log(" All products added successfully!");

      // Clear form and cart
      setCheckoutForm({
        name: "",
        lastname: "",
        phone: "",
        email: "",
        company: "",
        adress: "",
        apartment: "",
        city: "",
        country: "",
        postalCode: "",
        orderNotice: "",
      });
      clearCart();
      
      // Refresh notification count if user is logged in
      try {
        // This will trigger a refresh of notifications in the background
        window.dispatchEvent(new CustomEvent('orderCompleted'));
      } catch (error) {
        console.log('Note: Could not trigger notification refresh');
      }
      
      toast.success("Order created successfully! You will be contacted for payment.");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      console.error("💥 Error in makePurchase:", error);
      
      // Handle server validation errors
      if (error.response?.status === 400) {
        console.log(" Handling 400 error...");
        try {
          const errorData = await error.response.json();
          console.log("Error data:", errorData);
          if (errorData.details && Array.isArray(errorData.details)) {
            // Show specific validation errors
            errorData.details.forEach((detail: any) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else {
            toast.error(errorData.error || "Validation failed");
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          toast.error("Validation failed");
        }
      } else if (error.response?.status === 409) {
        toast.error("Duplicate order detected. Please wait before creating another order.");
      } else {
        console.log("🔍 Handling generic error...");
        toast.error("Failed to create order. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOrderProduct = async (
    orderId: string,
    productId: string,
    productQuantity: number
  ) => {
    try {
      console.log("️ Adding product to order:", {
        customerOrderId: orderId,
        productId,
        quantity: productQuantity
      });
      
      const response = await apiClient.post("/api/order-product", {
        customerOrderId: orderId,
        productId: productId,
        quantity: productQuantity,
      });

      console.log("📡 Product order response:", response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Product order failed:", response.status, errorText);
        throw new Error(`Product order failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Product order successful:", data);
      
    } catch (error) {
      console.error("💥 Error creating product order:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (products.length === 0) {
      toast.error("You don't have items in your cart");
      router.push("/cart");
    }
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-20">
      <SectionTitle title="Checkout" path="Home | Cart | Checkout" />

      <main className="relative mx-auto max-w-screen-2xl px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <h1 className="sr-only">Order information</h1>

        {/* Form Inputs Section (Left Column - 7 cols) */}
        <form className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl space-y-10">
          {/* Contact Information */}
          <section aria-labelledby="contact-info-heading">
            <h2
              id="contact-info-heading"
              className="text-xl font-black text-white uppercase tracking-wider border-b border-slate-800 pb-4"
            >
              Contact Information
            </h2>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                >
                  First Name *
                </label>
                <input
                  value={checkoutForm.name}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      name: e.target.value,
                    })
                  }
                  type="text"
                  id="name-input"
                  name="name-input"
                  autoComplete="given-name"
                  required
                  placeholder="John"
                  disabled={isSubmitting}
                  className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="lastname-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Last Name *
                </label>
                <input
                  value={checkoutForm.lastname}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      lastname: e.target.value,
                    })
                  }
                  type="text"
                  id="lastname-input"
                  name="lastname-input"
                  autoComplete="family-name"
                  required
                  placeholder="Doe"
                  disabled={isSubmitting}
                  className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="phone-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Phone Number *
                </label>
                <input
                  value={checkoutForm.phone}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      phone: e.target.value,
                    })
                  }
                  type="tel"
                  id="phone-input"
                  name="phone-input"
                  autoComplete="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  disabled={isSubmitting}
                  className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="email-address"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Email Address *
                </label>
                <input
                  value={checkoutForm.email}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      email: e.target.value,
                    })
                  }
                  type="email"
                  id="email-address"
                  name="email-address"
                  autoComplete="email"
                  required
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                  className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                />
              </div>
            </div>
          </section>

          {/* Payment Notice */}
          <section className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-start gap-3">
            <svg className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-xs space-y-1">
              <h3 className="font-bold uppercase tracking-wider text-cyan-200">Secure Order Processing</h3>
              <p className="text-slate-300">Payment details will be verified upon order placement. You will receive an instant invoice confirmation.</p>
            </div>
          </section>

          {/* Shipping Address */}
          <section aria-labelledby="shipping-heading">
            <h2
              id="shipping-heading"
              className="text-xl font-black text-white uppercase tracking-wider border-b border-slate-800 pb-4"
            >
              Shipping Address
            </h2>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="company"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  placeholder="Acme Corp"
                  disabled={isSubmitting}
                  className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                  value={checkoutForm.company}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      company: e.target.value,
                    })
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  required
                  placeholder="123 Tech Boulevard"
                  disabled={isSubmitting}
                  className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                  value={checkoutForm.adress}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      adress: e.target.value,
                    })
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="apartment"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Apartment, Suite, Unit *
                </label>
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  required
                  placeholder="Apt 4B"
                  disabled={isSubmitting}
                  className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                  value={checkoutForm.apartment}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      apartment: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  required
                  placeholder="San Francisco"
                  disabled={isSubmitting}
                  className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                  value={checkoutForm.city}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      city: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="region"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Country *
                </label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  autoComplete="address-level1"
                  required
                  placeholder="United States"
                  disabled={isSubmitting}
                  className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                  value={checkoutForm.country}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      country: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="postal-code"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="postal-code"
                  name="postal-code"
                  autoComplete="postal-code"
                  required
                  placeholder="94103"
                  disabled={isSubmitting}
                  className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                  value={checkoutForm.postalCode}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      postalCode: e.target.value,
                    })
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="order-notice"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Order Notes / Special Delivery Instructions
                </label>
                <textarea
                  id="order-notice"
                  name="order-notice"
                  rows={3}
                  placeholder="Gate code, delivery preferences..."
                  disabled={isSubmitting}
                  className="block w-full rounded-xl bg-slate-800/80 border border-slate-700/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm transition-all"
                  value={checkoutForm.orderNotice}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      orderNotice: e.target.value,
                    })
                  }
                ></textarea>
              </div>
            </div>
          </section>

          <div className="pt-4">
            <button
              type="button"
              onClick={makePurchase}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold py-4 px-8 uppercase tracking-wider text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing Order..." : "Place Order Now"}
            </button>
          </div>
        </form>

        {/* Order Summary Sidebar (Right Column - 5 cols) */}
        <section
          aria-labelledby="summary-heading"
          className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl text-slate-200 sticky top-28"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2 id="summary-heading" className="text-xl font-black text-white uppercase tracking-wider border-b border-slate-800 pb-4">
              Items in Your Order
            </h2>

            <ul
              role="list"
              className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto pr-2 my-4"
            >
              {products.map((product) => (
                <li key={product?.id} className="flex items-center space-x-4 py-4">
                  <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
                    <Image
                      src={product?.image ? `/${product?.image}` : "/product_placeholder.jpg"}
                      alt={product?.title}
                      width={64}
                      height={64}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                  <div className="flex-auto min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{product?.title}</h3>
                    <p className="text-xs text-slate-400">Qty: {product?.amount}</p>
                  </div>
                  <p className="flex-none text-base font-extrabold text-cyan-400">
                    ${product?.price}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="space-y-4 border-t border-slate-800 pt-6 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">Subtotal</dt>
                <dd className="font-bold text-white">${total}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">Flat Rate Shipping</dt>
                <dd className="font-bold text-white">$5.00</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-400">Estimated Taxes</dt>
                <dd className="font-bold text-white">${(total / 5).toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-base">
                <dt className="font-extrabold text-white">Grand Total</dt>
                <dd className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  ${total === 0 ? 0 : (total + total / 5 + 5).toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CheckoutPage;
