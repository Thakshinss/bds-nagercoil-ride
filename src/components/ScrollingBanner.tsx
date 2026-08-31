import { useEffect, useState } from 'react';
import { bannerContentService, BannerContent } from '@/services/bannerContentData';

const ScrollingBanner = () => {
  const [bannerContent, setBannerContent] = useState<BannerContent[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchBannerContent = async () => {
      try {
        const content = await bannerContentService.getAll();
        setBannerContent(content);
      } catch (error) {
        console.error('Error fetching banner content:', error);
        setBannerContent([
          { id: '1', text: 'Best Cab Service in Nagercoil – Book Now', is_active: true, display_order: 1, created_at: '', updated_at: '' }
        ]);
      }
    };

    fetchBannerContent();
  }, []);

  useEffect(() => {
    if (bannerContent.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % bannerContent.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [bannerContent.length]);

  if (bannerContent.length === 0) return null;

  return (
    <div className="w-full flex justify-center py-2">
      <div className="w-full sm:w-3/4 md:w-1/2 px-4">
        <div
          className="relative overflow-hidden rounded-full bg-gradient-secondary text-secondary-foreground shadow-custom-sm"
          role="region"
          aria-label="Announcements"
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {bannerContent.map((content) => (
              <p
                key={content.id}
                className="min-w-full shrink-0 px-4 py-2 text-center text-xs sm:text-sm font-medium truncate"
              >
                {content.text}
              </p>
            ))}
          </div>
        </div>

        {bannerContent.length > 1 && (
          <div className="mt-1.5 flex justify-center gap-1.5">
            {bannerContent.map((content, i) => (
              <button
                key={content.id}
                onClick={() => setIndex(i)}
                aria-label={`Show announcement ${i + 1}`}
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

export default ScrollingBanner;
