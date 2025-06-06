import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/hooks/use-toast"

import { useSignInAccount } from "@/lib/react-query/queries&mutations";
import { SigninValidationshema } from "@/lib/Validation";
import { useUserContext } from "@/context/Authcontext";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SigninValidationshema>>({
    resolver: zodResolver(SigninValidationshema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Queries


  const { mutateAsync: signInAccount } = useSignInAccount();
  // Handler
  const handleSignup = async (values: z.infer<typeof SigninValidationshema>) => {
    try {
      // sign in 
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });
      console.log("Signed in successfully:", session);
      
      if (!session) {
        return toast({title:'Sign in failed'});
      }
      
      // is logged in or not--->
      const isLoggedIn = await checkAuthUser();
      console.log("Logged in status:", isLoggedIn);
      
      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        toast({ 
          title: "Authentication Failed", 
          description: "Could not log in after signup",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Signin error:", error);
      toast({ 
        title: "Signin Error", 
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
          Log In to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
         Welcome Back , please enter your details !
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4">

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
            {isUserLoading  ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;