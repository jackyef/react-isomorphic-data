---
id: writing-tests
title: Writing Tests
sidebar_label: Writing Tests
---

`react-isomorphic-data` provides some utilities for writing tests for your React component. These utilies are published to `@react-isomorphic-data/testing` package.

## Installation

```sh
yarn add -D @react-isomorphic-data/testing
```

## Usage

`@react-isomorphic-data/testing` currently only has one export, `<MockedProvider>`. Simply wrap your component inside `<MockedProvider>` in your tests.

```javascript
import React from 'react';
import { MockedProvider } from '@react-isomorphic-data/testing';
import SearchInput from '../SearchInput';

test('that everything works', async () => {
  const mocks = [/* an array of your MockData here */];
  const { container } = render(
    <MockedProvider mocks={mocks}>
      <SearchInput />
    </MockedProvider>,
  );
});
```

A `MockData` is just an object with `request` and `response` key. An example of a `MockData` is as follow:
```javascript
const aMock = {
  request: {
    url: 'http://localhost:3000/some-rest-api',
    queryParams: {
      q: 'qweqwe',
    },
  },
  response: {
    message: 'This is a mocked API response for http://localhost:3000/some-rest-api?q=qweqwe',
  },
};
```

If you would like to mock an error response from the server, simply pass an `Error` instance as the response like so:
```javascript
const errorMock = {
  request: {
    url: 'http://localhost:3000/some-rest-api',
    queryParams: {
      q: 'qweqwe',
    },
  },
  response: new Error('an error occured!'),
};
```

> ⚠️ NOTE: Eventhough [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) can accept a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object as the first argument, testing with `MockedProvider` will only work when you pass an `url` string as the first argument to your hooks/HOCs.

## Example
Let's say we have this `<SearchInput>` component that use `useData` hook, and will fetch data based on the input value.

```javascript
import * as React from 'react';
import { useData } from 'react-isomorphic-data';

const SearchInput = () => {
  const [searchText, setSearchText] = React.useState('');
  const {
    data,
    error,
    loading,
  } = useData('http://localhost:3000/some-rest-api', {
    q: searchText,
  });

  return (
    <div data-testid="container">
      <input type="text" data-testid="search-input" onChange={(e) => setSearchText(e.target.value)} />
      {data ? <pre data-testid="data">{JSON.stringify(data, null, 2)}</pre> : null}
      {loading ? 'loading...' : null}
      {error ? <div data-testid="error">{error.message}</div> : null}
    </div>
  );
};

export default SearchInput;
```

This is how we might write our test (with `@testing-library/react`) for it:
```javascript
import React from 'react';
import { MockedProvider } from '@react-isomorphic-data/testing';
import {
  render,
  fireEvent,
  wait,
  queryByText,
  act,
  queryByTestId,
} from '@testing-library/react';
import SearchInput from '../SearchInput';

test('data loads, renders and updates correctly', async () => {
  const mocks = [
    {
      request: {
        url: 'http://localhost:3000/some-rest-api',
        queryParams: {
          q: '',
        },
      },
      response: {
        message: 'empty input',
        someRandomNumber: 123,
      },
    },
    {
      request: {
        url: 'http://localhost:3000/some-rest-api',
        queryParams: {
          q: 'foobar',
        },
      },
      response: {
        message: 'foobar input',
        someRandomNumber: 345,
      },
    },
    {
      request: {
        url: 'http://localhost:3000/some-rest-api',
        queryParams: {
          q: 'will-error',
        },
      },
      response: new Error('an error occured!'),
    },
  ];
  const { container, getByTestId, debug } = render(
    <MockedProvider mocks={mocks}>
      <SearchInput />
    </MockedProvider>,
  );

  // The `loading...` string is rendered inside the container
  expect(queryByText(container, 'loading...')).not.toBeNull(); // it is still loading

  // Wait for the mock data to be "fetched"
  await wait(); 
  // It's not longer loading, so the text is gone
  expect(queryByText(container, 'loading...')).toBeNull(); 
  // The first mock data is displayed
  expect(queryByTestId(container, 'data')?.innerHTML).toContain('123'); 

  // Update the input value to trigger re-fetch with different query param
  act(() => {
    const inputNode = getByTestId('search-input');
    fireEvent.change(inputNode, { target: { value: 'foobar' } });
  });

  // Now, it is loading again...
  expect(queryByText(container, 'loading...')).not.toBeNull(); 
  // So, no data is rendered
  expect(queryByTestId(container, 'data')).toBeNull(); 
  
  // Wait for the mock data to be "fetched"
  await wait(); 
  // It is not loading anymore
  expect(queryByText(container, 'loading...')).toBeNull(); 
  // Now, the second mock data is rendered
  expect(queryByTestId(container, 'data')?.innerHTML).toContain('345'); 

  act(() => {
    const inputNode = getByTestId('search-input');
    // Triggering request to "http://localhost:3000/some-rest-api?q=will-error
    // which will have a mocked error response
    fireEvent.change(inputNode, { target: { value: 'will-error' } }); 
  });

  // Now it is loading again...
  expect(queryByText(container, 'loading...')).not.toBeNull(); 
  // So, no data is rendered
  expect(queryByTestId(container, 'data')).toBeNull(); 

  // Wait for the mock data to be "fetched"
  await wait(); 
  // It is not loading anymore
  expect(queryByText(container, 'loading...')).toBeNull(); 
  // No data is rendered
  expect(queryByTestId(container, 'data')).toBeNull(); 
  // The error message is rendered
  expect(queryByTestId(container, 'error')).not.toBeNull(); 
  // Assert that the error message is same as our mocked error response
  expect(queryByTestId(container, 'error')?.innerHTML).toContain('an error occured!'); 
});

```

The comments inside the code snippet should be pretty self-explanatory. Hopefully this short guide will help you on how to write tests with `react-isomorphic-data`!

## Testing Lazy or non-GET datas
`react-isomorphic-data` does not have a way to automatically support this. For now, the recommendation is to assert whether the event handler (like click, scroll, etc.) is invoked/called already.

## Disclaimer
Testing is a field that I still have a lot to learn about. The current `MockedProvider` implementation might fail badly in your case. Feel free [open an issue](https://github.com/jackyef/react-isomorphic-data/issues) on the repo and I will see if I can help you.
