if (!global.BETTY) throw new Error('depends on betty context to be correct');

// some reusable values for the sake of laziness.  not required to do this.
const NAME      = 'central-internal-resource-registry';
const VERSION   = '0000-00-00';
const REGIONS   = [ 'us-west-2', 'us-east-1' ];

module.exports = {
  // which regions will have this resource available.  it mainly impacts the IAM policies
  // that are generated.  it does not impact update/deploy, which is manually controlled
  "region":           REGIONS,

  // required.  becomes the resource id in the registry as well as the lambda function name (if applicable)
  name:               NAME,
  // required.
  //   - for lambda services, this is a function alias
  //   - for not-lambda, this is the AWS api version for the service
  version:            VERSION,
  // same as package.json
  description:        'A central registry for internal microservices (resources).',
  // where the source code behind this resource.js(on) file lives
  // same as package.json
  repository: {
    type:             'git',
    url:              'git://github.com/cmawhorter/betty-repo-demo.git'
  },
  // same as package.json
  author: {
    name:             'Cory Mawhorter',
    email:            'cory.mawhorter@gmail.com',
    url:              'http://www.mawhorter.net/'
  },
  // also available are the following.  maintainers is highly recommended so in the event
  // there is a problem, you immediately know who you should be contacting to fix it
  // maintainers:
  // contributors:
  // if service is a lambda function, this is the lambda configuration to use
  configuration: {
    memory:             128,
    timeout:            15,
    source:             'src/main.js',
    main:               'dist/index.js',
    entry:              'index.handler',
    environment:        require(`${BETTY.cwd}/env-${BETTY.env}.json`)
  },
  // what aws services does this resource require internally?  and what permissions?
  // these get automatically added as inline policies to this resource's role
  // there also should (not required) be a directory called "provision" that contains
  // scripts that create these resources from scratch, if needed
  assets: [
    {
      service:          's3',
      name:             `${NAME}-${BETTY.aws.accountId}/*`,
      permissions:      [ 's3:GetObject', 's3:PutObject' ]
    }
  ],
  // this is turned into a managed policy that downstream resources will have added to their
  // respective roles.  if this resource had resources, it would also need their respective manage policies
  // added before it could use them
  policy: [
    {
      service:          'lambda',
      region:           REGIONS,
      // name:             `${NAME}:${VERSION}`, // would limit to a specific version of this resource
      name:             `${NAME}`,
      permissions:      [ 'lambda:InvokeFunction' ]
    },
  ],
  resources: {
    // if this resource had dependencies on other resources, they'd be listed here
    // similar to package.json, but not semver
    // 'some-image-processing-dependency': '*'
  },
  // if this resource will be used by other resources there should be an
  // npm-installable api client string here.  e.g. github repo
  // i.e. you should be able to `npm install require('resource.js').client --save`
  client:               'github:cmawhorter/betty-repo-demo-client',
  // there should be some way to monitor whether this resource is in a healthy
  // state or not.  ideally a website.
  // health: '',
  // there should be some way for you or your team to manage/admin this service without having
  // to write code.  ideally a website.
  // manage: '',
  // same as package.json.  it's up to your registry to implement tools for discovery
  // keywords: [],
};
