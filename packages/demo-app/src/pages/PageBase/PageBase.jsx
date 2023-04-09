import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSubnavigation } from '../../contexts/SubnavigationContext';

function PageBase({ children }) {
  const { subnavigation } = useSubnavigation();
  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <ul className="flex space-x-4 text-white">
            <li>
              <Link to="/dxreader-demo">DxReader Demo</Link>
            </li>
            <li>
              <Link to="/questionnaires">Questionnaires</Link>
            </li>
            <li>
              <Link to="/data-request">Data Requests</Link>
            </li>
          </ul>
        </div>
      </nav>
      {subnavigation.length > 0 && (
        <nav className="bg-gray-700">
          <div className="container mx-auto px-4 py-2">
            <ul className="flex space-x-4 text-white">
              {subnavigation.map((item) => (
                <li key={item.path}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
}

PageBase.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageBase;
