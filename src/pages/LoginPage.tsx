import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;