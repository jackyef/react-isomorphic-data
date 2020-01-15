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
