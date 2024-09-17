import { ports } from '../config/paths.json';

export function examplePreview(example) {
  return `http://localhost:${ports.app}/components/${example.replace(/^\/+|\/+$/g, '')}/preview`;
}
