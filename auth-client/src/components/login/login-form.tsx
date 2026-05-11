import { ElementRef, FormEvent, useRef } from 'react';
import { Link } from 'react-router';

import { AuthRoute } from '../../utils/api';
import LoginFormHeader from './form-header';

type Props = {
  authRoute: AuthRoute;
  loading: boolean;
  error: Error | null;
  login: (credentials: { email: string; password: string }) => void;
};

const LoginForm = ({ authRoute, loading, error, login }: Props) => {
  const formRef = useRef<ElementRef<'form'> | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    const data = new FormData(formRef.current);
    const email = data.get('email') as string;
    const password = data.get('pwd') as string;

    login({ email, password });
  };

  return (
    <div className="w-[40ch] space-y-8">
      <LoginFormHeader authRoute={authRoute} />

      <form ref={formRef} onSubmit={handleSubmit} className="grid w-full gap-4">
        <div className="control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Your email here"
            disabled={loading}
          />
        </div>

        <div className="control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="pwd"
            id="password"
            placeholder="Your password here"
            disabled={loading}
          />
        </div>

        <p className="text-end">
          Not a member?{' '}
          <Link to={`/${authRoute}/signup`} className="underline">
            Create an account
          </Link>
        </p>

        <button disabled={loading} type="submit">
          Log in
        </button>

        {error && <p className="text-sm font-medium text-red-600">{error.message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
