-- Create products table for admin management
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  category TEXT NOT NULL,
  image TEXT,
  description TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, price, unit, category, image, description, in_stock) VALUES
('Fresh Tomatoes', 45.00, 'kg', 'vegetables', '/placeholder.svg', 'Farm fresh tomatoes perfect for cooking', true),
('Organic Spinach', 30.00, 'bunch', 'vegetables', '/placeholder.svg', 'Fresh organic spinach leaves', true),
('Red Onions', 25.00, 'kg', 'vegetables', '/placeholder.svg', 'Quality red onions for daily cooking', true),
('Fresh Bananas', 60.00, 'dozen', 'fruits', '/placeholder.svg', 'Sweet and ripe bananas', true),
('Green Apples', 120.00, 'kg', 'fruits', '/placeholder.svg', 'Crisp and fresh green apples', true),
('Organic Carrots', 35.00, 'kg', 'vegetables', '/placeholder.svg', 'Fresh organic carrots', true);