
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cars from "./pages/Cars";
import TourPackages from "./pages/TourPackages";
import Prices from "./pages/Prices";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Navigation from "./components/Navigation";
import ScrollingBanner from "./components/ScrollingBanner";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Auth from "./pages/Auth";
import BookRide from "./pages/BookRide";
import MyRides from "./pages/MyRides";
import { AuthProvider } from "./hooks/useAuth";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <ScrollingBanner />
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/tour-packages" element={<TourPackages />} />
              <Route path="/prices" element={<Prices />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/admin_b_d_s" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/book" element={<BookRide />} />
              <Route path="/my-rides" element={<MyRides />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </HelmetProvider>
  </QueryClientProvider>
);

export default App;
