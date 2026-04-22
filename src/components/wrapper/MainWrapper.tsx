"use client";
import React from "react";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import AdminSidebar from "../shared/AdminSidebar";
import { cn } from "@/lib/utils";


const pageTitleByPath: Record<string, string> = {
    "/": "Dashboard",
    "/orders": "Orders Management",
    "/menu-&-catalog": "Menu & Catalog",
    "/banner-ads": "Banner Ads",
    "/riders": "Manage Riders",
    "/category": "Manage Categories",
    "/settings": "Settings",
};

const MainWrapper = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const pathname = usePathname();
    const pageTitle = pageTitleByPath[pathname] ?? "Dashboard";

    return (
        <div className="h-screen overflow-hidden bg-[#F9F8F5]">
            <AdminSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />

            <div
                className={cn(
                    "h-screen p-3 pt-16 transition-[padding-left] duration-300 md:p-4 md:pt-16 lg:pt-4",
                    collapsed ? "lg:pl-25" : "lg:pl-68"
                )}
            >
                <div className="flex h-full flex-col">
                    <header className="mb-4 shrink-0 flex flex-col gap-3 md:mb-5 md:flex-row md:items-center md:justify-between">
                        <h1 className="pl-12 text-2xl font-semibold text-title md:pl-0">{pageTitle}</h1>

                        {/* <div className="relative flex-1 md:w-70 md:flex-none">
                            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/40" />
                            <Input placeholder="Search orders, products, riders..." className="pl-10 bg-white rounded-2xl" />
                        </div> */}

                        <div className="flex items-center gap-2 md:gap-3 bg-[#1111110F] p-1 rounded-2xl">


                            <button
                                type="button"
                                className="inline-flex p-3 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 hover:bg-black/5"
                                aria-label="Notifications"
                            >
                                <Bell className="size-4" />
                            </button>

                            <div className="inline-flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-2.5">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#D94906] text-xs font-semibold text-white">
                                    AD
                                </span>
                                <span className="pr-1 text-sm font-medium text-title">Admin</span>
                            </div>
                        </div>
                    </header>

                    <main className="min-h-0 flex-1 overflow-y-auto rounded-[28px] bg-[#FFFFFF] p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainWrapper;
