import AWS from 'aws-sdk';
const s3 = new AWS.S3({ region: process.env.AWS_REGION });

function versionKey(service, version) {
  return `${service}/${version}.json`;
}

function makeParams(bucket, keyPrefix, service, version) {
  let key = versionKey(service, version);
  return {
    Bucket:     bucket,
    Prefix:     `${keyPrefix}/${key}`,
  };
}

export function read(bucket, keyPrefix, service, version, callback) {
  let params = makeParams(bucket, keyPrefix, service, version);
  s3.getObject(params, callback);
}

export function write(bucket, keyPrefix, resource, callback) {
  let params          = makeParams(bucket, keyPrefix, resource.name, resource.version);
  params.ContentType  = 'application/json';
  params.Body         = JSON.stringify(resource, null, 2);
  s3.putObject(params, callback);
}
