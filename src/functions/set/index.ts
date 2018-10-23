import redisClient from '../../utils/createRedisClient';
import createResponse from '../../utils/createResponse';
import { Context, Callback } from  'aws-lambda';

export function handler(event: any, context: Context, callback: Callback) {
    context.callbackWaitsForEmptyEventLoop = false;
    set(event.queryStringParameters.email, event.data, callback);
}

function set(email: string, data: any, callback: Callback) {
    const escapedString = JSON.stringify(data);
    function onSet(err, data) {
        let message;
        let response;

        if (err) {
            message = 'Error'
            response = createResponse({
                    body: {
                        message,
                        err,
                    },
                    statusCode: 500,
            })
            callback(response);
        }

        message = 'Success'
        response = createResponse({
            body: {
                message,
                data,
            }
        })
        callback(null, response);
    }
    redisClient.set(email, escapedString, onSet);
}