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
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const productsByCategory = products.reduce((acc, product) => {
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
        <Hero onShopNowClick={() => {}} />
        
        {isLoading ? (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Loading products...</div>
          </div>
        ) : (
          Object.entries(productsByCategory).map(([category, categoryProducts]) => (
            <CategorySection
              key={category}
              products={categoryProducts}
              onAddToCart={addToCart}
            />
          ))
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