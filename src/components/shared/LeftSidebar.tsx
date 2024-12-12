
import { Link, useNavigate,useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queries&mutations'
import { INITIAL_USER, useUserContext } from '@/context/Authcontext';
import { sideBarLinks } from '@/constants';
import Loader from './Loader';
// function starts================>
function LeftSidebar() {
  const navigate=useNavigate();
  const {mutate:signOut}=useSignOutAccount();
  const {pathname}=useLocation();
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();


  // handle sign out function
  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  // return starts===========================>
  return (
  <nav className='leftsidebar'>
          <div className='flex flex-col gap-8'>
            {/* redirects to home page */}
          <Link to='/' className='flex gap-3 items-center'>
        <img src="/assets/images/logo.svg" alt="logo" 
        width={145}
        height={325}
        />
        </Link>
           
        {isLoading || !user.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <Link to={`/profile/${user.id}` } className='flex gap-3 items-center'>
          <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}className='w-12 h-12 rounded-full'  alt="profile pic"  />
               
               {/* person name */}
               <div className='flex flex-col'>
            <p className='body-bold'>
              {user.name}
            </p>
            <p className='small-regular text-gray-500'>{`@${user.username}`}</p>
          </div>
          </Link>
  )} 
          {/* sidebar links  */}
                  <ul className='flex flex-col gap-6'>
               {
                sideBarLinks.map((sideLink)=>{
                  const isActive=pathname===sideLink.route;
                  return(
                  <li key={sideLink.name}
                  className={`leftsidebar-link group ${isActive && 'bg-primary-500'} `}
                  >
                <Link to={sideLink.route}
                className='flex items-center gap-6 rounded-full w-full  h-full p-2 '
                >
                  <img src={sideLink.imageURL} alt="sidebarlogo" 
                  className={`group-hover:invert-white ${isActive && 'invert-white'}`} />
                  <p>{sideLink.name}</p>
                </Link>
                </li>
                )}
              )
               }

                  </ul>
          </div>

          <Button  variant="ghost" className='shad-button_ghost hover:invert-white'
              onClick={(e)=>handleSignOut(e)}
              >
                <img src="/assets/icons/logout.svg" alt=""  />
                <p className='text-bold lg:base-medium small-medium '>LogOut</p>
                </Button>    
  </nav>
  )
}

export default LeftSidebar;
