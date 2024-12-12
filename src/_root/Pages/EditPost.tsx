import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queries&mutations";
import { useParams } from "react-router-dom";


function EditPost() {
  const {id}=useParams();
  const{data:post,isPending}=useGetPostById(id ||'');









  if(isPending) return <Loader/>
  else{
  return (
    <div className="flex flex-1">
      <div className="common-container">
        {/* the tops most heading and logo */}
            <div  className="max-w-5xl flex  justify-start gap-3 w-full">
              <img src="/assets/icons/add-post.svg" alt="" width={38} height={38} />
              <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
            </div>

            <PostForm action="update" post={post}/>
      </div>
        
    </div>
  )
}
}

export default EditPost;