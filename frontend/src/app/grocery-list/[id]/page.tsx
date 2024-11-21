// Server Component
import { getGroceryList } from '@/actions/groceryList';
import { GroceryListClient } from '@/components/GroceryList/GroceryListClient';
import { dehydrate, QueryClient, HydrationBoundary } from '@tanstack/react-query';
import { getBaseUrl } from '@/utils/api';

export default async function GroceryListPage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ['groceryList', parseInt(params.id)],
    queryFn: () => fetch(`${getBaseUrl()}/grocerylist/${params.id}`).then(res => res.json())
  });

  const dehydratedState = dehydrate(queryClient);
  
  return (
    <HydrationBoundary state={dehydratedState}>
      <GroceryListClient listId={parseInt(params.id)} />
    </HydrationBoundary>
  );
}
