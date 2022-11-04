import React from 'react';

const Toolbar = ({
  isFolded,
  setFolded,
  setHidden,
}: {
  isFolded: boolean;
  setFolded: React.Dispatch<React.SetStateAction<boolean>>;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toggleFolded = () => {
    setFolded((prev) => !prev);
  };

  return (
    <div id="toc-toolbar">
      {isFolded ? (
        <span
          className="toc-clickable toc-icon-container"
          onClick={toggleFolded}
        >
          <img
            src={chrome.runtime.getURL('images/plus.png')}
            className="toc-icon"
          />
        </span>
      ) : (
        <span
          className="toc-clickable toc-icon-container"
          onClick={toggleFolded}
        >
          <img
            src={chrome.runtime.getURL('images/minus.png')}
            className="toc-icon"
          />
        </span>
      )}
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
};

export default Toolbar;
