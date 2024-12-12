import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import SearchResults from '@/components/shared/SearchResults';
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce';
import { useGetPosts, useSearchPost } from '@/lib/react-query/queries&mutations';
import { useEffect, useState } from 'react';
import { useInView } from "react-intersection-observer";



function Explore() {

// react intersection observer to observe element for smooth infinite scrolling and the ref at bottom
const {ref,inView}=useInView();


//  seacrh value setup with  a debounce
const [searchval, setSearchval] = useState('');
const debounceVal=useDebounce(searchval,500);

//  mutations===>
const{data:posts,fetchNextPage,hasNextPage,isLoading}=useGetPosts();

const {data:searchedPost,isFetching:isSearching}=useSearchPost(debounceVal);
    

useEffect(()=>{
 if(inView && !searchval) fetchNextPage
},[inView,searchval])



// if no posts are there show loader
  if(!posts || isLoading) {
    return <div className='flex-center w-full h-full'> <Loader/> </div>
  }

   
 
  // post showing logic if he is searching currently then not showing the post when he finished searching shows the post
  const  shouldShowSearchResults=searchval!=='';
  const shouldShowPosts=!shouldShowSearchResults && posts.pages.every((item)=>item?.documents.length===0)
  

  return (
    <div className='explore-container'>
        <div className="explore-inner_container">
          <h2 className='h3-bold md:h2-bold w-full'>
            Search Posts
          </h2>
          <div className='flex gap-1 px-4 w-full rounded-2xl bg-dark-4'>
              <img src="/assets/icons/search.svg" alt="search" 
              height={24} width={24}/>
              <Input
              type='text'
              placeholder='Search'
              className='explore-search'
              value={searchval}
              onChange={(e)=>setSearchval(e.target.value)}
              />
          </div>
        </div>
           
           <div className='flex-between w-full max-w-5xl mt-16 mb-8'>
                   <h3 className="body-bold md:h3-bold">Popular Today</h3>
                   <div className="flex-center gap-3 bg-dark-3 rounded-2xl px-4 py-2 cursor-pointer">
                    <p className='small=medium md:base-medium text-gray-300'>
                      All
                    </p>
                    <img src="/assets/icons/filter.svg" alt="filter" width={20} height={20}/>
                   </div>
           </div>

           <div className='flex flex-wrap gap-10 w-full max-w-5xl'>
           {shouldShowSearchResults ?(
            <SearchResults
            isSearching={isSearching}
            searchedPost={searchedPost}
            />
           ): shouldShowPosts?(
                     <p className='text-light-4 mt-10 text-center w-full'>End of Post</p>
           ): posts.pages.map((item,index)=>(
              <GridPostList key={index} posts={item.documents}/>
           ))}
           </div>

          {hasNextPage && !searchval && (
             <div ref={ref} className='mt-10' >
             <Loader/>

             </div>
          )} 
    </div>
  )
}

export default Explore