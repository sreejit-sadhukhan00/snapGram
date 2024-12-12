import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '../ui/textarea'
import FileUploader from '../shared/FileUploader'
import { PostformSchema } from '@/lib/Validation'
import { Models } from 'appwrite'
import { useUserContext } from '@/context/Authcontext'
import { toast, useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { useCreatePost, useEditedPost } from '@/lib/react-query/queries&mutations'
import Loader from '../shared/Loader'

type PostFormProps ={
  post ?:Models.Document
  action: 'create' | 'update'
}
 

function PostForm({post,action}:PostFormProps) {
  const { toast } = useToast();
  const navigate=useNavigate();
  const {user}=useUserContext();
  // tanstack query
   const {mutateAsync:createPost , isPending:isLoadingCreate}=useCreatePost();
  
   const {mutateAsync:editPost , isPending:isEditing}=useEditedPost();
  
    
  // define form
    const form = useForm<z.infer<typeof PostformSchema>>({
        resolver: zodResolver(PostformSchema),
        defaultValues: {
          caption:post? post?.Caption :"",
          file:[],
          location:post ? post?.location:"",
          tags:post ?post?.tags.join(','):'',
        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof PostformSchema>) {

       if(post && action==='update'){
          const editedPost=await editPost({
            ...values,
            postId:post.$id,
            imageId:post?.imageId,
            imageUrl:post?.imageUrl
         } )

         if(!editedPost){
          toast({
            title: "Please try again",
            variant: "destructive",
          });
         }
         
         return navigate(`/posts/${post.$id}`)
       }
        
        try {
      
          const newPost = await createPost({
            ...values,
            userId: user.id,
          });
      
          if (!newPost) {
            toast({
              title: "Please try again",
              variant: "destructive",
            });
            return;
          }
      
          navigate("/");
        } catch (error) {
          console.error("Error creating post:", error);
          toast({
            title: "Error creating post",
            variant: "destructive",
          });
        }
      }
      

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        {/* caption addition place ==> */}
      <FormField
        control={form.control}
        name="caption"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='shad-form_label'>Caption</FormLabel>
            <FormControl>
              <Textarea className='shad-textarea custom-scrollbar' {...field} />
            </FormControl>
            <FormMessage className='shad-form_message' />
          </FormItem>
        )}
      />

      {/* image addition place */}
      <FormField
        control={form.control}
        name="file"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='shad-form_label'>Add photos</FormLabel>
            <FormControl>
              <FileUploader
              fieldChange={field.onChange}
              mediaUrl={post?.imageUrl}
              />
            </FormControl>
            <FormMessage className='shad-form_message' />
          </FormItem>
        )}
      />
      {/* location addition */}
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='shad-form_label'>Add Location</FormLabel>
            <FormControl>
              <Input type='text' className='shad-input'{...field}/>
            </FormControl>
            <FormMessage className='shad-form_message' />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='shad-form_label'>Add Tags (separated by comma " , ")</FormLabel>
            <FormControl>
              <Input type='text' placeholder='Art,Expression,Learn
              ' className='shad-input' {...field}/>
            </FormControl>
            <FormMessage className='shad-form_message' />
          </FormItem>
        )}
      />



    <div className='flex items-center justify-between md:justify-end gap-4'>
    <Button type="button" 
    className='shad-button_dark_4 rounded-full'>
        Cancel
        </Button>

    

<Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate || isEditing}>
            {isLoadingCreate || isEditing  && <Loader /> 
               }
               {action} post
          </Button>
    </div>
     
    </form>
  </Form>
  )
}

export default PostForm