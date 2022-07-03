export const httpGet = async (url: string, header: any = {}) => {
  try {
    const response = await fetch(url);
    //console.log(response);
    const data = await response.json();
    //console.log(data);

    return data;

  } catch (error: any) {
    //console.error('Yikes!', error);
    return error;
  }
};

// Preferred: HTTP calls method with Axios

// export const httpGet = async (url: string, header: any = {}) => {
//   try {
//     const response = await axios.default.get(url, header);

//     const responseData = {
//       isValid: true,
//       statusCode: response.status,
//       message: response.statusText,
//       response: response.data,
//     };

//     return responseData;
//   } catch (error: any) {
//     const message = error?.response?.data?.hasOwnProperty('message')
//       ? error.response.data.message
//       : error.response?.statusText;
//     const responseData = {
//       isValid: false,
//       statusCode: error.response?.status,
//       message: message,
//       response: error.response?.data,
//     };
//     return responseData;
//   }
// };