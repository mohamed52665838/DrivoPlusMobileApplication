import { getApiKey, TokenStructure } from "@/utils/secure.session"

class UnauthorizedRequestLevelApp extends Error {
    constructor(message: string) {
        super(message)
    }
}

const resolveToken = async () => {
    const token = await getApiKey(TokenStructure.TOKEN)
    if(token == null)
        throw new UnauthorizedRequestLevelApp("Request Not Authorized Back to Sign In")

    // TODO(add refresh fonctionnality)

    return token
}

export {resolveToken}
