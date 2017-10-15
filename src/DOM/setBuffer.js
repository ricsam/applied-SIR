import { width, height } from 'Config/bufferSize.js';

if (document.body) {
  const buffer = document.createElement('canvas');
  buffer.id = 'buffer';
  buffer.width = width;
  buffer.height = height;
  document.body.appendChild(buffer);
}
