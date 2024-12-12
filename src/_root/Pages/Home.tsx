import Loader from "@/components/shared/Loader";
import Postcard from "@/components/shared/Postcard";
import { useGetRecentPost } from "@/lib/react-query/queries&mutations";
import { Models } from "appwrite";



function Home() {
  // const isPostLoading=true;
  // const posts=null

  const{data:posts,isPending:isPostLoading,isError:isErrorPosts}=useGetRecentPost();
  return (
    <div className="flex flex-1">
          <div className="home-container">
            <div className="home-posts">
              <h2 className="h3-bold md:h2-bold text-left w-full "></h2>
              {
                isPostLoading && !posts ?   (
                  <Loader/>
                ): (
                  <ul className="flex flex-col flex-1 gap-9 w-full">
                          {
                            posts?.documents.map((post:Models.Document)=>(
                              <li>
                               <Postcard post={post}/>
                              </li>
                            ))
                          }
                  </ul>
                )
              }
            </div>
          </div>

    </div>
  )
}

export default Home