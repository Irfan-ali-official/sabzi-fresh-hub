-- First ensure the admin user exists in profiles table
INSERT INTO public.profiles (user_id, full_name, email, role)
SELECT 
  id, 
  COALESCE(raw_user_meta_data ->> 'full_name', 'Admin User'), 
  'irfan.ali.official3@gmail.com',
  'admin'
FROM auth.users 
WHERE email = 'irfan.ali.official3@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  role = 'admin',
  email = 'irfan.ali.official3@gmail.com',
  updated_at = now();

-- Add some sample products to ensure dynamic data (without the ON CONFLICT that was causing the error)
INSERT INTO public.products (name, price, unit, category, image, description, in_stock) 
SELECT * FROM (VALUES
  ('Fresh Tomatoes', 60, 'kg', 'vegetables', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop', 'Fresh red tomatoes, perfect for cooking', true),
  ('Bananas', 80, 'dozen', 'fruits', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop', 'Ripe yellow bananas, rich in potassium', true),
  ('Fresh Onions', 40, 'kg', 'vegetables', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop', 'Fresh white onions, kitchen essential', true),
  ('Apples', 150, 'kg', 'fruits', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop', 'Crisp and sweet red apples, perfect for snacking', true),
  ('Potatoes', 35, 'kg', 'vegetables', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop', 'Fresh potatoes, versatile and nutritious', true)
) AS v(name, price, unit, category, image, description, in_stock)
WHERE NOT EXISTS (
  SELECT 1 FROM public.products p 
  WHERE p.name = v.name AND p.category = v.category
);