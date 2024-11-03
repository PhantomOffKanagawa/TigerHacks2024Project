import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/utils/firebase.utils';
import { LoadingSpinner } from '@/components/custom/loading';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    setTimeout(() => {
      navigate("/recipes");
    }, 100);
  }

  return <>{children}</>;
}