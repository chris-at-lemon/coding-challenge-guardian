import React from 'react';
// import './App.css';
import { mainController } from '../controllers/mainController';
import { IPrevious, IResultsArray } from '../interfaces/main';

function App() {
	const { searchResult, queryString, queryPage, purePageNumber, pagesAvailable, previousSearches, fn } = mainController();

	return (
		<div className="App">
			<div className='wrapper'>
				<div className='header'>
					<h1>Welcome to EnjoyHQ News</h1>
				</div>
				<div className='searchBar'>
					<div className='mainSearch'>
						<input
							type='text'
							onChange={(e) => fn.handleSearchInput(e)}
							placeholder="search for anything"
						/>
						<button className='btn-primary' onClick={() => fn.submitSearch()}>search news</button>
					</div>
				</div>
				{searchResult &&
					<>
						<div className='resultsTreatment'>
							<div className='filterSection'>
								<input
									type='text'
									onChange={(e) => fn.handleSectionFilterInput(e)}
									placeholder="e.g. Football"
								/>
								<button className='btn-primary' onClick={() => fn.filterBySection()}>filter by section</button>
							</div>
							<div className='filterDate'>
								<button className='btn-primary' onClick={() => fn.filterByDate('from')}>from date</button>
								<input
									type='text'
									onChange={(e) => fn.handleDateFilterInput(e)}
									placeholder="e.g.: 2022-07-01"
								/>
								<button className='btn-primary' onClick={() => fn.filterByDate('to')}>to date</button>
							</div>
							<div className='orderBy'>
								<select onChange={(e) => fn.handleOrderByInput(e)}>
									<option>Please select</option>
									<option value='order-by=oldest&'>Order by oldest</option>
									<option value='order-by=newest&'>Order by newest</option>
									<option value='order-by=relevance&'>Order by relevance</option>
								</select>
								<button className='btn-primary' onClick={() => fn.orderBy()}>order by</button>
							</div>
						</div>
						<div className='previousSearches'>
							<h2>Search History</h2>
							<ul>
								{previousSearches &&
									previousSearches.map((search: IPrevious, i: number) => {
										return (
											<li key={i}>
												{search.query ? <><strong>Search term:</strong> {search.query}</> : 'No query specified'}
												{' | '}
												
												{search.orderBy ? search.orderBy + ' | ' : ''}

												{search.filteredByDate ? search.filteredByDate + ' | ' : ''}

												{search.filteredBySection ? `Section:  ${search.filteredBySection}` + ' | ' : ''}

												<span onClick={() => { fn.fetchData(search.searchString), fn.setQueryString(`q=${search.query}&`) }} className='fakeLink'>repeat this search &gt;</span>
											</li>
										)
									})}
							</ul>
							<div className='historyTreatment'>
								<button className='btn-success' onClick={() => fn.saveSearchHistory()}>save to search history</button>
								<button className='btn-primary my-1rem' onClick={() => fn.restoreSearchHistory()}>restore search history</button>
								<button className='btn-danger' onClick={() => fn.clearSearchHistory()}>clear search history</button>
							</div>
						</div>
					</>
				}
				<hr />
				<div className='searchResults'>
					{searchResult &&
						searchResult.map((result: IResultsArray, i: number) => {
							return (
								<div key={i} className='card'>
									<div className='newsTitle'>
										<strong>{result.webTitle}</strong>
									</div>
									<div className='thumbAndDetails'>
										<div className='newsThumb'>
											{result.fields?.thumbnail ?
												<img src={result.fields?.thumbnail} alt={result.webTitle} />
												:
												<img src='https://via.placeholder.com/500x300?text=No+image+available' alt={result.webTitle} />
											}
										</div>
										<div className='dateAndSection'>
											<div className='newsDate'>
												{fn.cleanDate(result.webPublicationDate)}
											</div>
											<div className='newsSection'>
												{result.sectionName}
											</div>
										</div>
									</div>
									<div className='readMore'>
										<a href={result.webUrl} target='_blank'>read more &rarr;</a>
									</div>
								</div>
							)
						}
						)
					}
				</div>
				{searchResult &&
					<div className='navigation'>
						<div>Page {purePageNumber} of {pagesAvailable}</div>
						<button className='btn-primary' onClick={() => fn.decrementPage()}>&lt; previous page</button>
						{' '}
						<button className='btn-primary' onClick={() => fn.incrementPage()}>next page &gt;</button>
					</div>
				}
			</div>
		</div>
	);
}

export default App;