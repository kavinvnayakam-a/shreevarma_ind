
'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { useDoc, useFirebase } from '@/firebase';
import { doc, DocumentData } from 'firebase/firestore';
import { useMemo, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons/logo';

interface OrderItem {
  name: string;
  quantity: number;
  sellingPrice: number;
}

interface Order extends DocumentData {
  orderId: string;
  createdAt: { seconds: number, nanoseconds: number };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
  };
  customer: {
    name: string;
    email: string;
  };
}

export default function InvoicePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const orderId = params.id as string;
    const userId = searchParams.get('userId');

    const { firestore } = useFirebase();

    const orderRef = useMemo(() => {
        if (!firestore || !userId || !orderId) return null;
        return doc(firestore, `users/${userId}/orders`, orderId);
    }, [firestore, userId, orderId]);

    const { data: order, isLoading } = useDoc<Order>(orderRef);

    useEffect(() => {
        if (!isLoading && order) {
            const originalTitle = document.title;
            document.title = `invoice-${order.orderId}.pdf`;
            setTimeout(() => {
                window.print();
                document.title = originalTitle;
            }, 500);
        }
    }, [isLoading, order]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        );
    }
    
    if (!order) {
        return <div className="p-8 text-center">Order not found.</div>;
    }

    const orderDate = new Date(order.createdAt.seconds * 1000).toLocaleDateString();
    const subtotal = order.items.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);

    return (
        <>
        <style jsx global>{`
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                html, body {
                    height: 100%;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                @page {
                    size: A4 portrait;
                    margin: 0mm;
                }
                .invoice-container {
                    page-break-after: avoid;
                    box-shadow: none !important;
                    border: none !important;
                    margin: 0 !important;
                    padding: 10mm !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    height: 100%;
                }
                .print-bg-transparent {
                    background-color: transparent !important;
                }
                .no-print {
                    display: none;
                }
            }
        `}</style>
        <div className="bg-white text-gray-800 p-2 sm:p-4 print:bg-white">
            <div className="invoice-container max-w-3xl mx-auto border p-6">
                <header className="flex justify-between items-start mb-6 border-b pb-4">
                    <div>
                        <Logo className="h-10 w-auto mb-2" />
                        <p className="text-xs">No. 3/195, PRV Building, Parthasarathy Nagar,</p>
                        <p className="text-xs">Poonamallee Mount High Road, Manapakkam, Chennai - 600 125</p>
                        <p className="text-xs">mainadmin@shreevarma.org</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold uppercase text-primary">Invoice</h1>
                        <p className="text-sm">Order ID: #{order.orderId}</p>
                        <p className="text-sm">Date: {orderDate}</p>
                    </div>
                </header>

                <main>
                    <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
                        <div>
                            <h2 className="font-semibold text-gray-600 mb-1">Bill To:</h2>
                            <p className="font-bold">{order.customer.name}</p>
                            <address className="not-italic">
                                {order.shippingAddress.address}<br/>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br/>
                                {order.customer.email}
                            </address>
                        </div>
                        <div className="text-right">
                             <h2 className="font-semibold text-gray-600 mb-1">Ship To:</h2>
                             <p className="font-bold">{order.shippingAddress.name}</p>
                            <address className="not-italic">
                                {order.shippingAddress.address}<br/>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br/>
                                {order.shippingAddress.phone}
                            </address>
                        </div>
                    </div>
                    
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 uppercase text-xs print-bg-transparent">
                                    <th className="p-2 font-medium">Product</th>
                                    <th className="p-2 text-center font-medium">Qty</th>
                                    <th className="p-2 text-right font-medium">Unit Price</th>
                                    <th className="p-2 text-right font-medium">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2">{item.name}</td>
                                        <td className="p-2 text-center">{item.quantity}</td>
                                        <td className="p-2 text-right">₹{item.sellingPrice.toFixed(2)}</td>
                                        <td className="p-2 text-right">₹{(item.sellingPrice * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end mt-6">
                        <div className="w-full max-w-xs text-sm">
                            <div className="flex justify-between py-1">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Shipping</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="flex justify-between py-1 border-b text-xs">
                                <span>GST (inclusive at 18%)</span>
                                <span>₹{(subtotal - (subtotal / 1.18)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 font-bold text-base">
                                <span>Total</span>
                                <span>₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
                    <p>Note: Prices are inclusive of 18% GST.</p>
                    <p className="font-semibold mt-2">This is a computer-generated invoice and does not require a signature.</p>
                    <p className="mt-2">Thank you for your business!</p>
                </footer>
            </div>
        </div>
        </>
    );
}
