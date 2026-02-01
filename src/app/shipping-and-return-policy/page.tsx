
export default function ShippingAndReturnPolicyPage() {
    const Heading = ({ children }: { children: React.ReactNode }) => (
        <h2 className="text-2xl font-bold font-headline text-primary mt-8 mb-4">{children}</h2>
    );

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold font-headline text-primary mb-6 text-center">Shipping & Return Policy</h1>
                <div className="prose lg:prose-lg max-w-4xl mx-auto text-muted-foreground">
                    
                    <Heading>Shipping Policy</Heading>
                    <p>We are committed to delivering your products in a timely and secure manner. All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>
                    
                    <p><strong>Shipping Rates & Delivery Estimates</strong></p>
                    <ul>
                        <li><strong>Standard Shipping:</strong> We offer free standard shipping on all orders above ₹999. For orders below this amount, a flat shipping fee will be applied.</li>
                        <li><strong>Delivery Time:</strong> Standard delivery usually takes between 5-7 business days. Delivery times may vary depending on your location.</li>
                    </ul>

                    <p><strong>Shipment Confirmation & Order Tracking</strong></p>
                    <p>You will receive a shipment confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>

                    <Heading>Return & Exchange Policy</Heading>
                    <p>All sales are final. We do not offer returns or exchanges on any products.</p>
                    <p>An exception can be made only if you receive a product that is damaged or defective. If you receive a damaged or defective item, please contact our customer support team at <a href="mailto:mainadmin@shreevarma.org">mainadmin@shreevarma.org</a> within 48 hours of delivery. You must include your order number and photographic evidence of the damage or defect.</p>
                    <p>If the claim is approved, we will provide a replacement for the damaged or defective product. Refunds are not offered.</p>
                    
                    <Heading>Contact Us</Heading>
                    <p>If you have any questions about our Shipping & Return Policy, please contact us at <a href="mailto:mainadmin@shreevarma.org">mainadmin@shreevarma.org</a>.</p>
                </div>
            </div>
        </div>
    );
}
