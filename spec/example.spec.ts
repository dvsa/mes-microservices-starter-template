import * as supertest from 'supertest';
import { startSlsOffline, stopSlsOffline } from './helpers/integration-test-lifecycle';
import { ExaminerWorkSchedule } from '../src/common/domain/Schema';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

const request = supertest('http://localhost:3000');

describe('integration test', () => {
  beforeAll((done) => {
    startSlsOffline((err: any) => {
      if (err) {
        console.error(err);
        fail();
      }
      done();
    });
  });
  afterAll(() => {
    stopSlsOffline();
  });

  it('should respond 200 for an item that exists', (done) => {
    request
      .get('/template/01234567/get')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        const response: ExaminerWorkSchedule = res.body.journal;
        expect(response.staffNumber).toBe('01234567');
        // @ts-ignore
        expect(response.testSlots.length).toBe(6);
        done();
      });
  });

  it('should respond 404 for an item that does not exist', (done) => {
    request
      .get('/template/00000000/get')
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });
});
