import { useMutation } from '@tanstack/react-query'
import { key as registerKey } from '../../api/auth/register/const'
import { postRegister, type RegisterRequest, type RegisterResponse } from '../../api/auth/register/post'

export function useRegisterMutation () {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationKey: registerKey,
    mutationFn: postRegister
  })
}
