import * as supertest from 'supertest';
import { startSlsOffline, stopSlsOffline } from './helpers/integration-test-lifecycle';
import { ExaminerWorkSchedule } from '../src/common/domain/Journal';

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

  it('should respond 200 for a journal that exists', (done) => {
    request
      .get('/journals/01234567/personal')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        const response: ExaminerWorkSchedule = res.body;
        expect(response.staffNumber).toBe('01234567');
        // @ts-ignore
        expect(response.testSlots.length).toBe(6);
        done();
      });
  });

  it('should respond 404 for a journal that does not exist', (done) => {
    request
      .get('/journals/00000000/personal')
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });
});
