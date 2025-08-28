import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Number',
      details: '+91 9790532574',
      action: 'Call Now'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Booking',
      details: '+91 9790532574',
      action: 'WhatsApp'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'bdscabnagercoil@gmail.com',
      action: 'Send Email'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: 'Nagercoil, Tamil Nadu',
      action: 'Get Directions'
    }
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Contact BDS Cabs - 24/7 Taxi Booking | Tamilnadu</title>
        <meta name="description" content="Contact BDS Cabs for immediate taxi booking in Tamilnadu. 24/7 customer support, emergency service available. Call now or book online!" />
        <meta name="keywords" content="contact bds cabs, taxi booking Tamilnadu, emergency taxi, 24/7 cab service, nagercoil taxi contact, cab booking phone" />
        <meta property="og:title" content="Contact BDS Cabs - 24/7 Taxi Booking" />
        <meta property="og:description" content="Get in touch with BDS Cabs for reliable taxi service in Tamilnadu. 24/7 support and emergency service available." />
        <link rel="canonical" href="https://bdscabs.com/contact" />
      </Helmet>
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact BDS Cabs
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Get in touch with us for the best cab service in Tamilnadu. 
              We're available 24/7 to serve you better.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover-lift shadow-custom-md">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                  <p className="text-muted-foreground mb-4">{info.details}</p>
                  <Button size="sm" className="bg-gradient-secondary hover:bg-secondary-dark">
                    {info.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="shadow-custom-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="mt-1"
                        placeholder="Tell us about your booking requirements..."
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary hover:bg-primary-dark text-lg py-6"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map & Office Hours */}
            <div className="space-y-6">
              {/* Google Maps Embed */}
              <Card className="shadow-custom-lg">
                <CardHeader>
                  <CardTitle>Our Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d251661.1456145!2d77.23785!3d8.1777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04f0c9c1a8a5f5%3A0x8c8b8c8b8c8b8c8b!2sNagercoil%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="BDS Cabs Location in Nagercoil"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card className="shadow-custom-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Service Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Taxi Service</span>
                      <span className="text-primary font-semibold">24/7 Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Customer Support</span>
                      <span>6:00 AM - 11:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Emergency Booking</span>
                      <span className="text-primary font-semibold">24/7 Available</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary font-medium">
                      🚗 For immediate booking, call or WhatsApp us at +91 9790532574
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Emergency Taxi?</h2>
          <p className="text-xl mb-8 opacity-90">
            Call us now for immediate pickup anywhere in Tamilnaadu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-secondary hover:bg-secondary-dark text-lg px-8 py-6"
            >
              <Phone className="mr-2 w-5 h-5" />
              Call +91 9790532574
            </Button>
            {/* <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              WhatsApp Booking
            </Button> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;