

import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/hooks/use-toast"

import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries&mutations";
import { SignupValidationshema } from "@/lib/Validation";
import { useUserContext } from "@/context/Authcontext";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidationshema>>({
    resolver: zodResolver(SignupValidationshema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Queries
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();

  const { mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount();




  // Handler
  const handleSignup = async (values: z.infer<typeof SignupValidationshema>) => {
    try {

      // new account-->
      const newUser = await createUserAccount(values);
      console.log("account created");
      
      if (!newUser) {
        toast({ 
          title: "Sign up failed", 
          variant: "destructive" 
        });
        return;
      }
      
      // sign in 
      try {
        const session = await signInAccount({
          email: values.email,
          password: values.password,
        });
         console.log("signed in");
         console.log("Session details:", session);
        if (!session) {
          return toast({title:'sign in failed'})
        }
        
    
        // is logged in or not--->
        const isLoggedIn = await checkAuthUser();
           console.log("logged in");
           
        if (isLoggedIn) {
          form.reset();
          navigate("/");
        } 
        else {
          toast({ 
            title: "Authentication Failed", 
            description: "Could not log in after signup",
            variant: "destructive" 
          });
        }
      } catch (signInError) {
        console.error("Sign in error:", signInError);
        toast({ 
          title: "Sign In Failed", 
          description: JSON.stringify(signInError),
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({ 
        title: "Signup Error", 
        description: JSON.stringify(error),
        variant: "destructive" 
      });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use snapgram, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount  ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;