import { ElementRef, FormEvent, useRef } from 'react';
import { Link } from 'react-router';

import { useSignup } from '../hooks/use-signup';
import { AuthRoute } from '../utils/api';

type Props = {
  authRoute: AuthRoute;
};

const SignUpForm = ({ authRoute }: Props) => {
  const { mutate, isPending, error } = useSignup(authRoute);

  const formRef = useRef<ElementRef<'form'> | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    const data = new FormData(formRef.current);
    const email = data.get('email') as string;
    const name = data.get('name') as string;
    const password = data.get('pwd') as string;

    mutate({ email, name, password });
  };

  return (
    <div className="w-[40ch] space-y-8">
      <div className="text-center">
        <h2 className="text-center text-2xl">Welcome to Auth 🥷 Dojo!</h2>
        <p className="font-light">Create an account for free</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="grid w-full gap-4">
        <div className="control">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your full name here"
            disabled={isPending}
          />
        </div>

        <div className="control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Your email here"
            disabled={isPending}
          />
        </div>

        <div className="control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="pwd"
            id="password"
            placeholder="Your password here"
            disabled={isPending}
          />
        </div>

        <p className="text-end">
          Already a member?{' '}
          <Link to={`/${authRoute}/login`} className="underline">
            Log in
          </Link>
        </p>

        <button disabled={isPending} type="submit">
          Sign up
        </button>

        {error && <p className="text-sm font-medium text-red-600">{error.message}</p>}
      </form>
    </div>
  );
};

export default SignUpForm;
