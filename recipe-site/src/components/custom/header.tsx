import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import SignOutButton from './SignOutButton';

interface HeaderProps {
  showLogins?: boolean;
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
          Home
        </Button>
        
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