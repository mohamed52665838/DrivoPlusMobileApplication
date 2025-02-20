import { AxiosError } from 'axios';

const networkErrorTranslation = (e: AxiosError): string[] => {

  let errorMessage = ["An error occurred", "Please try again."];

  if (e.response) {
    switch (e.response.status) {
      case 400:
        errorMessage = ["Bad Request", "The server couldn't understand your request check your data please."];
        break;
      case 401:
        errorMessage = ["Unauthorized", "Please log in to access this resource."];
        break;
      case 403:
        errorMessage = ["Forbidden", "You don't have permission to access this resource."];
        break;
      case 404:
        errorMessage = ["Not Found", "The resource you are looking for does not exist."];
        break;
      case 500:
        errorMessage = ["Server Error", "Something went wrong on the server. Please try again later."];
        break;
      case 503:
        errorMessage = ["Service Unavailable", "The server is temporarily unavailable. Please try again later."];
        break;
      default:
        errorMessage = ['Unexpected Error', `${e.response.status} - Please try again later.`];
    }
  } else if (e.request) {
    errorMessage = ["Network Error","Please check your internet connection."];
  } else {
    errorMessage = ['Request Error', e.message];
  }

  return errorMessage;
};

export default networkErrorTranslation;
