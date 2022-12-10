import React from 'react';

export default function Toolbar({
  setHidden,
}: {
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="toc-toolbar">
      <span
        className="toc-clickable toc-icon-container"
        onClick={() => setHidden(true)}
      >
        <img
          src={chrome.runtime.getURL('images/cross.png')}
          className="toc-icon"
        />
      </span>
    </div>
  );
}
