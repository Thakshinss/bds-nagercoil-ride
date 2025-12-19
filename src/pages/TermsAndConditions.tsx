import { Helmet } from 'react-helmet-async';

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - BDS Cabs | Service Terms</title>
        <meta name="description" content="BDS Cabs terms and conditions. Read our service terms, booking policies, cancellation rules, and user responsibilities for taxi services in Tamil Nadu." />
      </Helmet>

      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By using BDS Cabs services, you agree to be bound by these Terms and Conditions. If you do not agree 
                to these terms, please do not use our services. These terms apply to all users of our taxi booking 
                services across Tamil Nadu.
              </p>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Service Description</h2>
              <p className="text-muted-foreground mb-4">BDS Cabs provides:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Local taxi services within Tamil Nadu</li>
                <li>Outstation cab bookings</li>
                <li>Airport transfer services</li>
                <li>Corporate transportation solutions</li>
                <li>Tour packages and sightseeing services</li>
                <li>24/7 emergency ride services</li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Booking and Reservations</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Bookings can be made via our website, phone, or WhatsApp</li>
                <li>All bookings are subject to vehicle availability</li>
                <li>Accurate pickup location, destination, and contact information must be provided</li>
                <li>Confirmation will be sent via SMS or WhatsApp</li>
                <li>Advance booking is recommended for outstation and airport transfers</li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Pricing and Payment</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Fares are calculated based on distance, vehicle type, and trip type</li>
                <li>Toll charges, parking fees, and state permits are additional</li>
                <li>Night charges may apply for trips between 10 PM and 6 AM</li>
                <li>Payment can be made in cash or through accepted digital methods</li>
                <li>Prices are subject to change without prior notice</li>
                <li>Final fare will be communicated before confirming the booking</li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cancellation Policy</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Free cancellation up to 2 hours before scheduled pickup for local trips</li>
                <li>Free cancellation up to 24 hours before scheduled pickup for outstation trips</li>
                <li>Cancellation charges may apply for late cancellations</li>
                <li>No-show will result in full fare charges for outstation bookings</li>
                <li>BDS Cabs reserves the right to cancel bookings due to unforeseen circumstances</li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Passenger Responsibilities</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide accurate booking information</li>
                <li>Be ready at the pickup location on time</li>
                <li>Treat drivers and vehicles with respect</li>
                <li>Wear seatbelts during the journey</li>
                <li>No smoking, alcohol consumption, or illegal activities in the vehicle</li>
                <li>Report any issues or concerns immediately</li>
                <li>Passengers are responsible for their belongings</li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Our Responsibilities</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide safe and well-maintained vehicles</li>
                <li>Assign experienced and licensed drivers</li>
                <li>Ensure timely pickup and drop services</li>
                <li>Maintain transparent pricing</li>
                <li>Address customer complaints promptly</li>
                <li>Comply with all applicable traffic and transport regulations</li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Liability Limitations</h2>
              <p className="text-muted-foreground mb-4">BDS Cabs shall not be liable for:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Delays caused by traffic, weather, or road conditions</li>
                <li>Loss or damage to personal belongings left in vehicles</li>
                <li>Indirect or consequential damages arising from service use</li>
                <li>Acts of God, natural disasters, or force majeure events</li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Luggage Policy</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Standard luggage allowance depends on vehicle type</li>
                <li>Excess luggage may require a larger vehicle at additional cost</li>
                <li>Hazardous materials and illegal items are strictly prohibited</li>
                <li>Special arrangements needed for pets or bulky items</li>
              </ul>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Dispute Resolution</h2>
              <p className="text-muted-foreground">
                Any disputes arising from our services shall first be addressed through our customer support. 
                If unresolved, disputes shall be subject to the jurisdiction of courts in Tamil Nadu, India.
              </p>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Modifications</h2>
              <p className="text-muted-foreground">
                BDS Cabs reserves the right to modify these Terms and Conditions at any time. Changes will be 
                effective immediately upon posting on our website. Continued use of our services constitutes 
                acceptance of modified terms.
              </p>
            </section>

            <section className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms and Conditions, please contact us:
              </p>
              <ul className="list-none text-muted-foreground mt-4 space-y-2">
                <li><strong>Phone:</strong> +91 9790532574</li>
                <li><strong>Email:</strong> info@bdscabs.com</li>
                <li><strong>Location:</strong> Tamil Nadu, India</li>
                <li><strong>Hours:</strong> 24/7 Customer Support</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
