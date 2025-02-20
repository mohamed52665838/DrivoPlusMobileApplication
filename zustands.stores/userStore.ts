import UserModel from '@/models/user/User.model';
import { create } from 'zustand';

interface UserStatus {
    userModel: UserModel | null;
    signIn: (user: UserModel) => void;
    signOut: () => void;
    updateUser: (updates: Partial<UserModel>) => void;  // 🔥 Permet de mettre à jour seulement certains champs
}

const useCurrentUserState = create<UserStatus>((set) => ({
    userModel: null,
    signIn: (user: UserModel) => set(() => ({ userModel: user })),
    signOut: () => set(() => ({ userModel: null })),
    updateUser: (updates: Partial<UserModel>) =>
        set((state) => ({
            userModel: state.userModel ? { ...state.userModel, ...updates } : null,  // 🔥 Mise à jour partielle
        })),
}));

export default useCurrentUserState;
