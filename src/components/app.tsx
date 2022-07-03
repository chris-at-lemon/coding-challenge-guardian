import React from 'react';
// import './App.css';
import { mainController } from '../controllers/mainController';
import { IPrevious, IResultsArray } from '../interfaces/main';

function App() {
	const { searchResult, queryString, queryPage, purePageNumber, pagesAvailable, previousSearches, fn } = mainController();

	//console.log(searchResult);

	return (
		<div className="App">
			<div className='searchBar'>
				<input 
					type='text' 
					onChange={(e) => fn.handleSearchInput(e)}
				/>
				<button onClick={() => fn.submitSearch()}>fetch data</button>
				
				<input 
					type='text' 
					onChange={(e) => fn.handleSectionFilterInput(e)}
				/>
				<button onClick={() => fn.filterBySection()}>filter by section</button>
				
				<button onClick={() => fn.filterByDate('from')}>from date</button>
				<input 
					type='text' 
					onChange={(e) => fn.handleDateFilterInput(e)}
				/>
				<button onClick={() => fn.filterByDate('to')}>to date</button>
				
				<select onChange={(e) => fn.handleOrderByInput(e)}>
					<option>Please select</option>
					<option value='order-by=oldest&'>Order by oldest</option>
					<option value='order-by=newest&'>Order by newest</option>
					<option value='order-by=relevance&'>Order by relevance</option>
				</select>
				<button onClick={() => fn.orderBy()}>order by</button>
			</div>
			<div className='previousSearches'>
				<h2>Search History</h2>
				<ul>
				{previousSearches.map((search: IPrevious, i: number) => {
					return (
						<li key={i}>
							{search.query ? `Search term: ${search.query}` : 'No query specified'}, 
							{search.orderBy ? search.orderBy : ''},
							{search.filteredBy ? search.filteredBy : ''}
							<span onClick={() => {fn.fetchData(search.searchString), fn.setQueryString(`q=${search.query}&`)}} className='fakeLink'>repeat this search &gt;</span>
						</li>
					)
				})}
				</ul>
			</div>
			<div className='searchResults'>
				{searchResult &&
					searchResult.map((result: IResultsArray, i: number) => {
						return (
							<div key={i} className='card'>
								<div className='newsTitle'>
									{result.webTitle}
								</div>
								<div className='newsDate'>
									{fn.cleanDate(result.webPublicationDate)}
								</div>
								<div className='newsSection'>
									{result.sectionName}
								</div>
								<div className='newsThumb'>
								<img src={result.fields?.thumbnail} alt={result.webTitle} />
								</div>
								<div className='readMore'>
									<a href={result.webUrl} target='_blank'>read more &rarr;</a>
									</div>
							</div>
						)
					}
					)
				}
				{searchResult &&
					<div className='navigation'>
						<div>Page {purePageNumber} of {pagesAvailable}</div>
						<button onClick={() => fn.decrementPage()}>previous page</button>
						<button onClick={() => fn.incrementPage()}>next page</button>
					</div>
				}
			</div>
		</div>
	);
}

export default App;