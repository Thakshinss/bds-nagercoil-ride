import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - BDS Cabs | Your Data Protection</title>
        <meta name="description" content="BDS Cabs privacy policy. Learn how we collect, use, and protect your personal information when using our taxi services in Tamil Nadu." />
      </Helmet>

      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to BDS Cabs. We are committed to protecting your personal information and your right to privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                taxi booking services across Tamil Nadu.
              </p>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Personal Information:</strong> Name, phone number, email address</li>
                <li><strong>Booking Details:</strong> Pickup and drop locations, travel dates and times</li>
                <li><strong>Vehicle Preferences:</strong> Type of vehicle requested</li>
                <li><strong>Communication Data:</strong> Messages and feedback you send us</li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the collected information for:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Processing and managing your taxi bookings</li>
                <li>Communicating with you about your rides and services</li>
                <li>Providing customer support</li>
                <li>Improving our services and user experience</li>
                <li>Sending promotional offers and updates (with your consent)</li>
                <li>Ensuring safety and security of our services</li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing</h2>
              <p className="text-muted-foreground mb-4">We may share your information with:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Drivers:</strong> To fulfill your booking requests</li>
                <li><strong>Service Providers:</strong> Third-party vendors who assist in our operations</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We do not sell your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal information. 
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
                to use commercially acceptable means to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent where applicable</li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                Our website may use cookies and similar tracking technologies to enhance your browsing experience. 
                You can set your browser to refuse cookies, but some features of our website may not function properly.
              </p>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none text-muted-foreground mt-4 space-y-2">
                <li><strong>Phone:</strong> +91 9790532574</li>
                <li><strong>Email:</strong> info@bdscabs.com</li>
                <li><strong>Location:</strong> Tamil Nadu, India</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
