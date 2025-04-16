interface ApiResponse<T> {
  data: T;
  errors: string | string[] | undefined; 
  message: string;
  status: boolean;
}