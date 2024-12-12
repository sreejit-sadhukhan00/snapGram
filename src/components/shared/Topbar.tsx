
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queries&mutations'
import { useUserContext } from '@/context/Authcontext';
import { useEffect } from 'react';


function Topbar() {
  const {mutate:signOut,isSuccess}=useSignOutAccount();
  const {user}=useUserContext();
  const navigate=useNavigate();
useEffect(()=>{
    if(isSuccess){
      navigate(0)
    }
},[isSuccess]);


  return (
   <section className='topbar'>
    <div className='flex-between py-5 px-5'>
        <Link to='/' className='flex gap-3 items-center'>
        <img src="/assets/images/logo.svg" alt="logo" 
        width={145}
        height={325}
        />
        </Link>
        <div className='flex gap-4'>
              <Button variant='ghost' className='shad-button_ghost'
              onClick={()=>signOut()}
              >
                <img src="/assets/icons/logout.svg" alt=""  />
                </Button>     
                <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
                <img src={user.imageUrl || '/assets/images/profile-placeholder.svg'} alt="profile" 
                className='rounded-full h-10 w-10'
                />
                </Link>
                </div>
    </div>
   </section>
  )
}

export default Topbar