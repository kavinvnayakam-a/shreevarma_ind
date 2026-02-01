
export default function TermsAndConditionsPage() {
    const Heading = ({ children }: { children: React.ReactNode }) => (
        <h2 className="text-2xl font-bold font-headline text-primary mt-8 mb-4">{children}</h2>
    );

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold font-headline text-primary mb-6 text-center">Terms and Conditions</h1>
                <div className="prose lg:prose-lg max-w-4xl mx-auto text-muted-foreground">
                    <p className="lead">Welcome to Shreevarma's Wellness. These terms and conditions outline the rules and regulations for the use of our website and services.</p>

                    <Heading>1. Introduction</Heading>
                    <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use Shreevarma's Wellness if you do not agree to all of the terms and conditions stated on this page.</p>

                    <Heading>2. Intellectual Property Rights</Heading>
                    <p>Other than the content you own, under these Terms, Shreevarma's Wellness and/or its licensors own all the intellectual property rights and materials contained in this website. You are granted a limited license only for purposes of viewing the material contained on this website.</p>

                    <Heading>3. Restrictions</Heading>
                    <p>You are specifically restricted from all of the following:</p>
                    <ul>
                        <li>Publishing any website material in any other media.</li>
                        <li>Selling, sublicensing, and/or otherwise commercializing any website material.</li>
                        <li>Publicly performing and/or showing any website material.</li>
                        <li>Using this website in any way that is or may be damaging to this website.</li>
                        <li>Using this website contrary to applicable laws and regulations, or in any way may cause harm to the website, or to any person or business entity.</li>
                    </ul>

                    <Heading>4. Your Content</Heading>
                    <p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Shreevarma's Wellness a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>

                    <Heading>5. No warranties</Heading>
                    <p>This website is provided “as is,” with all faults, and Shreevarma's Wellness expresses no representations or warranties, of any kind related to this website or the materials contained on this website. Also, nothing contained on this website shall be interpreted as advising you.</p>

                    <Heading>6. Limitation of liability</Heading>
                    <p>In no event shall Shreevarma's Wellness, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract. Shreevarma's Wellness, including its officers, directors, and employees shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.</p>

                    <Heading>7. Governing Law & Jurisdiction</Heading>
                    <p>These Terms will be governed by and interpreted in accordance with the laws of the State of Tamil Nadu, India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Chennai for the resolution of any disputes.</p>
                </div>
            </div>
        </div>
    );
}
