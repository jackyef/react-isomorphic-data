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
