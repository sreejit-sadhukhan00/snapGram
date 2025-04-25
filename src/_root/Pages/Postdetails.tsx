import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/Authcontext";
import { useGetPostById, useDeleteedPost } from "@/lib/react-query/queries&mutations";
import { formatDistanceToNow } from "date-fns";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { getFileView } from "@/lib/AppWrite/api"; // Correct import with proper casing

// converting the date 
const RelativeDate = ({ date }: { date: string }) => {
  const relativeDate = formatDistanceToNow(new Date(date), { addSuffix: true });
  return <span>{relativeDate}</span>;
}; 

function Postdetails() {
  const {id} = useParams();
  const {data:post, isPending, } = useGetPostById(id || '');
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  const {user}=useUserContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: deletePost, isPending: isDeleting } = useDeleteedPost();

  useEffect(() => {
    const loadImageView = async () => {
      if (post?.imageId) {
        try {
          setIsImageLoading(true);
          const fileUrl = await getFileView(post.imageId);
          if (fileUrl) {
            setImageUrl(fileUrl.toString());
          }
        } catch (error) {
          console.error("Failed to load image view:", error);
        } finally {
          setIsImageLoading(false);
        }
      }
    };

    if (post) {
      loadImageView();
    }
  }, [post]);

  // Debug the post data and image URL
  console.log("Post data:", post);
  console.log("Image URL from state:", imageUrl);

  const handleDeletePost = () => {
    if (!post?.$id || !post?.imageId) return;
    
    deletePost({ 
      postId: post.$id,
      imageId: post.imageId 
    }, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Post deleted successfully"
        });
        navigate("/");
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete post",
          variant: "destructive"
        });
      }
    });
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/assets/icons/image-placeholder.svg';
  };

  // return
  return (
    <div className="post_details-container">
      {isPending? <Loader/> :(
        <div className="post_details-card">
          <div className="post_details-img-container">
            {isImageLoading ? (
              <div className="post_details-img flex-center">
                <Loader />
              </div>
            ) : (
              <img 
                src={imageUrl || post?.imageUrl || '/assets/icons/image-placeholder.svg'}
                alt="post"
                className="post_details-img w-full h-full object-contain"
                onError={handleImageError}
                style={{ maxHeight: "500px", width: "100%", objectFit: "contain" }}
              />
            )}
          </div>
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                <img 
                  src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:h-12 lg:w-12"
                />
                
                <div className="flex flex-col">
                  {/* name */}
                  <p className="base-md lg:body-bold text-gray-100">{post?.creator.name}</p>
                  <div className="flex-center gap-4 ">
                    {/* date and location */}
                    <p className="subtle-semibold lg:small-regular text-gray-600">
                      <RelativeDate date={post?.$createdAt||''} />
                    </p>
                    <p className="subtle-semibold lg:small-regular text-gray-300">{post?.location}</p>
                  </div>
                </div>
              </Link>

              <div className="flex-center ">
                <Link 
                  to={`/update-post/${post?.$id}`} 
                  className={`${user.id !== post?.creator.$id && 'hidden'}`}
                >
                  <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`${user.id!==post?.creator.$id && 'hidden'} ghost_details-delete_btn`}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="h-6 w-6">
                      <Loader />
                    </div>
                  ) : (
                    <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
                  )}
                </Button>
              </div>
            </div>
           
            <hr className="border w-full border-dark-4"/>

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular ">
              <p>{post?.Caption}</p>

              <ul className="flex gap-1 mt-2"> 
                {post?.tags?.map((tag: string, index: number) => (
                  <li key={`${post?.$id}-${tag}-${index}`} className="text-gray-600">#{tag}</li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Postdetails;