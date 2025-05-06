import React, { useState } from 'react';

const MultiSelect = ({ maxNumber, onSelect }) => {
  // Generate options array from 1 to maxNumber
  const options = Array.from({ length: maxNumber }, (_, index) => index + 1);

  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === options.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...options]);
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleApply = () => {
    onSelect(selectedItems);
  };

  return (
    <div className="multi-select-dropdown">
      <div className="dropdown-header">
        <button onClick={handleSelectAll}>
          {selectedItems.length === options.length ? 'Unselect All' : 'Select All'}
        </button>
        <button onClick={handleClearSelection}>Clear Selection</button>
      </div>
      <div className="dropdown-list">
        {options.map((item) => (
          <div key={item} className="dropdown-item">
            <input
              type="checkbox"
              id={item}
              checked={selectedItems.includes(item)}
              onChange={() => toggleItem(item)}
            />
            <label htmlFor={item}>{item}</label>
          </div>
        ))}
      </div>
      <div className="dropdown-footer">
        <button onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
};

export default MultiSelect;
