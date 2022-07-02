import { useEffect, useState } from "react"
import { httpGet } from "../modules/http"
import { cleanDate } from "../modules/stringaliser";

export const mainController = () => {
  // Query variables
  const baseString = 'https://content.guardianapis.com/search?';
  const additionalFields = 'show-fields=thumbnail&'
  const apiKey =  'api-key=617a606f-e0ce-4953-82f7-282f9145c6be'; // usually in .env but would require 3rd party library
  
  const [searchString, setSearchString] = useState<string>();
  const [queryString, setQueryString] = useState<string>();
  const [queryPage, setQueryPage] = useState<string>('page=1&');
  const [pagesAvailable, setPagesAvailable] = useState<number>();

  // Returned data
  const [searchResult, setSearchResult] = useState<any>();

  // Handle input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryString(`q=${e.target.value}&`);
  }
  

  // Build search string
  const submitSearch = () => {
    let fullString = baseString + queryPage + queryString + additionalFields + apiKey;

    // Allow empty searches
    if (queryString === undefined) {
      fullString = baseString + queryPage + additionalFields + apiKey;
    } else {
      fullString = baseString + queryPage + queryString + additionalFields + apiKey;
    }

    setSearchString(fullString);

    fetchData(fullString)
  }

  // Filter search
  const filterSearch = () => {
    console.log(searchString)
  }
  
  // Fetch news items
  const fetchData = async (fullString: string) => {
    console.log(fullString)
    const data = await httpGet(fullString);
    setSearchResult(data.response.results);
    setPagesAvailable(data.response.pages);
    //console.log(data.response.pages)
  }


  // Pagination

  // Construct page number
  const [purePageNumber, setPagePureNumber] = useState<number>();

  // Unpopular useEffect to prevent using state always being 1 render behind
  useEffect(() => {
      const removeString = queryPage.replace('page=', '');
      const currentPageNumber = removeString.replace('&', '');
      const pageNumber = parseInt(currentPageNumber)

      setPagePureNumber(pageNumber);
      
  }, [queryPage])

  console.log(purePageNumber);


  const incrementPage = () => {
    const newPageNumber = purePageNumber + 1;
    setQueryPage(`page=${newPageNumber}`)

    // Prevent navigating if no more pages available
    if ( newPageNumber < pagesAvailable) {
      setQueryPage(`page=${newPageNumber}&`)
    } else {
      setQueryPage(`page=${pagesAvailable}&`)
    }

    const nextPageQueryString =  `${baseString}page=${newPageNumber}&${queryString}${additionalFields}${apiKey}`;
    fetchData(nextPageQueryString)
  }

  const decrementPage = () => {
    let newPageNumber = purePageNumber - 1;

    // prevent negative page numbers
    if (newPageNumber < 1) {
      newPageNumber = 1
    }
    
    setQueryPage(`page=${newPageNumber}&`)

    const prevPageQueryString =  `${baseString}page=${newPageNumber}&${queryString}${additionalFields}${apiKey}`;
    fetchData(prevPageQueryString)
  }

  return {
    searchResult,
    queryString,
    queryPage,
    fn: {
      handleSearchInput,
      submitSearch,
      fetchData,
      filterSearch,
      cleanDate,
      incrementPage,
      decrementPage,
    }
  }
}