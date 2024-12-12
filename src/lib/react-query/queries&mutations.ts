import{
    useQuery,
    useMutation,
    useQueryClient,useInfiniteQuery
}
from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavedPost, editPost, getCurrentUser, getInfinitePost, getPostById, getRecentPosts, getUserById, getUsers, likePost, savePost, searchPost, signInAccount, signOutAccount, updateUser } from '../AppWrite/api'
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/Types'
import { QUERY_KEYS } from './queryKeys';

export const useCreateUserAccount = () => {
    return useMutation({
      mutationFn: (user: INewUser) => createUserAccount(user),
    });
  };
  
  export const useSignInAccount = () => {
    return useMutation({
      mutationFn: (user: { email: string; password: string;}) =>
        signInAccount(user),
    });
  };
  export const useSignOutAccount = () => {
    return useMutation({
      mutationFn: () =>
        signOutAccount(),
    });
  };

  // post queries===============================================================>>>>>>

  // ===>post creation
 export const useCreatePost=()=>{
  const queryCLient=useQueryClient();

  return useMutation({
    mutationFn:(post:INewPost)=>createPost(post),
    onSuccess:()=>{
      queryCLient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
 }

// post retrieval
 export const useGetRecentPost=()=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
    queryFn:getRecentPosts,
  })
 }

// ====> like post

export const useLikePost=()=>{
  const queryClient=useQueryClient();
  return useMutation({
    mutationFn:({postId,likesArray}:{postId:string;likesArray:string[]})=>likePost(postId,likesArray),

     onSuccess:(data)=>{
           queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
           })
           queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
           })
           queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_POSTS]
           })
           queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_CURRENT_USER]
           })
     }
  })
}

// save post
export const useSavePost=()=>{
  const queryClient=useQueryClient();

  return useMutation({
    mutationFn:({postId,userId}:{postId:string;userId:string})=>savePost(postId,userId),

     onSuccess:()=>{
           queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
           })
           queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_POSTS]
           })
           queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_CURRENT_USER]
           })
     }
  })
}
// delete save post
export const useDeleteSavePost=()=>{
  const queryClient=useQueryClient();

  return useMutation({
    mutationFn:(savedRecordId: string)=>deleteSavedPost(savedRecordId),
      
     onSuccess:()=>{
           queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
           })
           queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_POSTS]
           })
           queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_CURRENT_USER]
           })
     }
  })
}

// get the current user
export const useGetCurrentUser=()=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_CURRENT_USER],
    queryFn:getCurrentUser
  })
}

// get post by id
export const useGetPostById=(postId:string)=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_POST_BY_ID,postId],
    queryFn:()=>getPostById(postId),
    enabled: !!postId
  })
}

// use editpost
export const useEditedPost=()=>{
  const queryCLient=useQueryClient();
  return useMutation({
    mutationFn:(post:IUpdatePost)=>editPost(post),
    onSuccess:(data)=>{
      queryCLient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID,data.$id]
      })
    }
  })
}
// use deletepost
export const useDeleteedPost=()=>{
  const queryCLient=useQueryClient();
  return useMutation({
    mutationFn:({postId,imageId}:{postId:string,imageId:string})=>deletePost(postId,imageId),
    onSuccess:()=>{
      queryCLient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}

// use Getpost
export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePost,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.documents.length === 0) {
        return null;
      }
      const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
      
      // Convert the string ID to a number or return null
      return lastId ? parseInt(lastId, 10) : null;
    },
    initialPageParam: 0 // Add this to specify the initial page parameter
  })
};

  

// search post
export const useSearchPost=(searchTerm:string)=>{
   return useQuery({
    queryKey:[QUERY_KEYS.SEARCH_POSTS,searchTerm],
    queryFn:()=>searchPost(searchTerm),
    enabled:!!searchTerm
   })
}

// use get user by id
export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};


// updateUser
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

// get users

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};