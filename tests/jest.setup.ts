import '@testing-library/jest-dom';
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: jest.fn(),
});
