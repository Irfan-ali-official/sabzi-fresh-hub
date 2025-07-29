import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import { Product } from "@/components/ProductCard";
import Cart from "@/components/Cart";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedProducts = data?.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        unit: product.unit,
        image: product.image || '/placeholder.svg',
        category: product.category as "fruits" | "vegetables",
        inStock: product.in_stock,
        description: product.description || undefined
      })) || [];
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setShowProducts(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const productsByCategory = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="min-h-screen">
        <Hero onShopNowClick={() => setShowProducts(true)} />
        
        <CategorySection onCategoryClick={handleCategoryClick} />
        
        {showProducts && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">
                {selectedCategory === "all" ? "All Products" : 
                 selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </h2>
              
              {isLoading ? (
                <div className="text-center">Loading products...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-muted-foreground">{product.description}</p>
                      <p className="font-bold">₹{product.price}/{product.unit}</p>
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full mt-2 bg-fresh-green text-white py-2 rounded hover:bg-fresh-green-dark"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {!isLoading && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No products found.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(id, quantity) => {
          if (quantity === 0) {
            setCartItems(prev => prev.filter(item => item.id !== id));
          } else {
            setCartItems(prev => prev.map(item => 
              item.id === id ? { ...item, quantity } : item
            ));
          }
        }}
        onRemoveItem={(id) => setCartItems(prev => prev.filter(item => item.id !== id))}
      />

      <WhatsAppButton />
    </div>
  );
};

export default Index;