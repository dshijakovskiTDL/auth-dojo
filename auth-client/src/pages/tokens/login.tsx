import { ElementRef, FormEvent, useRef } from 'react';
import DemoTitle from '../../components/title';
import { TokenUser } from '../../context/token-user';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from '../../utils/api';

const TokensLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const formRef = useRef<ElementRef<'form'> | null>(null);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      if (!formRef.current) return;

      const data = new FormData(formRef.current);
      const email = data.get('email');
      const password = data.get('pwd');

      const body = { email, password };
      const response = await fetch(getApiUrl('token', 'login'), {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        throw new Error(error);
      }

      const userData = (await response.json()) as TokenUser;
      return userData;
    },
    onSettled: (userData) => {
      if (!userData) return;

      queryClient.setQueryData(['token', 'me'], userData);
      navigate('/token');
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="space-y-10">
      <DemoTitle authType="Token" />

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

        {error && (
          <p className="font-medium text-sm text-red-600">{error.message}</p>
        )}
      </form>
    </div>
  );
};

export default TokensLogin;
