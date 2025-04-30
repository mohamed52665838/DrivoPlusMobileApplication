import { getApiKey, TokenStructure } from "@/utils/secure.session"
import { resolveToken } from "./TokenResolver.service.rn"
import requester from "@/constants/Network.config";
import UserModel from "@/models/user/User.model";

const fetchUser = async () => {
    const token = await resolveToken();
    const user = await requester.get<UserModel>('/user', {headers: {'Authorization': `Bearer ${token}`}}) 
    return user.data
}


    const updateUser = async (data: UpdateUserModel) => {
        const token = await resolveToken();
        console.log('we are before the execution');
        const user = await requester.put<UserModel>('/user',data, {headers: {'Authorization': `Bearer ${token}`}}) 
        console.log('updated terminated executed')
        console.log(user)
        return user.data
    }
    

const deleteUser = () => {

}


export {fetchUser, updateUser, deleteUser}
