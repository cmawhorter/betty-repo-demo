// this file can be resource.js or resource.json (with comments)

if (!global.betty) throw new Error('depends on betty context to be correct');

const NAME     = 'betty-demo-function';
const REGIONS  = [ 'us-west-2', 'us-east-1' ];

module.exports = {
  // which regions will have this resource available
  //   - in v1.x this did not impact update/deploy and instead mainly impacted the IAM policies
  //   - in v2.x this **does** impact update/deploy and replica functions will automatically get uploaded to the regions defined here
  region:             REGIONS,
  // regions: [], // v2.x alias for region
  // required.  the lambda function name
  name:               NAME,
  // optional. the lambda function description
  description:        'A demo function for betty lambda manager',
  // identify the repository for this project
  repository: {
    type:             'git',
    url:              'git://github.com/cmawhorter/betty-repo-demo.git'
  },
  // identify the primary author of this project
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
    runtime:            'nodejs12.x',
    source:             'src/main.js',
    main:               'dist/index.js',
    entry:              'index.handler',
    // if you're using resource.js (instead of resource.json) you can do this:
    environment:        require(`${betty.utils.cwd}/env.json`)
  },
  // what aws services does this resource require internally?  and what permissions?
  // these get automatically added as inline policies to this resource's role
  // there also should (not required) be a directory called "provision" that contains
  // scripts that create these resources from scratch, if needed
  assets: [
    // {
    //   service:          's3',
    //   name:             `${NAME}-${betty.aws.accountId}/*`,
    //   permissions:      [ 's3:GetObject', 's3:PutObject' ]
    // }
  ],
  // optional
  // if included, a policy will be automatically created for this service
  // that can be attached to consumers and give them the necessary permissions.
  // works automatically in conjunction with resources below
  policy: [
    {
      service:          'lambda',
      region:           REGIONS,
      name:             NAME,
      permissions:      [ 'lambda:InvokeFunction' ]
    },
    // you could also include other permissions unrelated to lambda
    // e.g. sqs queue instead of direct invoke
  ],
  // optional
  resources: {
    // other betty projects this service depends on.
    // including another service here will have the effect of attaching that
    // services policy to this service.
    // a side effect of the policy/resources relationship is you can build
    // a dependency tree for each service
    // 'some-image-processing-dependency': '*'
  },
  // if a client is available to simplify interacting with this service
  // it can be defined here. nothing is enforced here but it's recommended
  // to make this an npm-installable string
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
