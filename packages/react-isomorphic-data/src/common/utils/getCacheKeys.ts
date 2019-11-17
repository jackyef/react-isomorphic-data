// `http://localhost:3000/some-rest-api/99`;
// => ["http:", "localhost:3000", "some-rest-api", "99"]
// `http://localhost:3000/some-rest-api/99?foo=bar&baz=lol`;
// => ["http:", "localhost:3000", "some-rest-api", "99?foo=bar&baz=lol"]

const getCacheKeys = (url: string): string[] => {
  return url.split('/').filter(Boolean);
}

export default getCacheKeys;
