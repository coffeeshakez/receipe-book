// Server Component
import { GroceryListContainer } from '@/components/GroceryList/GroceryListContainer';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/utils/getQueryClient';
import { apiHandler } from '@/services/apiHandler';

export default async function GroceryListPage({ params }: { params: { id: string } }) {
  const queryClient = getQueryClient();
  const listId = parseInt(params.id);
  
  await queryClient.prefetchQuery({
    queryKey: ['groceryList', listId],
    queryFn: () => apiHandler.getGroceryList(listId),
    staleTime: 1000 * 60 * 5,
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroceryListContainer listId={listId} />
    </HydrationBoundary>
  );
}
