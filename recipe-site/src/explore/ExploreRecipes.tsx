import { FC, useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router-dom'

import { useRecipes } from '@/hook/useRecipes'
import { LoadingSpinner } from '@/components/custom/loading'
import { ErrorDisplay } from '@/components/custom/error'
import { Header } from '@/components/custom/header'
import { ExtensionBanner } from 'components/custom/ExtensionBanner'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from 'components/ui/button'

const ExploreRecipes: FC = () => {
  const { user } = useAuth()

  const recipeData = useRecipes(user?.uid ?? '', undefined, true)
  const { recipes } = recipeData
  const { loading, error, refreshRecipes, loadNextPage } = recipeData
  console.log({ recipes })

  // recipes = recipes.filter((recipe) => recipe.hasOwnProperty('carbonData'))

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorDisplay message={error.message} onRetry={refreshRecipes} />
  }

  return (
    <div className='h-full w-full bg-background'>
      <ExtensionBanner dismissable={true} />
      <Header />
      <main className='bg-emerald-800/10 py-12 px-6'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-4xl text-center font-bold text-white mb-12 mx-auto'>
          Explore Recipes
        </h1>
        {recipes.length == 0 ? (
          <div className='text-white text-center text-2xl'>
            No recipes found
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recipes.map((recipe) => (
              <Card
                key={recipe.canonical_url}
                className='bg-card p-6 rounded-lg flex flex-col'
              >
                <img
                  className='bg-gray-700/10 w-full h-[250px] rounded-lg object-cover'
                  src={recipe.image}
                  alt={recipe.title}
                />
                <div className='space-y-4 py-2 flex-1 flex flex-col'>
                  <Link to={`/recipes/${recipe.id}`}>
                    <h2 className='text-xl font-semibold text-white underline'>
                      {recipe.title}
                    </h2>
                  </Link>
                  <p className='text-gray-400 flex-grow'>
                    {recipe.description}
                  </p>
                  <div className='flex justify-between items-center mt-auto'>
                    {recipe.averageCarbonScore && (
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm text-gray-400'>
                          Carbon Score
                        </span>
                        <span className={`text-sm ${
                              recipe.averageCarbonScore >= 0.7
                                ? "text-green-400"
                                : recipe.averageCarbonScore >= 0.3
                                  ? "text-yellow-400"
                                  : "text-red-400"
                            }`}>
                          {Math.round(recipe.averageCarbonScore * 100)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
        {recipes.length % 9 === 0 && (
          <Button onClick={loadNextPage} disabled={loading} className='w-full'>
            Load more
          </Button>
      )}
        <div className='h-20' />
      </main>
    </div>
  )
}

export default ExploreRecipes
