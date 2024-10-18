import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchBar.module.scss';
import { apiHandler, Recipe } from '@/services/apiHandler';
import debounce from 'lodash/debounce';

export const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length > 1) {  // Changed from 2 to 1 to search on shorter terms
        setIsLoading(true);
        try {
          const results = await apiHandler.searchRecipes(term);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching recipes:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleRecipeClick = (recipeId: number) => {
    router.push(`/receipe/${recipeId}`);
  };

  return (
    <div className={styles.searchBarContainer}>
      <form onSubmit={handleSubmit} className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={handleInputChange}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
      {isLoading && <div className={styles.loading}>Loading...</div>}
      {!isLoading && searchResults.length > 0 && (
        <ul className={styles.searchResults}>
          {searchResults.map((recipe) => (
            <li key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}>
              {recipe.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
