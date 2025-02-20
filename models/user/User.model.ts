
interface UserModel {
    _id: string,
    full_name: string,
    email: string,
    username?: string,
    phone_number: string,
    activate_at?: Date
    is_active_premium: boolean;
}
export default UserModel