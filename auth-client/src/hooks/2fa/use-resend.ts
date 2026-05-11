import { useMutation } from '@tanstack/react-query';

export const useResendCode = () => {
  return useMutation({
    mutationFn: async () => {},
  });
};
