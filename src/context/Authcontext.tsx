
import { getCurrentUser } from "@/lib/AppWrite/api";
import { IUser } from "@/Types";
import { createContext,useContext,useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER={
  id:'',
  name:'',
  username:'',
  email:'',
  imageUrl:'',
  bio:''
}

const INITIAL_STATE={
  user:INITIAL_USER,
  isLoading:false,
  isAuthenticated:false,
  setUser:()=>{},
  setIsAuthenticated:()=>{},
  checkAuthUser:async()=> false ,
}
type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};


const AuthContext = createContext<IContextType>(INITIAL_STATE);

// provider function---->>>
function AuthProvider({children}:{children:React.ReactNode}) {
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate=useNavigate();

const checkAuthUser = async () => {
  setIsLoading(true);
  try {
    const currentAccount = await getCurrentUser();
    if (currentAccount) {
      console.log("Authentication successful");
      setUser({
        id: currentAccount.$id,
        name: currentAccount.name,
        username: currentAccount.username,
        email: currentAccount.email,
        imageUrl: currentAccount.imageUrl,
        bio: currentAccount.bio,
      });
      setIsAuthenticated(true);
      return true;
    }
    console.log("Authentication failed");
    return false;

  }
   catch (error) {
    console.error("Error in checkAuthUser:", error);
    return false;
  } finally {
    setIsLoading(false);
  }
};


useEffect(() => {
  const cookieFallback = localStorage.getItem('cookieFallback');
  // console.log('cookieFallback:', cookieFallback);
  if (cookieFallback === '[]' || cookieFallback === null) {
      navigate('/sign-in');
  } else {
      checkAuthUser();
  }
}, []);


const value = {
  user,
  setUser,
  isLoading,
  isAuthenticated,
  setIsAuthenticated,
  checkAuthUser,
};

  return (
   <AuthContext.Provider value={value}>
   {children}
   </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useUserContext=()=>useContext(AuthContext);