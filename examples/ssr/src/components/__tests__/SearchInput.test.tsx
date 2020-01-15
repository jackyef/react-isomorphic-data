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
  ];
  const { container, getByTestId } = render(
    <MockedProvider mocks={mocks}>
      <SearchInput />
    </MockedProvider>,
  );
  const q = queryByText(container, 'loading...');

  expect(q).not.toBeNull(); // it is still loading

  await wait();

  expect(queryByText(container, 'loading...')).toBeNull(); // it's not longer loading, so the text is gone
  
  expect(queryByTestId(container, 'data')?.innerHTML).toContain('123'); // the first mock data is displayed

  act(() => {
    const inputNode = getByTestId('search-input');
    fireEvent.change(inputNode, { target: { value: 'foobar' } });
  });

  expect(queryByText(container, 'loading...')).not.toBeNull(); // it is loading again...
  expect(queryByTestId(container, 'data')).toBeNull(); // no data is rendered

  await wait();
  expect(queryByText(container, 'loading...')).toBeNull(); // it is not loading anymore
  expect(queryByTestId(container, 'data')?.innerHTML).toContain('345'); // the second data is rendered again
});
