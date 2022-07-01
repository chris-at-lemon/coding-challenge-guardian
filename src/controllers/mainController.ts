import { useState } from "react"
import { httpGet } from "../modules/http"
import { cleanDate } from "../modules/stringaliser";

export const mainController = () => {
  const baseString = 'https://content.guardianapis.com/search?';
  const apiKey =  'api-key=617a606f-e0ce-4953-82f7-282f9145c6be';

  const [searchResult, setSearchResult] = useState<any>();
  const [searchString, setSearchString] = useState<string>();
  const [queryString, setQueryString] = useState<string>();
  const [queryPage, setQueryPage] = useState<string>();
  console.log(queryPage);
  

  const handleSearchString = (page?: string, searchParams?: string) => {
    let queryString = '';
    if (searchParams) {
      queryString = searchParams;
      setQueryString(searchParams);
    }

    let queryPage = ''
    if (page) {
      queryPage = page;
      setQueryPage(page)
    }
      
    let fullString = baseString + page + queryString + apiKey;
    setSearchString(fullString);

    fetchData(fullString)
  }
  
  const fetchData = async (fullString: string) => {
    const data = await httpGet(fullString);
    setSearchResult(data.response.results);
    //console.log(data)
  }
  
  const incrementPage = () => {
    const removeString = queryPage.replace('page=', '');
    const currentPageNumber = removeString.replace('&', '');
    const newPageNumber =  parseInt(currentPageNumber) + 1;
    setQueryPage(`page=${newPageNumber}`)

    const nexPageQueryString =  `${baseString}page=${newPageNumber}&${queryString}${apiKey}`;
    fetchData(nexPageQueryString)
  }

  return {
    searchResult,
    queryString,
    queryPage,
    fn: {
      handleSearchString,
      fetchData,
      cleanDate,
      incrementPage
    }
  }
}