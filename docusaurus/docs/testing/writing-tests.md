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
  expect(queryByText(container, 'loading...')).not.toBeNull();

  // Wait for the mock data to be "fetched"
  await wait(); 
  // It's no longer loading, so the text is gone
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

Output: 🎉
```sh
PASS  src/components/__tests__/SearchInput.test.tsx
  ✓ data loads, renders and updates correctly (32ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.558s, estimated 1s
Ran all test suites.

Watch Usage: Press w to show more.
```

The comments inside the code snippet should be pretty self-explanatory. Hopefully this short guide will help you on how to write tests with `react-isomorphic-data`!

## Example #2 - Testing Lazy Data
Let's look at another example. Imagine we have a `<Button>` component that will only fetch data once it is clicked.

```javascript
import * as React from 'react';
import { useLazyData } from 'react-isomorphic-data';

const Button = () => {
  const [triggerLoad, { data, error, loading }] = useLazyData(
    'http://localhost:3000/some-rest-api',
    {
      q: 'button-click',
    },
  );

  return (
    <div data-testid="container">
      <button data-testid="button" onClick={() => triggerLoad()}>
        Click me
      </button>
      {data ? (
        <pre data-testid="data">{JSON.stringify(data, null, 2)}</pre>
      ) : null}
      {loading ? 'loading...' : null}
      {error ? <div data-testid="error">{error.message}</div> : null}
    </div>
  );
};

export default Button;
```

This is how the test might look like:
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
import Button from '../index';

test('data loads on click correctly', async () => {
  const mocks = [
    {
      request: {
        url: 'http://localhost:3000/some-rest-api',
        queryParams: {
          q: 'button-click',
        },
      },
      response: {
        message: 'why did you click the button',
        someRandomNumber: 123,
      },
    },
  ];
  const { container, getByTestId, debug } = render(
    <MockedProvider mocks={mocks}>
      <Button />
    </MockedProvider>,
  );

  
  // No `loading...` string, because the load is not triggered yet.
  expect(queryByText(container, 'loading...')).toBeNull();
  
  // Now, we trigger a click on the button
  act(() => {
    const button = getByTestId('button');
    fireEvent.click(button);
  });

  // It should show `loading...` string now.
  expect(queryByText(container, 'loading...')).not.toBeNull();
  // Wait for the mock data to be "fetched"
  await wait(); 
  // It's no longer loading, so the text is gone
  expect(queryByText(container, 'loading...')).toBeNull(); 
  // The mock data is now displayed
  expect(queryByTestId(container, 'data')?.innerHTML).toContain('why did you click the button'); 
});
```
Output: 🎉
```sh
PASS  src/components/SearchInput/__tests__/SearchInput.test.tsx
PASS  src/components/Button/__tests__/Button.test.tsx

Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.869s
Ran all test suites.

Watch Usage: Press w to show more.
```

## Testing non-GET data
Because non-GET data are not cached, `react-isomorphic-data` does not have a way to automatically support this. For now, the recommendation is to assert whether the event handler (like `onClick`, `onScroll`, etc.) is invoked/called already.

## Disclaimer
Testing is a field that I still have a lot to learn about. The current `MockedProvider` implementation might fail badly in your case. Feel free [open an issue](https://github.com/jackyef/react-isomorphic-data/issues) on the repo and I will see if I can help you.
