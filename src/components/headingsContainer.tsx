import React, { useEffect, useState } from 'react';
import Headings from './headings';

export default () => {
  const [isVisible, setVisible] = useState(true);
  const [isFolding, setFolding] = useState(false);

  useEffect(() => {
    const eventReceiver = document.getElementById('toc-event-receiver');
    if (!eventReceiver) { return; }

    eventReceiver.addEventListener('actionClicked', () => {
      setVisible(visible => !visible);
    });
  }, []);

  const toggleFolding = () => { setFolding(prev => !prev); };

  return (
    <div id="toc-container" style={isVisible ? {} : { display: 'none' }}>
      {
        isFolding
          ? (<p><span className="clickable" onClick={toggleFolding}>[Expand]</span></p>)
          : (<>
            <p>
              <span className="clickable" onClick={toggleFolding}>[Fold]</span>
              <span className="clickable" onClick={() => setVisible(false)}>[Close]</span>
            </p>
          </>)
      }
      <div style={isFolding ? { display: 'none' } : {}}>
        <Headings />
      </div>
      <div id="toc-event-receiver"></div>
    </div>
  );
};