
interface LoginModel {
  user: {
    _id: string;
    full_name: string;
    email: string;
    phone_number: string;
    is_active_premium: boolean;  // ✅ Ajout de is_active_premium

  };
  tokens: TokenModel;
}