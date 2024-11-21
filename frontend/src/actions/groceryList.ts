'use server'

export async function getGroceryList(id: number) {
  // Server-side data fetching
  const response = await fetch(`${process.env.API_URL}/grocerylist/${id}`);
  return response.json();
}

export async function toggleItem(listId: number, itemId: number, checked: boolean) {
  // Server-side mutation
  const response = await fetch(`${process.env.API_URL}/grocerylist/${listId}/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ checked })
  });
  return response.json();
} 