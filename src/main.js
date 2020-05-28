const handler = async (event, context) => {
  console.log('event', event);
  return `Hello world! ${new Date().toISOString()}`;
};

export default { handler };
