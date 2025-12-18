import { useMutation } from '@tanstack/react-query'
import { key as loginKey } from '../../api/auth/login'
import { postLogin, type LoginRequest, type LoginResponse } from '../../api/auth/login/post'

export function useLoginMutation () {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationKey: loginKey,
    mutationFn: postLogin
  })
}
