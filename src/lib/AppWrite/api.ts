import { ID, Query } from "appwrite";

import { appwriteConfig, account, database, storage, avatars } from "./config";
import { IUpdatePost, INewPost, INewUser, IUpdateUser } from "@/Types";

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
    try {
      // Destroy existing sessions more safely
      //  await account.deleteSessions();
  
      const session = await account.createEmailPasswordSession(user.email, user.password);
      
      // More robust error checking
      if (!session) {
        throw new Error("Session creation failed");
      }
  
      return session;
    } catch (error) {
      console.error("SignInAccount Error:", error);
    }
  }

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    
  }
}
// ===============================SIGN OUT
export async function signOutAccount(){
  try {
    const session=await account.deleteSession("current");
   return session
  } catch (error) {
    
  }
}

// create post=====>
export async function createPost(post:INewPost) {
  try {
    // upload image to storage
    const uploadedFile=await uploadFile(post.file[0]);

    if(!uploadedFile) throw Error;

    // get file url
    const fileUrl= await getFilePreview(uploadedFile.$id);
    if(!fileUrl){
      deleteFile(uploadedFile.$id)
      throw Error;
    }
// tags into array
    const tags=post.tags?.replace(/ /g,'').split(',') || [];

    // save post to db
    const newpost=await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator:post.userId,
        Caption:post.caption,
        imageUrl:fileUrl,
        imageId:uploadedFile.$id,
        location:post.location,
        tags:tags,
      }
    )


    if(!newpost) {
       await deleteFile(uploadedFile.$id)
      throw Error;
      }

      return newpost
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

// uploadfile function
export async function uploadFile(file:File){
  try {
    const uploadedFile=await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file);

      return uploadedFile;
  } catch (error) {
    console.log(error);
    
    
  }
}


// file preview
export async function getFilePreview(fileId: string | Promise<string | URL>): Promise<string | URL | undefined> {
  try {
    const resolvedFileId = await fileId;
    const fileIdAsString = typeof resolvedFileId === "string" ? resolvedFileId : resolvedFileId.toString();

    // Get the file preview URL
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileIdAsString,
      2000, // width
      2000, // height
      undefined, // imageGravity
      100 // quality
    );

    return fileUrl; // Return the URL
  } catch (error) {
    console.error("Error getting file preview:", error);
    return undefined; // Explicitly return undefined on error
  }
}


// delete file
export async function deleteFile(fileID:string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId,fileID);
    return {status:'ok'}
  } catch (error) {
    console.log(error);
    
    
  }
}


// get recent posts

export async function getRecentPosts(){
  const posts=await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc('$createdAt'),Query.limit(20)]
  )
  if(!posts) throw Error;
   return posts;
}


// likepost function 
export async function likePost(postId:string,likesArray:string[]) {
  try {
      const updatedPost=await database.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId,
        {
          likes:likesArray
        }
      )

      if(!updatedPost) throw Error;

      return updatedPost
  } catch (error) {
      console.log(error);
      
  }
  
}
// savedpost function 
export async function savePost(postId:string,userId:string) {
  try {
      const updatedPost=await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        ID.unique(),
        {
          user:userId,
          post:postId
        }
      )

      if(!updatedPost) throw Error;

      return updatedPost
  } catch (error) {
      console.log(error);
      
  }
  
}

// delete saved post

export async function deleteSavedPost(savedRecordId:string) {
  console.log(savedRecordId);
  
  console.log("inside delete function");
  
  try {
      const statusCode=await database.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        savedRecordId
      )
      console.log("deleted successfull");
      
      if(!statusCode) throw Error;
      console.log(statusCode);
      
      return {status:'ok'};

  } catch (error) {
      console.log(error);
      
  }
}

// get post by id

export async function getPostById(postId:string){
     
  try {
     const post=await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
     )
     if(!post) throw Error;

     return post;

  } catch (error) {
    console.log(error);
     }
}

// editpost
export async function editPost(post:IUpdatePost) {
  const hasFileToUpdate=post.file.length>0;
  try {
    let image={
      imageUrl:post.imageUrl,
      imageId:post.imageId
    }
    if(hasFileToUpdate){
       // upload image to storage
      const uploadedFile=await uploadFile(post.file[0]);
      if(!uploadedFile) throw Error;

          // get file url
    const fileUrl= await getFilePreview(uploadedFile.$id);
    if(!fileUrl){
      deleteFile(uploadedFile.$id)
      throw Error;
    }
    image={...image,imageUrl:fileUrl,imageId:uploadedFile.$id}
    }

// tags into array
    const tags=post.tags?.replace(/ /g,'').split(',') || [];

    // save post to db
    const editedpost=await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        Caption:post.caption,
        imageUrl:image.imageUrl,
        imageId:image.imageId,
        location:post.location,
        tags:tags,
      }
    )


    if(!editedpost) {
       await deleteFile(post.imageId)
      throw Error;
      }

      return editedpost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

// deletepost

export async function deletePost(postId:string,imageId:string){     if(!postId ||!imageId) throw Error;
  try {
     await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
     )
     return {status:'ok'}
  } catch (error) {
    console.log(error);
    
    
  }
    
}

// get infinite post
export async function getInfinitePost({ pageParam }: { pageParam:Number }) {
  console.log("Page Param:", pageParam);

   const queries:any[]= [Query.orderDesc('$updatedAt'),Query.limit(10)];
   
   if(pageParam){
    queries.push(Query.cursorAfter(pageParam.toString()));
   }
    try {
       const posts=await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        queries
       );

       if(!posts ||  !posts.documents){
        throw Error;
       }

       console.log(posts)
       return posts;
       
    } catch (error) {
      console.log(error);
    }
 }
// search post
export async function searchPost(searchTerm:string) {
    try {
      console.log("running");
      
       const posts=await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.search('Caption',searchTerm)]
       )
       if(!posts)throw Error("no post found");
        
       return posts;
    } catch (error) {
      console.log(error);
      return undefined;
     }
   }

// get user by id
export async function getUserById(userId:string){
  try {
    const user=await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    )
    return user;
  } catch (error) {
     console.log(error);
       }
}


// update user
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl =await getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl:fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

// get users 
export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}