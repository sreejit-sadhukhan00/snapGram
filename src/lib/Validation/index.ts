import { z } from "zod";

export const SignupValidationshema = z.object({
    name:z.string().min(2,{message:'Too short'}),
    username: z.string().min(2),
    email:z.string().email(),
    password:z.string().min(8,{message:'minimum 8 characters'})
  })
export const SigninValidationshema = z.object({
    email:z.string().email(),
    password:z.string().min(8,{message:'minimum 8 characters'})
  })

 export const PostformSchema = z.object({
  caption: z.string().min(2, { message: "Minimum 3characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
})      


export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});