
export default function PrivacyPolicyPage() {
    const Heading = ({ children }: { children: React.ReactNode }) => (
        <h2 className="text-2xl font-bold font-headline text-primary mt-8 mb-4">{children}</h2>
    );

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold font-headline text-primary mb-6 text-center">Privacy Policy</h1>
                <div className="prose lg:prose-lg max-w-4xl mx-auto text-muted-foreground">
                    <p className="lead">Your privacy is important to us. It is Shreevarma's Wellness's policy to respect your privacy regarding any information we may collect from you across our website.</p>

                    <Heading>1. Information We Collect</Heading>
                    <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
                    <p>Information we collect may include:</p>
                    <ul>
                        <li><strong>Personal Identification Information:</strong> Name, email address, phone number, shipping address.</li>
                        <li><strong>Payment Information:</strong> While we use a secure third-party payment gateway (Cashfree), we may store transaction IDs and order details, but we do not store your full credit card number on our servers.</li>
                        <li><strong>Technical Data:</strong> IP address, browser type, and version, time zone setting and location, operating system and platform, and other technology on the devices you use to access this website.</li>
                    </ul>

                    <Heading>2. How We Use Your Information</Heading>
                    <p>We use the information we collect in various ways, including to:</p>
                    <ul>
                        <li>Provide, operate, and maintain our website</li>
                        <li>Improve, personalize, and expand our website</li>
                        <li>Understand and analyze how you use our website</li>
                        <li>Process your transactions and manage your orders</li>
                        <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                        <li>Send you emails and notifications</li>
                        <li>Find and prevent fraud</li>
                    </ul>

                    <Heading>3. Security of Your Data</Heading>
                    <p>The security of your personal information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>
                    
                    <Heading>4. Cookies</Heading>
                    <p>We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits, and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>

                    <Heading>5. Third-Party Services</Heading>
                    <p>We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services, or to assist us in analyzing how our Service is used. These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>

                    <Heading>6. Your Rights</Heading>
                    <p>You have the right to access, update, or delete the information we have on you. Whenever made possible, you can access, update, or request deletion of your Personal Information directly within your account settings section. If you are unable to perform these actions yourself, please contact us to assist you.</p>

                    <Heading>7. Changes to This Privacy Policy</Heading>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

                    <Heading>8. Contact Us</Heading>
                    <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:mainadmin@shreevarma.org">mainadmin@shreevarma.org</a>.</p>
                </div>
            </div>
        </div>
    );
}
