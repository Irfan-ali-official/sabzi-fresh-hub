import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CategorySectionProps {
  onCategoryClick: (category: string) => void;
}

const CategorySection = ({ onCategoryClick }: CategorySectionProps) => {
  const categories = [
    {
      id: 'fruits',
      name: 'Fresh Fruits',
      description: 'Juicy, sweet, and packed with vitamins',
      emoji: '🍎',
      gradient: 'from-red-400 to-orange-400'
    },
    {
      id: 'vegetables',
      name: 'Fresh Vegetables',
      description: 'Crisp, green, and full of nutrients',
      emoji: '🥬',
      gradient: 'from-fresh-green to-fresh-green-light'
    }
  ];

  return (
    <section className="py-16 bg-fresh-bg/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our wide selection of farm-fresh produce, carefully selected for quality and freshness
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 overflow-hidden"
              onClick={() => onCategoryClick(category.id)}
            >
              <CardContent className="p-0">
                <div className={`h-48 bg-gradient-to-br ${category.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl filter drop-shadow-lg">
                      {category.emoji}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors border-fresh-green/20 hover:border-fresh-green"
                  >
                    Browse {category.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;