import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/Authcontext";
import { useGetPostById } from "@/lib/react-query/queries&mutations"
import { formatDistanceToNow } from "date-fns";
import { Link, useParams } from "react-router-dom";






 // converting the date 
 const RelativeDate = ({ date }: { date: string }) => {
  const relativeDate = formatDistanceToNow(new Date(date), { addSuffix: true });
  return <span>{relativeDate}</span>;
}; 

function Postdetails() {
  const {id}= useParams()
  const {data:post,isPending}=useGetPostById(id || '');

  const {user}=useUserContext();

const handleDeletePost=()=>{

}




  // return
  return (
    <div className="post_details-container">
      {isPending? <Loader/> :(
        <div className="post_details-card">
          <img 
          src={post?.imageUrl}
          alt="post"
          className="post_details-img"
          />
              <div className="post_details-info">
                <div className="flex-between w-full">
                <Link to={`/profile/${post?.creator.$id}`}>
                 <img src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="creator"
                 className="rounded-full  w-8 h-8 lg:h-12 lg:w-12"
                 />
                

                <div className="flex flex-col">
                    {/* name */}
                    <p className="base-md lg:body-bold text-gray-100">{post?.creator.name}</p>
                    <div className="flex-center gap-4 ">

                        {/* date and location */}
                        <p className="subtle-semibold lg:small-regular text-gray-600"><RelativeDate date={post?.$createdAt||''} />
                        </p>

                        <p className="subtle-semibold lg:small-regular text-gray-300">{post?.location}</p>
                    </div>
                </div>
                </Link>

                <div className="flex-center ">
                             <Link to={`/update-post/${post?.id}`}
                             className={`${user.id!==post?.creator.$id && 'hidden'}`}
                             >
                              <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
                             </Link>

                             <Button
                             onClick={handleDeletePost}
                             variant="ghost"
                             className={`${user.id!==post?.creator.$id && 'hidden'} ghost_details-delete_btn`}
                             >
                                  <img src="/assets/icons/delete.svg" alt="delete" 
                                  width={24}
                                  height={24}
                                  />
                             </Button>
                </div>
                </div>
               
               <hr className="border w-full border-dark-4"/>

               <div className="flex flex-col flex-1 w-full small-medium lg:base-regular ">
              <p>{post?.Caption}</p>

              <ul className="flex gap-1 mt-2"> {post?.tags.map((tag:string)=>(
                <li key={post?.$id} className="text-gray-600">#{tag}</li>
              ))}</ul>
          </div>

          <div className="w-full">
            <PostStats post={post} userId={user.id}/>
          </div>
            </div>
        </div>

      )}

    </div>
  )
}

export default Postdetails