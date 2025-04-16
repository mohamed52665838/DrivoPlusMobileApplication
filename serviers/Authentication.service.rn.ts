import requester from '@/constants/Network.config';

export const signin = async (data: LoginFormField) => {
    return await requester.post<LoginModel>('/auth/signin', data)
}