const createPrefetchTags = (shouldBePrefetched: Record<string, boolean>): string => {
  let output = '';
  
  Object.keys(shouldBePrefetched).forEach((url: string): void => {
    output += `<link rel="prefetch" href="${url}" />`;
  });

  return output;
};

export default createPrefetchTags;
