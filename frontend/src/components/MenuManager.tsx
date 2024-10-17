import React, { useState, useEffect } from 'react';
import { apiHandler, Menu, Recipe } from '@/services/apiHandler';

export const MenuManager: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newMenuName, setNewMenuName] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  useEffect(() => {
    fetchMenus();
    fetchRecipes();
  }, []);

  const fetchMenus = async () => {
    const fetchedMenus = await apiHandler.getMenus();
    setMenus(fetchedMenus);
  };

  const fetchRecipes = async () => {
    const fetchedRecipes = await apiHandler.getRecipes();
    setRecipes(fetchedRecipes);
  };

  const handleCreateMenu = async () => {
    await apiHandler.createMenu({ name: newMenuName });
    setNewMenuName('');
    fetchMenus();
  };

  const handleMenuSelect = (menu: Menu) => {
    setSelectedMenu(menu);
  };

  const handleRecipeToggle = async (recipeId: number) => {
    if (!selectedMenu) return;

    const updatedRecipeIds = selectedMenu.recipeIds.includes(recipeId)
      ? selectedMenu.recipeIds.filter(id => id !== recipeId)
      : [...selectedMenu.recipeIds, recipeId];

    await apiHandler.updateMenu(selectedMenu.id, {
      name: selectedMenu.name,
      recipeIds: updatedRecipeIds,
    });

    fetchMenus();
  };

  return (
    <div>
      <h2>Menu Manager</h2>
      <div>
        <input
          type="text"
          value={newMenuName}
          onChange={(e) => setNewMenuName(e.target.value)}
          placeholder="New menu name"
        />
        <button onClick={handleCreateMenu}>Create Menu</button>
      </div>
      <div>
        <h3>Menus</h3>
        <ul>
          {menus.map(menu => (
            <li key={menu.id} onClick={() => handleMenuSelect(menu)}>
              {menu.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedMenu && (
        <div>
          <h3>Recipes for {selectedMenu.name}</h3>
          <ul>
            {recipes.map(recipe => (
              <li key={recipe.id}>
                <input
                  type="checkbox"
                  checked={selectedMenu.recipeIds.includes(recipe.id)}
                  onChange={() => handleRecipeToggle(recipe.id)}
                />
                {recipe.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
