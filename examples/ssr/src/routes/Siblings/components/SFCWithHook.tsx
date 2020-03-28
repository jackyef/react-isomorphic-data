import * as React from 'react';
import { useData } from 'react-isomorphic-data';

const SFCWithHook: React.SFC<{ id: number; raw?: boolean }> = ({
  id,
  raw = false,
}) => {
  const { data, loading, refetch } = useData(
    `http://localhost:3000/some-rest-api/8-24-siblings-${id}`,
    {},
    {}, // options that can be accepted by the native `fetch` API
    {
      // additional options
      ssr: true,
      fetchPolicy: 'cache-first',
      raw,
    },
  );

  console.log({ id, data, loading, raw });

  return (
    <>
      <h1>
        SFCWithHook, id: {id} raw: {String(raw)}{' '}
        <button onClick={refetch}>Refetch</button>
      </h1>
      {data ? (raw ? data : data.randomNumber) : 'loading...'}
      {String(loading)}
    </>
  );
};

// @ts-ignore
SFCWithHook.whyDidYouRender = true;

export default SFCWithHook;
