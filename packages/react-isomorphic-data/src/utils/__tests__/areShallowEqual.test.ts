import areShallowEqual from '../areShallowEqual';

describe('areShallowEqual tests', () => {
  it('Should test for shallow equality correctly', () => {
    expect(areShallowEqual({}, {})).toBe(true);
    expect(areShallowEqual({ foo: 'bar' }, { foo: 'bar' })).toBe(true);
    expect(areShallowEqual({ foo: 'bar' }, { foo: 'asd' })).toBe(false);
    expect(areShallowEqual({ foo: 'bar', bar: 'baz' }, { foo: 'bar' })).toBe(false);
    expect(areShallowEqual({ foo: 'bar' }, { foo: 'bar', baz: 'bar' })).toBe(false);
    expect(areShallowEqual({ foo: 'bar', bar: 'baz' }, { foo: 'bar', baz: 'bar' })).toBe(false);
    
    const anObject = {};
    expect(areShallowEqual({ foo: anObject }, { foo: anObject })).toBe(true);
    expect(areShallowEqual({ foo: anObject }, { foo: {} })).toBe(false);
  });

  it('Should use a new empty object if param is not provided', () => {
    expect(areShallowEqual()).toBe(true);
    expect(areShallowEqual({})).toBe(true);
    expect(areShallowEqual(undefined, {})).toBe(true);
  });
});