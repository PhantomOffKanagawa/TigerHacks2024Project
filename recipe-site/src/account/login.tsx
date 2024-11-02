import { FC, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Auth from 'components/custom/Auth';
import { Header } from 'components/custom/header';

const Login: FC<{ isSignUp?: boolean }> = ({ isSignUp = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Add your login logic here
      console.log('Login attempt with:', formData);
      // On success, redirect to home
      // navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header showLogins={false} />
      <div className="max-w-md mx-auto pt-20 px-6">
        <Card className="p-8">
          <Auth defaultSignUp={isSignUp} />
        </Card>
      </div>
    </main>
  );
};

export default Login;