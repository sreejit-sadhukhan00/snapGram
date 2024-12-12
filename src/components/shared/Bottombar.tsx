import { BottombarLinks } from '@/constants';
import { Link,useLocation } from 'react-router-dom'


function Bottombar() {
  const {pathname}=useLocation();
  return (
    <section className='bottom-bar'>
  {
                BottombarLinks.map((bottomLink)=>{
                  const isActive=pathname===bottomLink.route;
                  return(
                  <li key={bottomLink.route}
                  className={` group $ `}
                  >
                <Link to={bottomLink.route}
                className={`flex  flex-col gap-0.5 items-center rounded-full w-full  h-full p-2 
                  ${isActive && 'bg-primary-500'}
                  `}
                key={bottomLink.name}
                >
                  <img src={bottomLink.imageURL} alt="sidebarlogo" 
                  width={20}
                  height={20}
                  className={`group-hover:invert-white ${isActive && 'invert-white'}`} />
                  <p className='tiny-medium text-gray-300 '>{bottomLink.name}</p>
                </Link>
                </li>
                )}
              )
               }   

    </section>
  )
}

export default Bottombar