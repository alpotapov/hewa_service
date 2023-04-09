import React, { useState } from 'react';
import PropTypes from 'prop-types';

function FilterableList({ items, onSelectionChange, searchPlaceholder }) {
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedItems, setSelectedItems] = useState([]);

  const onSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    const filtered = items.filter((item) => item.toLowerCase().includes(searchValue.toLowerCase()));
    setFilteredItems(filtered);
  };

  const onCheckboxChange = (e, item) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((selected) => selected !== item));
    }
  };

  const clearSearch = () => {
    setSearch('');
    setFilteredItems(items);
  };

  React.useEffect(() => {
    onSelectionChange(selectedItems);
  }, [selectedItems, onSelectionChange]);

  return (
    <div>
      <div className="flex mb-2">
        <input
          className="w-full px-3 py-2 border rounded"
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={onSearchChange}
        />
        <button
          type="button"
          className="ml-2 px-3 py-2 bg-blue-500 text-white font-semibold rounded"
          onClick={clearSearch}
        >
          Clear
        </button>
      </div>
      <div className="h-60 overflow-y-scroll border rounded" style={{ maxHeight: '20rem' }}>
        {filteredItems.map((item) => (
          <div key={item} className="flex items-center mb-1">
            <input type="checkbox" id={item} onChange={(e) => onCheckboxChange(e, item)} />
            <label htmlFor={item} className="ml-2">
              {item}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

FilterableList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
};

FilterableList.defaultProps = {
  searchPlaceholder: 'Filter...',
};

export default FilterableList;
