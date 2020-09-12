import React from 'react';
import ReactHtmlParser from 'react-html-parser';

const Quill = ({ content }) => {
  return <div className="ql-editor">{ReactHtmlParser(content)}</div>;
};

export default Quill;
