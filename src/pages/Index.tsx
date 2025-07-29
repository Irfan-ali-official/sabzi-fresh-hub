import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import ProductCard, { Product } from "@/components/ProductCard";
import Cart, { CartItem } from "@/components/Cart";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { sampleProducts } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showProducts, setShowProducts] = useState(false);
  const { toast } = useToast();

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleShopNowClick = () => {
    setShowProducts(true);
    // Scroll to products section
    setTimeout(() => {
      document.getElementById('products-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setShowProducts(true);
    setTimeout(() => {
      document.getElementById('products-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main>
        {/* Hero Section */}
        <Hero onShopNowClick={handleShopNowClick} />

        {/* Category Section */}
        <CategorySection onCategoryClick={handleCategoryClick} />

        {/* Products Section */}
        {showProducts && (
          <section id="products-section" className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {selectedCategory === "all" ? "All Products" : 
                     selectedCategory === "fruits" ? "Fresh Fruits" : "Fresh Vegetables"}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredProducts.length} products found
                  </p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("all")}
                    className={selectedCategory === "all" ? "bg-fresh-green hover:bg-fresh-green-dark" : ""}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedCategory === "fruits" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("fruits")}
                    className={selectedCategory === "fruits" ? "bg-fresh-green hover:bg-fresh-green-dark" : ""}
                  >
                    Fruits
                  </Button>
                  <Button
                    variant={selectedCategory === "vegetables" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("vegetables")}
                    className={selectedCategory === "vegetables" ? "bg-fresh-green hover:bg-fresh-green-dark" : ""}
                  >
                    Vegetables
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No products found matching your search.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-16 bg-fresh-bg/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Choose SABZI MART?
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-fresh-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Low Delivery Fee</h3>
                <p className="text-muted-foreground">Minimal delivery charges for all orders</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-fresh-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Farm Fresh</h3>
                <p className="text-muted-foreground">Directly sourced from local farms</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-fresh-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
                <p className="text-muted-foreground">100% satisfaction guaranteed or money back</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-fresh-green-dark text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">SABZI MART</h3>
          <p className="text-fresh-bg/80 mb-4">Fresh fruits & vegetables delivered to your doorstep</p>
          <p className="text-sm text-fresh-bg/60">
            © 2024 SABZI MART. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Cart Component */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default Index;
