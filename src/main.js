import { read as s3Read, write as s3Write } from './lib/s3.js';

const BUCKET_ROOT_NAME  = 'central-internal-resource-registry';

export default {
  handler: (event, context, callback) => {
    let method      = event.method;
    let body        = event.body;
    let accountId   = context.invokedFunctionArn.split(':')[4];
    let bucket      = `${BUCKET_ROOT_NAME}-${accountId}`;
    let keyPrefix   = process.env.BUCKET_PREFIX;
    switch (method) {
      case 'get':
        return s3Read(bucket, keyPrefix, body.service, body.version, callback);
      case 'publish':
        return s3WriteVersion(bucket, keyPrefix, body, callback);
      default:
        return callback(new Error(`unsupported method: ${method}`));
    }
  }
}
