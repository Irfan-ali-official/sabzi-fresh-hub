-- Create storage bucket for website images
INSERT INTO storage.buckets (id, name, public) VALUES ('website-images', 'website-images', true);

-- Create policies for the website-images bucket
CREATE POLICY "Website images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'website-images');

CREATE POLICY "Anyone can upload website images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'website-images');

CREATE POLICY "Anyone can update website images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'website-images');

CREATE POLICY "Anyone can delete website images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'website-images');