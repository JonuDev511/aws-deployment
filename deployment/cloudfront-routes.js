// Optional CloudFront Function for an S3 REST origin, on viewer-request.
// S3 website hosting already resolves the emitted directory index pages.
function handler(event) {
  var request = event.request;
  var path = request.uri.replace(/\/+$/, '') || '/';
  if (path === '/story' || path === '/process') request.uri = path + '/index.html';
  return request;
}
