export interface IResultsArray {
  apiUrl: string,
  fields: {thumbnail: string},
  id: string,
  isHosted: boolean,
  pillarId: string,
  pillarName: string,
  sectionId: string,
  sectionName: string,
  type: string,
  webPublicationDate: string,
  webTitle: string,
  webUrl: string
};

export interface IPrevious {
  searchString: string,
  query?: string,
  orderBy?: string,
  filteredBy?: string
};