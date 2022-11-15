import React from 'react';
import { createRoot } from 'react-dom/client';
import Container from './components/container';

console.log('# mount');

const root = document.createElement('div');
document.body.appendChild(root);

createRoot(root).render(<Container />);
