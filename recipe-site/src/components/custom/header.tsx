import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import SignOutButton from './SignOutButton';
import { User } from 'firebase/auth';
interface HeaderProps {
  showLogins?: boolean;
}


async function saveRecipe(currentUrl: string, user: User) {
  console.log(currentUrl)
      console.log(user.uid)
      const response = await fetch(import.meta.env.VITE_API_ENDPOINT.concat('/recipes/save'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: currentUrl,
          userId: user.uid
        }),
      })
      if (response.ok) {
        const data = await response.json()
        console.log("SAVE")
        console.log(data)
        if (data['recipeId']) {
          return;
        } else {
          console.error('no recipe returned')
        }
      } else {
        console.error('Error fetching recipes', response.status)
      }
} 

export const Header: FC<HeaderProps> = ({ showLogins = true }) => {
  const navigate = useNavigate();

  const { user } = useAuth();

  return (
    <header className="bg-emerald-900 py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Button
          variant="ghost"
          className="text-white hover:bg-primary-700 hover:text-gray-300"
          onClick={() => navigate('/')}
        >
          <div className="text-2xl font-bold">Lean Green</div>
        </Button>
        {user && (
          <div>
            Hello {user.email}
          </div>
        )}
        
        {user && (
          <div className="ml-auto">
            <div className="flex gap-2">
              <input 
                type="text" 
                name="url"
                className="rounded px-2" 
                id="recipeUrl"
              />
              <Button 
                onClick={() => {
                  const url = (document.getElementById('recipeUrl') as HTMLInputElement).value;
                  saveRecipe(url, user);
                }}
              >
                Add Recipe
              </Button>
            </div>
          </div>
        )}
        

        <div className="space-x-2">
          {!user && showLogins ? (
            <>
              <Button
                variant="outline"
                className="bg-primary-200 hover:bg-primary-300 text-gray-800 hover:text-gray-900"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                className="bg-primary-600 hover:bg-primary-700 text-white"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </>
          ) : showLogins ? (
            <SignOutButton />
          ) : null}
        </div>
      </div>
    </header>
  );
};