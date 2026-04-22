"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bike, ChevronLeft, ChevronRight, LogOut, Menu, SquareChartGantt, WalletCards, X} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo/logo.png"
import { RiHomeSmile2Line } from "react-icons/ri";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineCategory, MdTune } from "react-icons/md";
import { clearAllAuthCookies } from "@/utils/auth";
import { toast } from "sonner";



type AdminSidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
};



const menuItems = [
  { label: "Dashboard", icon: RiHomeSmile2Line, href: "/" },
  { label: "Orders", icon: IoCartOutline, href: "/orders" },
  { label: "Menu & Catalog", icon: SquareChartGantt, href: "/menu-&-catalog" },
  { label: "Banner Ads", icon: WalletCards, href: "/banner-ads" },
  { label: "Riders", icon: Bike, href: "/riders" },
  { label: "Category", icon: MdOutlineCategory, href: "/category" },
  { label: "Settings", icon: MdTune, href: "/settings" },
];

const SidebarContent = ({ collapsed, onToggleCollapse, onCloseMobile, onLogout}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
  onLogout: () => void;
}) => {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col px-3 py-4">
      <div className={cn("mb-5 flex items-center", collapsed ? "justify-center" : "justify-between")}>
        <div className={cn("flex items-center justify-center w-full", collapsed ? "justify-center" : "gap-2")}>
          <Image src={logo} alt="PBR Hut" width={63} height={32} className="object-cover" />
          {!collapsed && <span className="text-xl font-semibold text-heading">PBR Hut</span>}
        </div>

        {!collapsed && onCloseMobile ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </Button>
        ) : null}
      </div>

      <div className="mb-4 hidden lg:block">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          className="h-9 w-9 rounded-xl"
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>

      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                collapsed ? "justify-center" : "gap-2.5",
                isActive
                  ? "bg-heading text-white"
                  : "text-heading hover:bg-black/5"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center justify-between gap-2 pt-5">
        {!collapsed && (
          <div>
            <p className="text-sm text-title">Logout</p>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("text-[#E5523F] hover:bg-[#E5523F]/10 cursor-pointer", collapsed && "mx-auto")}
          aria-label="Logout"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </div>
  );
};

const AdminSidebar = ({ collapsed, onToggleCollapse }: AdminSidebarProps) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();

  const handleLogout = () => {
    clearAllAuthCookies();
    toast.success('Logged out successfully');
    router.push('/auth/sign-in');
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="fixed left-3 top-3 z-40 rounded-xl lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="size-5" />
      </Button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden overflow-hidden bg-[#F9F8F5] transition-[width] duration-300 lg:flex",
          collapsed ? "w-22" : "w-65"
        )}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} onLogout={handleLogout} />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-65 overflow-hidden bg-[#F3F3F3] transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          collapsed={false}
          onToggleCollapse={onToggleCollapse}
          onCloseMobile={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>
    </>
  );
};

export default AdminSidebar;
