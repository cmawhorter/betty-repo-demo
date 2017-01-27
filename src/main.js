import { read as s3Read, write as s3Write } from './lib/s3.js';
import processResourceJson from './lib/resource.js';

const BUCKET_ROOT_NAME  = 'central-internal-resource-registry';

export default {
  handler: (event, context, callback) => {
    let method      = event.method;
    let body        = event.body;
    let accountId   = context.invokedFunctionArn.split(':')[4];
    let bucket      = `${BUCKET_ROOT_NAME}-${accountId}`;
    let keyPrefix   = process.env.BUCKET_PREFIX;
    if (!keyPrefix) return callback(new Error('cannot continue because key prefix is not set'));
    console.log('Event', event);
    console.log('Bucket', bucket);
    console.log('Key Prefix', keyPrefix);
    switch (method) {
      case 'get':
        return s3Read(bucket, keyPrefix, body.name, body.version, callback);
      case 'publish':
        let data = processResourceJson(body);
        return s3Write(bucket, keyPrefix, data, 'latest', (err) => {
          if (err) return callback(err);
          s3Write(bucket, keyPrefix, data, null, callback);
        });
      default:
        return callback(new Error(`unsupported method: ${method}`));
    }
  }
}
