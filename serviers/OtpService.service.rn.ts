import requester from "@/constants/Network.config"
import { Message } from "react-hook-form"

interface OtpPayloadSend {
    email: string
}

interface OtpPayloadVerify {
    email: string
    code: string
}





// verify otp token
const verifyOtpToken = async (data: OtpPayloadVerify) => {
    return await requester.post<LoginModel>('/auth/confirm', data)
}


export {verifyOtpToken, OtpPayloadSend, OtpPayloadVerify}
