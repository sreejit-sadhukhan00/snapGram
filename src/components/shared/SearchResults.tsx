import { Models } from 'appwrite'
import { Loader } from 'lucide-react';
import GridPostList from './GridPostList';


type SearchResultsProps = {
  isSearching?: boolean,
  searchedPost?:Models.DocumentList<Models.Document>;
}


function SearchResults({ isSearching, searchedPost }: SearchResultsProps) {
  if (isSearching) return <Loader />

  if (searchedPost && searchedPost.documents.length > 0) {
    return (
      <GridPostList posts={searchedPost.documents} />
    )

  }
  return (
    <p className='text-light-4 mt-10 text-center w-full'>No Result Found</p>
  )
}

export default SearchResults