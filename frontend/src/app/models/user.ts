export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    newPassword?: string | null;
    verifyPassword?: string | null;
    bio?: string | null;
    country?: string | null;
    city?: string | null;
    imageurl: string;
    travelsNumber: number | null;
    status: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    loading: boolean;
    followers: User[] | null;
    followings: User[] | null;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    register: (credentials: {email: string, password: string, lastName: string, firstName: string, city: string | null, country: string | null}) => Promise<void>
    updateUser: (id: string | undefined, user: User | null) => Promise<void>
    updateImage: (id: string | undefined, image: string | null) => Promise<void>
  }
  
  export interface AuthCheckResponse {
    data: User | null;
  }
  
  export interface Token {
    token: string;
  }