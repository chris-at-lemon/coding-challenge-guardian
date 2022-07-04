import { useEffect, useState } from "react"
import { httpGet } from "../modules/http"
import { cleanDate } from "../modules/stringaliser";
import { IPrevious, IResultsArray } from "../interfaces/main";

export const mainController = () => {
	////// Variables //////

	// Query variables
	const baseString = 'https://content.guardianapis.com/search?';
	const additionalFields = 'show-fields=thumbnail&'
	const apiKey = 'api-key=617a606f-e0ce-4953-82f7-282f9145c6be'; // usually in .env but would require 3rd party library

	const [searchString, setSearchString] = useState<string>();
	const [query, setQuery] = useState<string>();
	const [queryString, setQueryString] = useState<string>('');
	const [queryPage, setQueryPage] = useState<string>('page=1&');
	const [queryFilter, setQueryFilter] = useState<string>('');

	// Filter results
	const [sectionFilterString, setSectionFilterString] = useState<string>();
	const [dateFilterString, setDateFilterString] = useState<string>();
	const [dateFilterLabel, setDateFilterLabel] = useState<string>('');


	// Order results
	const [resultsOrder, setResultsOrder] = useState<string>('');
	const [resultsOrderLabel, setResultsOrderLabel] = useState<string>('');

	// Returned data
	const [searchResult, setSearchResult] = useState<IResultsArray[]>();
	const [pagesAvailable, setPagesAvailable] = useState<number>();

	// Previous searches
	const [previousSearches, setPreviousSearches] = useState<IPrevious[]>([]);


	////// Handlers //////
	
	// Handle search input
	const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQueryString(`q=${e.target.value}&`);
		setQuery(e.target.value);
	}

	// Build search string
	const submitSearch = () => {
		let fullString = baseString + queryPage + queryString + additionalFields + apiKey;

		// add to previous searches
		previousSearches.push({searchString: fullString, query: query})
		setPreviousSearches(previousSearches)

		setSearchString(fullString);
		fetchData(fullString)
	}

	// Filter by section
	const handleSectionFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSectionFilterString(e.target.value);
	}

	const filterBySection = () => {
		// To filter just the current result
		const filteredResult = searchResult.filter((newsItem: {sectionName: string}) => {
		   return (
		     newsItem.sectionName === sectionFilterString 
		   )
		 });
		setSearchResult(filteredResult);

		// To filter by section - always returns empty array, the endpoint has a different use

		// const sectionFilter = `section=${sectionFilterString}&`

		// const filteredResult = baseString + sectionFilter + queryPage + queryString + additionalFields + apiKey;
		// fetchData(filteredResult)
	}

	// Filter by date
	const handleDateFilterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDateFilterString(e.target.value);
	}

	const filterByDate = (dateParam: string) => {
		// To filter just the current result
		//
		// console.log('date', dateFilterString)
		// const filteredResult = searchResult.filter((newsItem: {webPublicationDate: string}) => {
		//   return (
		//     cleanDate(newsItem.webPublicationDate) === dateFilterString
		//   )
		// });

		// setSearchResult(filteredResult);

		// To filter all results

		// Type of filter and its label
		let dateFilter;
		let filterLabel;

		if (dateParam === 'from') {
			dateFilter = `from-date=${dateFilterString}&`;
			filterLabel = `from date ${dateFilterString}`;
		}
		if (dateParam === 'to') {
			dateFilter = `to-date=${dateFilterString}&`;
			filterLabel = `to date ${dateFilterString}`;
		}

		const filteredResultQueryString = baseString + queryPage + dateFilter + queryString + additionalFields + apiKey;

		// add to previous searches
		previousSearches.push({ searchString: filteredResultQueryString, query: query, orderBy: resultsOrderLabel ,filteredBy: filterLabel });
		setPreviousSearches(previousSearches);
		setDateFilterLabel(filterLabel)

		setQueryFilter(dateFilter);
		fetchData(filteredResultQueryString);
	}

	// Order by
	const handleOrderByInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setResultsOrder(e.target.value);
	}

	const orderBy = () => {
		//console.log(resultsOrder);
		const orderByQueryString = `${baseString}${queryPage}&${queryString}${queryFilter}${additionalFields}${resultsOrder}${apiKey}`;

		// Declare label for order method
		const orderString = resultsOrder;
		let orderLabel;
		switch (orderString) {
			case 'order-by=oldest&':
				orderLabel = 'Ordered by oldest first';
				break;
			case 'order-by=newest&':
				orderLabel = 'Ordered by newest first';
				break;
			case 'order-by=relevance&':
				orderLabel = 'Ordered by most relevant first';
				break;
			default:
				orderLabel = 'Unordered';
		}

		// add to previous searches
		previousSearches.push({ searchString: orderByQueryString, query: query, orderBy: orderLabel, filteredBy: dateFilterLabel });
		setPreviousSearches(previousSearches);
		setResultsOrderLabel(orderLabel);

		fetchData(orderByQueryString)
	}

	// Fetch news items
	const fetchData = async (fullString: string) => {
		console.log(fullString)
		const data = await httpGet(fullString);
		console.log(data.response.results)

		const results = data.response.results;

		setSearchResult(data.response.results);
		setPagesAvailable(data.response.pages);
		//console.log(data.response.pages)
	}

	// Search history
	const saveSearchHistory = () => {
		localStorage.setItem('searchHistory', JSON.stringify(previousSearches));
	}

	const restoreSearchHistory = () => {
		const savedSearchHistory = localStorage.getItem('searchHistory');
		const parsedSearchHistory = JSON.parse(savedSearchHistory);

		setPreviousSearches(parsedSearchHistory);
	}

	const clearSearchHistory = () => {
		localStorage.removeItem('searchHistory');
		setPreviousSearches([])
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

	//console.log(purePageNumber);


	const incrementPage = () => {
		let newPageNumber = purePageNumber + 1;
		setQueryPage(`page=${newPageNumber}&`)

		// Prevent navigating if no more pages available
		if (newPageNumber === pagesAvailable || newPageNumber > pagesAvailable) {
			newPageNumber = pagesAvailable;
			setQueryPage(`page=${pagesAvailable}&`)
		}

		console.log(resultsOrder)

		const nextPageQueryString = `${baseString}page=${newPageNumber}&${queryString}${queryFilter}${additionalFields}${resultsOrder}${apiKey}`;
		fetchData(nextPageQueryString)
	}

	const decrementPage = () => {
		let newPageNumber = purePageNumber - 1;

		// prevent negative page numbers
		if (newPageNumber < 1) {
			newPageNumber = 1
		}

		setQueryPage(`page=${newPageNumber}&`)

		const prevPageQueryString = `${baseString}page=${newPageNumber}&${queryString}${queryFilter}${additionalFields}${resultsOrder}${apiKey}`;
		fetchData(prevPageQueryString)
	}

	return {
		searchResult,
		queryString,
		queryPage,
		purePageNumber,
		pagesAvailable,
		previousSearches,
		fn: {
			handleSearchInput,
			setQueryString,
			submitSearch,
			handleSectionFilterInput,
			handleDateFilterInput,
			handleOrderByInput,
			orderBy,
			fetchData,
			filterBySection,
			filterByDate,
			cleanDate,
			incrementPage,
			decrementPage,
			saveSearchHistory,
			restoreSearchHistory,
			clearSearchHistory
		}
	}
}