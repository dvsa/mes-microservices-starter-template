import createResponse from '../createResponse';
import { IResponse } from '../../interfaces/IResponse';

describe('createResponse', () => {
  it('should create a response with 200 status code when no status code is specified', () => {
    const response: IResponse = createResponse(null);
    expect(response.statusCode).toBe(200);
  });
});
