import requester from "@/constants/Network.config"


export const signupRequest = async (data: SignupFields) => {
    return await requester.post<TokenModel>('/auth/signup', data)
}