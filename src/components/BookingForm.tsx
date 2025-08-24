import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, User, Phone, Car, MessageSquare, Clock } from 'lucide-react';
import emailjs from "@emailjs/browser";


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

const bookingSchema = z.object({
  pickup: z.string().min(1, 'Pickup location is required'),
  drop: z.string().min(1, 'Drop location is required'),
  name: z.string().min(1, 'Name is required'),
  mobile: z.string().min(10, 'Valid mobile number is required'),
  date: z.date().refine((date) => date !== undefined, {
    message: 'Date is required',
  }),
  time: z.string().min(1, 'Time is required'),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  tripType: z.string().min(1, 'Trip type is required'),
  message: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingForm = () => {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pickup: '',
      drop: '',
      name: '',
      mobile: '',
      time: '',
      vehicleType: '',
      tripType: '',
      message: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const onSubmit = (data: BookingFormData) => {
    console.log('Booking data:', data);
    toast({
      title: 'Booking Request Submitted',
      description: 'We will contact you shortly to confirm your booking.',
    });
    sendEmail(data)
    form.reset();
  };


  const sendEmail = async (formData: BookingFormData) => {
    console.log("Sending email with data:", formData);
  
    setIsSubmitting(true);
    setSubmitStatus('');
  
    try {
      // Replace these with your actual EmailJS credentials
      const serviceId = 'service_k778iw9';
      const templateId = 'template_kqu4po7';
      const publicKey = 'sZdi8W7DdkDXusuSB';
  
      // Initialize EmailJS
      emailjs.init(publicKey);
  
      const templateParams = {
        to_name: "Taxi Service",
        customer_name: formData.name,
        mobile_number: formData.mobile,
        taxi_type: formData.vehicleType,
        trip_type: formData.tripType,
        pickup_location: formData.pickup,
        drop_location: formData.drop,
        booking_date: formData.date ? formData.date.toDateString() : "",
        booking_time: formData.time,
        customer_message: formData.message || "",
      };
  
      console.log("Template params:", templateParams);
  
      await emailjs.send(serviceId, templateId, templateParams);
  
      setSubmitStatus('success');
      toast({
        title: "Booking Request Sent ✅",
        description: "We’ll contact you soon to confirm your ride.",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      setSubmitStatus('error');
      toast({
        title: "Error ❌",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const sendEmail = async (formData) => {
  //   console.log(formData,"formData")
  //   // Basic validation
  //   if (!formData.name || !formData.mobile || !formData.taxiType || !formData.members || 
  //       !formData.tripType || !formData.pickupLocation || !formData.dropLocation || 
  //       !formData.date || !formData.time) {
  //     setSubmitStatus('validation');
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setSubmitStatus('');

  //   try {
  //     // Replace these with your actual EmailJS credentials
  //     const serviceId = 'service_k778iw9';
  //     const templateId = 'template_kqu4po7';
  //     const publicKey = 'sZdi8W7DdkDXusuSB';

  //     // Load EmailJS dynamically
  //     if (!window.emailjs) {
  //       const script = document.createElement('script');
  //       script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
  //       document.head.appendChild(script);
        
  //       await new Promise((resolve) => {
  //         script.onload = resolve;
  //       });
        
  //       window.emailjs.init(publicKey);
  //     }

  //     const templateParams = {
  //       to_name: 'Taxi Service',
  //       from_name: formData.name,
  //       customer_name: formData.name,
  //       mobile_number: formData.mobile,
  //       taxi_type: formData.taxiType,
  //       number_of_members: formData.members,
  //       trip_type: formData.tripType,
  //       pickup_location: formData.pickupLocation,
  //       drop_location: formData.dropLocation,
  //       booking_date: formData.date,
  //       booking_time: formData.time,
  //       customer_message: formData.message,
  //       reply_to: formData.mobile
  //     };
  //     console.log(templateParams,"template params")

  //     await window.emailjs.send(serviceId, templateId, templateParams);
      
  //     setSubmitStatus('success');
  //     console.log(submitStatus,"ststus");
  //     // setFormData({
  //     //   name: '',
  //     //   mobile: '',
  //     //   taxiType: '',
  //     //   members: '',
  //     //   tripType: '',
  //     //   pickupLocation: '',
  //     //   dropLocation: '',
  //     //   date: '',
  //     //   time: '',
  //     //   message: ''
  //     // });
  //   } catch (error) {
  //     console.error('EmailJS Error:', error);
  //     setSubmitStatus('error');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-6 shadow-custom-lg max-w-4xl mx-auto mb-14">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Book Your <span className="text-secondary">Ride</span></h2>
        <p className="text-muted-foreground">Fill in the details to book your cab instantly</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup Location */}
            <FormField
              control={form.control}
              name="pickup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Pickup Location
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter pickup location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Drop Location */}
            <FormField
              control={form.control}
              name="drop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Drop Location
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter drop location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile Number */}
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="w-4 h-4" />
                    Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 bg-white text-black opacity-100 pointer-events-auto shadow-lg rounded-md"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vehicle Type */}
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Vehicle Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="p-3 bg-white text-black opacity-100 pointer-events-auto shadow-lg rounded-md">
                      <SelectItem value="Auto">Hatchback</SelectItem>
                      <SelectItem value="car">Sedan</SelectItem>
                      <SelectItem value="innova">Innova</SelectItem>
                      <SelectItem value="tempo traveller">Tempo Traveller</SelectItem>
                      <SelectItem value="coach van">Coach Van</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trip Type */}
            <FormField
              control={form.control}
              name="tripType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trip Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trip type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="one-way">One Way</SelectItem>
                      <SelectItem value="round-trip">Round Trip</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Additional Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Additional Message (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special requirements or additional information"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-gradient-primary hover:bg-primary-dark text-lg py-6">
            Book Cab Now
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;