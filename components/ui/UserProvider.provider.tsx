import React, { useContext, useEffect } from "react"
import { ReactNode, useState } from "react"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {fetchUser} from '@/serviers/User.service.rn'
import { useReducedMotion } from "react-native-reanimated";
import UserModel from "@/models/user/User.model";

interface UserApplications {
    user: UserModel | undefined
    updateUser: (user: UserModel) => void,
    logoutCleaner: () => void
}


type UserProviderChildrenPropos = {
    children: ReactNode
}

const UserContext = React.createContext<UserApplications | null>(null)

const useUser = () => useContext(UserContext)



const UserProvider = ({children}: UserProviderChildrenPropos) => {
    const [user, setUser] = useState<UserModel>()

    const logoutCleaner = () => {
        setUser(undefined)
        const useClient = useQueryClient()
        useClient.clear()
    }
    useEffect(()=> {
        console.log('user updated to ' + user?._id)
    }, [user])
    

    return (
        <UserContext.Provider value={{
            user: user,
            logoutCleaner: logoutCleaner,
            updateUser: setUser
        }}>
            {children}
        </UserContext.Provider>
    )
}




export {UserProvider, useUser}