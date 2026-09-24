-- Grant SELECT permission to authenticated users for orders and order_items
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;
