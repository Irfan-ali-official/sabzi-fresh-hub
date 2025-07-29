import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";
import { Product } from "./ProductCard";
import { useToast } from "@/hooks/use-toast";

export interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }: CartProps) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'cod'
  });
  const { toast } = useToast();

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive"
      });
      return;
    }
    setIsCheckout(true);
  };

  const handlePlaceOrder = () => {
    if (!customerInfo.phone) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number to place the order.",
        variant: "destructive"
      });
      return;
    }

    if (!customerInfo.address) {
      toast({
        title: "Address required",
        description: "Please enter your delivery address.",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally send the order to your backend
    toast({
      title: "Order placed successfully!",
      description: "We'll contact you soon to confirm your order via WhatsApp.",
    });

    // Reset cart and close
    setIsCheckout(false);
    setCustomerInfo({ phone: '', email: '', address: '', paymentMethod: 'cod' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            {isCheckout ? 'Checkout' : 'Shopping Cart'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="max-h-[calc(90vh-120px)] overflow-y-auto">
          {!isCheckout ? (
            // Cart View
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">Your cart is empty</p>
                  <Button onClick={onClose} className="mt-4 bg-fresh-green hover:bg-fresh-green-dark">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Rs. {item.price}/{item.unit}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Rs. {item.price * item.quantity}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-fresh-green">Rs. {total}</span>
                    </div>
                    <Button 
                      onClick={handleCheckout}
                      className="w-full mt-4 bg-fresh-green hover:bg-fresh-green-dark"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Checkout View
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+92 300 1234567"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete delivery address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="payment">Payment Method</Label>
                  <Select value={customerInfo.paymentMethod} onValueChange={(value) => setCustomerInfo({ ...customerInfo, paymentMethod: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                      <SelectItem value="easypaisa">Easypaisa</SelectItem>
                      <SelectItem value="jazzcash">JazzCash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs. {total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="text-fresh-green">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-fresh-green">Rs. {total}</span>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <Button variant="outline" onClick={() => setIsCheckout(false)} className="flex-1">
                    Back to Cart
                  </Button>
                  <Button onClick={handlePlaceOrder} className="flex-1 bg-fresh-green hover:bg-fresh-green-dark">
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;