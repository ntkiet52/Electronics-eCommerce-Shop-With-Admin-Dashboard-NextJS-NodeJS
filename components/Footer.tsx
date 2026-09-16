// *********************
// Role of the component: Footer component
// Name of the component: Footer.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Footer />
// Input parameters: no input parameters
// Output: Footer component
// *********************

import { navigation } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80" aria-labelledby="footer-heading">
      <div>
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-screen-2xl px-6 lg:px-8 pt-20 pb-12">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="flex flex-col gap-4">
              <Image
                src="/logo v1.png"
                alt="Singitronic logo"
                width={220}
                height={220}
                className="h-auto w-auto brightness-200 contrast-250"
              />
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Your destination for cutting-edge electronics and smart home tech. Built for speed, performance, and durability.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
                    Sale
                  </h3>
                  <ul role="list" className="mt-4 space-y-3">
                    {navigation.sale.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
                    About Us
                  </h3>
                  <ul role="list" className="mt-4 space-y-3">
                    {navigation.about.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
                    Buying
                  </h3>
                  <ul role="list" className="mt-4 space-y-3">
                    {navigation.buy.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
                    Support
                  </h3>
                  <ul role="list" className="mt-4 space-y-3">
                    {navigation.help.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Singitronic eCommerce. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
