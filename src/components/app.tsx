import React from 'react';
// import './App.css';
import { mainController } from '../controllers/mainController';

function App() {
	const { searchResult, queryString, queryPage, fn } = mainController();

	interface ISearchresult {
		webTitle: string,
		webPublicationDate: string,
		sectionName: string,
		fields: {
			thumbnail: string,
		}
		webUrl: string;
	}

	console.log(searchResult);

	return (
		<div className="App">
			<div className='searchBar'>
				<button onClick={() => fn.handleSearchString('page=1&', 'q=football&')}>fetch data</button>
			</div>
			<div className='searchResults'>
				{searchResult &&
					searchResult.map((result: ISearchresult, i: number) => {
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
								<img src={result.fields.thumbnail} alt={result.webTitle} />
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
						<div>{queryPage}</div>
						<button onClick={() => fn.decrementPage()}>previous page</button>
						<button onClick={() => fn.incrementPage()}>next page</button>
					</div>
				}
			</div>
		</div>
	);
}

export default App;