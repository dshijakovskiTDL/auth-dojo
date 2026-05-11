import { useMutation } from '@tanstack/react-query';

import { getApiUrl } from '../../utils/api';

const ResendCode = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const response = await fetch(getApiUrl('2fa', 'resend'), {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        throw new Error(error);
      }

      return true;
    },

    onSettled: (success) => {
      if (!success) return;

      alert('Code resent successfully! Please check your email');
    },
  });

  const resend = () => {
    mutate();
  };

  return (
    <div className="text-end">
      Didn't receive anything?{' '}
      <button
        type="button"
        className="underline data-[pending='true']:animate-pulse data-[pending='true']:pointer-events-none"
        data-pending={isPending}
        onClick={resend}
      >
        Resend code
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
};

export default ResendCode;
