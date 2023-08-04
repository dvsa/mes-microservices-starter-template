import { createResponse } from '../createResponse';

describe('createResponse', () => {
  it('should return a response object containing a body, headers and a statusCode', () => {
    const { body, headers, statusCode } = createResponse({});

    expect(body).toEqual(JSON.stringify({}));
    expect(headers).toEqual({ 'Access-Control-Allow-Origin': '*' });
    expect(statusCode).toEqual(200);
  });
});
