import { useEffect, useState } from 'react';
import { bannerContentService, BannerContent } from '@/services/bannerContentData';

const ScrollingBanner = () => {
  const [bannerContent, setBannerContent] = useState<BannerContent[]>([]);

  useEffect(() => {
    const fetchBannerContent = async () => {
      try {
        const content = await bannerContentService.getAll();
        setBannerContent(content);
      } catch (error) {
        console.error('Error fetching banner content:', error);
        // Fallback to default content
        setBannerContent([
          { id: '1', text: 'Best Cab Service in Nagercoil – Book Now', is_active: true, display_order: 1, created_at: '', updated_at: '' }
        ]);
      }
    };

    fetchBannerContent();
  }, []);

  return (
    <div className="text-secondary-foreground py-2 overflow-hidden">
      <div className="scroll-banner flex items-center space-x-12">
        {[...bannerContent, ...bannerContent].map((content, index) => (
          <span key={index} className="text-sm font-medium whitespace-nowrap">
            {content.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScrollingBanner;