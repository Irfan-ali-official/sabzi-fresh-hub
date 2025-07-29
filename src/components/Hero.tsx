import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

interface HeroProps {
  onShopNowClick: () => void;
}

const Hero = ({ onShopNowClick }: HeroProps) => {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-fresh-green-dark/80 to-fresh-green/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Fresh <span className="text-fresh-orange">Fruits</span> & 
            <br />
            <span className="text-fresh-bg">Vegetables</span>
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-fresh-bg/90">
            Farm-fresh produce delivered to your doorstep. Quality guaranteed, freshness promised.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={onShopNowClick}
              size="lg"
              className="bg-fresh-orange hover:bg-fresh-orange/90 text-white font-semibold px-8 py-3 text-lg shadow-lg"
            >
              Shop Now
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-fresh-green-dark font-semibold px-8 py-3 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Features */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-8 text-white">
        <div className="text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
            <span className="text-2xl">🚚</span>
          </div>
          <p className="text-sm font-medium">Free Delivery</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-sm font-medium">Quality Assured</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
            <span className="text-2xl">📱</span>
          </div>
          <p className="text-sm font-medium">WhatsApp Support</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;