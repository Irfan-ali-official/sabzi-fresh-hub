import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: 'fruits' | 'vegetables';
  inStock: boolean;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-fresh-green/10 hover:border-fresh-green/30">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm font-medium">
                Out of Stock
              </Badge>
            </div>
          )}
          {product.inStock && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-fresh-green text-white">
                Fresh
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-fresh-green transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-fresh-green">
                Rs. {product.price}
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                /{product.unit}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className="w-full bg-fresh-green hover:bg-fresh-green-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;