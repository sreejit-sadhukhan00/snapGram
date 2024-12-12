import PostForm from "@/components/forms/PostForm";


function CreatePost() {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        {/* the tops most heading and logo */}
            <div  className="max-w-5xl flex  justify-start gap-3 w-full">
              <img src="/assets/icons/add-post.svg" alt="" width={38} height={38} />
              <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
            </div>

            <PostForm action="create"/>
      </div>
        
    </div>
  )
}

export default CreatePost;