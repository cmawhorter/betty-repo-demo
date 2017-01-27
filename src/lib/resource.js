
const WHITELIST = [
  'region',
  'name',
  'description',
  'repository',
  'author',
  'contributors',
  'maintainers',
  'policy',
  'resources',
  'client',
  'health',
  'manage',
  'keywords',
];

export default function (resourceJson) {
  let obj = {};
  WHITELIST.forEach(key => {
    if (resourceJson.hasOwnProperty(key)) {
      obj[key] = resourceJson[key];
    }
  });
  return obj;
}
