import { ElementRef, FormEvent, useRef } from 'react';

import { useVerify2fa } from '../../hooks/2fa/use-verify';
import ResendCode from './resend';

const TwoFactorVerify = () => {
  const { mutate, isPending, error } = useVerify2fa();

  const formRef = useRef<ElementRef<'form'> | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    const data = new FormData(formRef.current);
    const code = data.get('code') as string;

    mutate({ code });
  };

  return (
    <div className="w-[40ch] space-y-8">
      <div className="text-center">
        <h2 className="text-center text-2xl">Step 2: Verify yourself</h2>
        <p className="font-light">Enter the 6-digit code you received in your email</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="grid w-full gap-4">
        <div className="control">
          <label htmlFor="code">Code</label>
          <input
            type="text"
            name="code"
            id="code"
            inputMode="numeric"
            placeholder="ex. 123456"
            autoComplete="off"
            disabled={isPending}
          />
        </div>

        <ResendCode />

        <button disabled={isPending} type="submit">
          Verify
        </button>

        {error && <p className="text-sm font-medium text-red-600">{error.message}</p>}
      </form>
    </div>
  );
};

export default TwoFactorVerify;
