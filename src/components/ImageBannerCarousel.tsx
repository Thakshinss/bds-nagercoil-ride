import { useEffect, useRef, useState } from 'react';
import { bannerImageService, BannerImage } from '@/services/bannerImageData';

const ImageBannerCarousel = () => {
  const [banners, setBanners] = useState<BannerImage[]>([]);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    bannerImageService
      .getActive()
      .then(setBanners)
      .catch((error) => console.error('Error fetching banner images:', error));
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || banners.length <= 1) return;
    const endX = e.changedTouches[0].screenX;
    const diff = touchStartX.current - endX;
    const threshold = 40;
    if (diff > threshold) {
      setIndex((prev) => (prev + 1) % banners.length);
    } else if (diff < -threshold) {
      setIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
    touchStartX.current = null;
  };

  if (banners.length === 0) return null;

  return (
    <div className="w-full flex justify-center py-2">
      <div className="w-full md:w-5/6 lg:w-4/5 px-4">
        <div
          className="relative overflow-hidden rounded-xl shadow-custom-md"
          role="region"
          aria-label="Promotional banners"
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {banners.map((banner) => {
              const image = (
                <img
                  src={banner.image_url}
                  alt={banner.alt_text}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
              );
              return (
                <div key={banner.id} className="min-w-full shrink-0">
                  {banner.link_url ? (
                    <a href={banner.link_url} aria-label={banner.alt_text}>
                      {image}
                    </a>
                  ) : (
                    image
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {banners.length > 1 && (
          <div className="mt-2 flex justify-center gap-1.5">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                onClick={() => setIndex(i)}
                aria-label={`Show banner ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-4 bg-secondary' : 'w-1.5 bg-muted-foreground/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageBannerCarousel;
