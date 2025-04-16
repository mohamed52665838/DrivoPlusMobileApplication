import UserModel from '@/models/user/User.model';
import { create } from 'zustand';

interface UserStatus {
    userModel: UserModel | null;
    signIn: (user: UserModel) => void;
    signOut: () => void;
    updateUser: (updates: Partial<UserModel>) => void;  // 🔥 Permet de mettre à jour seulement certains champs
}

interface ExpoToken {
    expToken: string | null
    updateToken: (string: string) => void
}

const useExpoToken = create<ExpoToken>((set) => ({
    expToken: null,
    updateToken: (expToken) => set(() => ({expToken: expToken}))
}))



const useCurrentUserState = create<UserStatus>((set) => ({
    userModel: null,
    signIn: (user: UserModel) => set(() => ({ userModel: user })),
    signOut: () => set(() => ({ userModel: null })),
    updateUser: (updates: Partial<UserModel>) =>
        set((state) => ({
            userModel: state.userModel ? { ...state.userModel, ...updates } : null,  // 🔥 Mise à jour partielle
        })),
}));

export {useExpoToken}
export default useCurrentUserState;
