import { useUserContext } from "@/context/Authcontext";
import { useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queries&mutations"
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import { useEffect, useState } from "react";
import React from "react";
import Loader from "./Loader";
 type postStatsProps={
    post?:Models.Document,
    userId:string

 }

function PostStats({post,userId}:postStatsProps) {
    
  const likesList=post?.likes.map((user:Models.Document)=>user.$id);
   const [likes, setLikes] = useState(likesList);
   const [saved, setSaved] = useState(false);




    //  like and save muttion retrieval 
    const{mutate:likepost}=useLikePost();

    const{mutate:savepost,isPending:issavingpost}=useSavePost();
    const{mutate:deletSavepost,isPending:isdeletingpost}=useDeleteSavePost();

    const{data: currentuser}=useGetCurrentUser();

    const savedPostRecord=currentuser?.save.find((record:Models.Document)=>record.post.$id===post?.$id);

  useEffect(()=>{
     setSaved(savedPostRecord? true :false)
  },[currentuser])
    
    // likepost handling function
  const handleLikePost=(e:React.MouseEvent)=>{
        e.stopPropagation();
        let newLikes=[...likes];
         const hasLiked=newLikes.includes(userId);
          
        //  if already liked remove the like
         if(hasLiked){
          newLikes=newLikes.filter((id)=> id!==userId);
         }
          // if not liked before then push into like
         else{
          newLikes.push(userId);
         }

         setLikes(newLikes);
         likepost({postId:post?.$id ||'',likesArray:newLikes})
  }

  // savePost handling function
  const handleSavePost=(e:React.MouseEvent)=>{
      e.stopPropagation;
      if(savedPostRecord){
        setSaved(false);
        deletSavepost(savedPostRecord.$id)
        
      }
      else{
        setSaved(true);
        savepost({postId:post?.$id ||'',userId});
      }
  }


  return (
    <div className="flex justify-between items-center z-20">

        {/* like button */}
        <div className="flex gap-2 mr-8">

          {/* conditional rendering of like logo */}
              <img src={checkIsLiked(likes,userId)?
              "/assets/icons/liked.svg"
               : "/assets/icons/like.svg"
              } 
              
              alt="like" 
              width={20}
               height={20}  
               className='ml-4 cursor-pointer'
               onClick={handleLikePost}
               />
               <p className="small medium lg:base-medium">{likes.length}</p>
        </div>
          {/* saved button */}
        <div className="flex gap-2 mr-5">
             {/* conditional rendering of save logo */}
             {issavingpost || isdeletingpost ? <Loader/> :
              <img src={saved?"/assets/icons/saved.svg" 
                           :"/assets/icons/save.svg"
                          }
              alt="like" 
              width={20}
               height={20}  
               className=' cursor-pointer'
               onClick={handleSavePost}
               />}
        </div>

    </div>
  )
}

export default PostStats