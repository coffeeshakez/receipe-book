// Server Component
import { GroceryListContainer } from '@/components/GroceryList/GroceryListContainer';
import getQueryClient from '@/utils/getQueryClient';
import { apiHandler } from '@/services/apiHandler';

export default async function GroceryListPage({ params }: { params: { id: string } }) {
  const queryClient = getQueryClient();
  const listId = parseInt(params.id);
  
  
  await queryClient.prefetchQuery({
    queryKey: ['groceryList', listId],
    queryFn: () => apiHandler.fetchGroceryList(listId)
  });

  return <GroceryListContainer listId={listId} />;
}
