import { ElementRef, FormEvent, useRef } from 'react';

import { useLogin } from '../../hooks/use-login';
import { AuthRoute } from '../../utils/api';

type Props = {
  authRoute: AuthRoute;
};

const LoginForm = ({ authRoute }: Props) => {
  const { mutate, isPending, error } = useLogin(authRoute);

  const formRef = useRef<ElementRef<'form'> | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    const data = new FormData(formRef.current);
    const email = data.get('email') as string;
    const password = data.get('pwd') as string;

    mutate({ email, password });
  };

  return (
    <div className="space-y-10 max-w-[60ch]">
      <h2 className="text-2xl text-center">
        <span className="underline capitalize italic">{authRoute}</span> based
        Authentication
      </h2>

      <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 w-fit">
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

        <button disabled={isPending} type="submit">
          Log in
        </button>

        {error && <p className="font-medium text-sm text-red-600">{error.message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
