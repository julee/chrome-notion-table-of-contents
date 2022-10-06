import React, { useEffect, useState } from 'react';
import Headings from './headings';
import Toolbar from './toolbar';

export default () => {
  const [isHidden, setHidden] = useState(false);
  const [isFolded, setFolded] = useState(false);

  useEffect(() => {
    const eventReceiver = document.getElementById('toc-event-receiver');
    if (!eventReceiver) { return; }

    eventReceiver.addEventListener('toggleVisibility', () => setHidden(visible => !visible));
  }, []);

  return (
    <div id="toc-container" style={isHidden ? { display: 'none' } : {}}>
      <Toolbar isFolded={isFolded} setFolded={setFolded} setHidden={setHidden} />
      <div style={isFolded ? { display: 'none' } : {}}>
        <Headings />
      </div>
      <div id="toc-event-receiver"></div>
    </div>
  );
};