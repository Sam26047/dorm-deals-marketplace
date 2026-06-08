
DROP POLICY IF EXISTS "Sellers can update bids on their products" ON public.bids;
CREATE POLICY "Sellers can update bids on their products"
ON public.bids FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = bids.product_id AND p.seller_id = auth.uid()));
