import AWS from 'aws-sdk';
const s3 = new AWS.S3({ region: process.env.AWS_REGION });

function makeParams(bucket, keyPrefix, name, version) {
  return {
    Bucket:     bucket,
    Key:        `${keyPrefix}${name}/${version}.json`,
  };
}

export function read(bucket, keyPrefix, name, version, callback) {
  let params = makeParams(bucket, keyPrefix, name, version);
  console.log('s3.read', params);
  s3.getObject(params, (err, data) => {
    if (err) return callback(err);
    callback(null, JSON.parse(data.Body));
  });
}

export function write(bucket, keyPrefix, resource, version, callback) {
  let params          = makeParams(bucket, keyPrefix, resource.name, version);
  console.log('s3.write', params);
  params.ContentType  = 'application/json';
  params.Body         = JSON.stringify(resource, null, 2);
  s3.putObject(params, callback);
}
