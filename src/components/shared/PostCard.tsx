import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { useUserContext } from "@/context/Authcontext";
import PostStats from "./PostStats";

type postCardProps={
    post:Models.Document;
}

 // converting the date 
const RelativeDate = ({ date }: { date: string }) => {
    const relativeDate = formatDistanceToNow(new Date(date), { addSuffix: true });
    return <span>{relativeDate}</span>;
  }; 


//   main function
function Postcard({post}:postCardProps) {
   const {user}=useUserContext();

if(!post.creator) return;

  return (
    <div className="post-card">
        <div className="flex-between">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${post.creator.$id}`}>
                 <img src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="creator"
                 className="rounded-full w-12 lg:h-12"
                 />
                </Link>

                <div className="flex flex-col">
                    {/* name */}
                    <p className="base-md lg:body-bold text-gray-100">{post.creator.name}</p>
                    <div className="flex-center gap-4 ">

                        {/* date and location */}
                        <p className="subtle-semibold lg:small-regular text-gray-600"><RelativeDate date={post.$createdAt} />
                        </p>

                        <p className="subtle-semibold lg:small-regular text-gray-300">{post.location}</p>
                    </div>
                </div>
            </div>

            <Link to={`/update-post/${post.$id}`}
             className={`${user.id !== post.creator.$id && "hidden"}`}
            >
              <img src="/assets/icons/edit.svg" alt="edit icon" className="w-4 lg:w-6" />
            </Link>
        </div>
           
           {/* post related things */}
          <Link to={`/posts/${post.$id}`}>
          <div className="small-medium  lg:base-medium py-6 ml-8">
              <p>{post.Caption}</p>

              <ul className="flex gap-1 mt-2"> {post.tags.map((tag:string)=>(
                <li key={post.$id} className="text-gray-600">#{tag}</li>
              ))}</ul>
          </div>

          <img src={post.imageUrl || 'assets/icons/profile-placeholder.svg'} alt="post image" className="post-card_img" />
          </Link>

          <PostStats post={post} userId={user.id}/>
    </div>
  )
}

export default Postcard