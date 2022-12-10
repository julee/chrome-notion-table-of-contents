import React from 'react';
import { createRoot } from 'react-dom/client';
import '../postcss/style.pcss';
import Container from './components/Container';
import { waitFor } from './utils';

const root = document.createElement('div');
root.className = 'toc-react-root';
document.body.appendChild(root);

const pageList = await waitFor('.notion-sidebar .notion-scroller');
const sidebar = pageList.parentNode;
if (!sidebar)
  throw new Error(
    "$('.notion-sidebar .notion-scroller').parentNode is not found",
  );
sidebar.insertBefore(root, pageList);

createRoot(root).render(<Container />);
