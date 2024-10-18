'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiHandler, Recipe } from '@/services/apiHandler';
import styles from './page.module.scss';
import Link from 'next/link';

export default function SearchResults() {
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      try {
        setLoading(true);
        const searchResults = await apiHandler.searchRecipes(query);
        setResults(searchResults);
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.searchResults}>
      <h1>Search Results for "{query}"</h1>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className={styles.resultsList}>
          {results.map((recipe) => (
            <li key={recipe.id} className={styles.resultItem}>
              <Link href={`/recipe/${recipe.id}`}>
                <h2>{recipe.name}</h2>
                <p>{recipe.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
