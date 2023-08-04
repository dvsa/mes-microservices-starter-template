import { Response } from '../api/Response';

export const createResponse = <T>(
  body: T,
  statusCode = 200,
  reqHeaders: { [id: string]: string } = {},
): Response<T> => {
  const accessControlAllowOriginHeader = {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  };

  return {
    statusCode,
    headers: { ...accessControlAllowOriginHeader, ...reqHeaders },
    body: (body === null) ? null : JSON.stringify(body) as T,
  } as Response<T>;
};
