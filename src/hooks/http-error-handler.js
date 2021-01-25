import { useState, useEffect } from 'react';

const useHttpErrorHandler = (httpClient) => {
  const [error, setError] = useState(null);
  const requestInterceptor = httpClient.interceptors.request.use((req) => {
    setError(null);
    return req;
  });
  const responseInterceptor = httpClient.interceptors.response.use(
    (res) => res,
    (error) => {
      setError(error);
      console.error('WithErrorHandler: ', error);
      return Promise.reject(error);
    }
  );
  useEffect(() => {
    return () => {
      httpClient.interceptors.request.eject(requestInterceptor);
      httpClient.interceptors.response.eject(responseInterceptor);
    };
  }, [
    requestInterceptor,
    responseInterceptor,
    httpClient.interceptors.request,
    httpClient.interceptors.response,
  ]);

  const errorConfirmedHandler = () => {
    setError(null);
  };

  return [error, errorConfirmedHandler];
};

export default useHttpErrorHandler;
