import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../handler';

describe('get handler', () => {
  describe('200', () => {
    it('should return appropriate status code with payload', async () => {
      // ARRANGE
      const ev = {} as APIGatewayProxyEvent;
      // ACT
      const resp = await handler(ev);
      // ASSERT
      expect(resp.body).toEqual(JSON.stringify({ data: 'some data' }));
      expect(resp.statusCode).toEqual(200);
    });
  });
});
