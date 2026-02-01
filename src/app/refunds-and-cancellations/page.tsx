
export default function RefundsAndCancellationsPage() {
    const Heading = ({ children }: { children: React.ReactNode }) => (
        <h2 className="text-2xl font-bold font-headline text-primary mt-8 mb-4">{children}</h2>
    );

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold font-headline text-primary mb-6 text-center">Refunds & Cancellations Policy</h1>
                <div className="prose lg:prose-lg max-w-4xl mx-auto text-muted-foreground">
                    <p className="lead">This policy outlines the terms for refunds and cancellations for products and services purchased from Shreevarma's Wellness.</p>

                    <Heading>1. Consultation Cancellations</Heading>
                    <p>You can cancel or reschedule your consultation appointment up to 24 hours before the scheduled time to receive a full refund or to re-book without any additional charge. Cancellations made within 24 hours of the appointment time are non-refundable.</p>
                    <p>To cancel or reschedule, please contact our support team at <a href="mailto:mainadmin@shreevarma.org">mainadmin@shreevarma.org</a> or call us at +91 9500946631.</p>
                    
                    <Heading>2. Product Returns, Exchanges & Refunds</Heading>
                    <p>Please note that all sales are final. We do not accept returns or exchanges for any products sold.</p>
                    <p>The only exception is for products that are delivered in a damaged or defective state. If you receive a damaged item, please contact our customer service team at <a href="mailto:mainadmin@shreevarma.org">mainadmin@shreevarma.org</a> within 48 hours of receiving your order. You must include your order number and clear photos of the damaged product.</p>
                    <p>If your claim is verified, we will arrange for a replacement of the same product. We do not offer refunds; we only offer replacements for valid claims of damaged or defective goods.</p>

                    <Heading>3. How to Report a Damaged Product</Heading>
                    <p>To report a damaged product, please email us at <a href="mailto:mainadmin@shreevarma.org">mainadmin@shreevarma.org</a> with your order number and photographic evidence. Our team will review your claim and guide you through the next steps if applicable.</p>
                </div>
            </div>
        </div>
    );
}
