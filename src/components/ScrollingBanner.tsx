const ScrollingBanner = () => {
  const offers = [
    "Flat 20% Off on Airport Rides",
    "Best Cab Service in Nagercoil – Book Now", 
    "24/7 Taxi Service Available – BDS Cabs",
    "Safe & Reliable Transportation",
    "Professional Drivers, Clean Vehicles"
  ];

  return (
    <div className="bg-gradient-secondary text-secondary-foreground py-2 overflow-hidden">
      <div className="scroll-banner flex items-center space-x-12">
        {[...offers, ...offers].map((offer, index) => (
          <span key={index} className="text-sm font-medium whitespace-nowrap">
            {offer}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScrollingBanner;