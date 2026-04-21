"use client";

import React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type OrderDetailsModalProps = {
  order: {
    id: string;
    customer: string;
    phone: string;
    fulfillment: "delivery" | "pickup";
    payment: "paid" | "cod";
    address: string;
    items: Array<{ name: string; qty: string; price: string }>;
    subtotal: string;
    deliveryFee: string;
    tax: string;
    total: string;
    note: string;
  };
  onClose: () => void;
};

const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-[2px]">
      <div className="relative w-full max-w-115 rounded-xl bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-black/60 hover:bg-black/5 hover:text-black"
          aria-label="Close order details"
        >
          <X className="size-5" />
        </button>

        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-title">Order {order.id}</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-description">Customer</p>
              <p className="text-sm text-title">{order.customer}</p>
            </div>
            <div>
              <p className="text-sm text-description">Phone</p>
              <p className="text-sm text-title">{order.phone}</p>
            </div>
            <div>
              <p className="text-sm text-description">Fulfillment</p>
              <Badge variant="pending">{order.fulfillment}</Badge>
            </div>
            <div>
              <p className="text-sm text-description">Payment</p>
              <Badge variant="delivered">{order.payment}</Badge>
            </div>
          </div>

          <div>
            <p className="text-sm text-description">Delivery Address</p>
            <p className="text-sm text-title">{order.address}</p>
          </div>

          <div>
            <p className="mb-2 text-sm text-description">Items</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.name} className="flex items-start justify-between gap-3 text-sm">
                  <span className="text-title">{item.name}</span>
                  <span className="font-medium text-title">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-black/8 pt-3 text-sm">
            <div className="flex items-center justify-between py-1 text-black/55">
              <span>Subtotal</span>
              <span>{order.subtotal}</span>
            </div>
            <div className="flex items-center justify-between py-1 text-black/55">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee}</span>
            </div>
            <div className="flex items-center justify-between py-1 text-black/55">
              <span>Tax</span>
              <span>{order.tax}</span>
            </div>
            <div className="flex items-center justify-between py-1 font-semibold text-title">
              <span>Total</span>
              <span>{order.total}</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-description">Customer note</p>
            <textarea
              value={order.note}
              readOnly
              className="min-h-28 w-full rounded-2xl border border-black/10 bg-[#FAFAFA] p-4 text-sm text-title outline-none"
              placeholder="E.g., No onions, extra napkins..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
