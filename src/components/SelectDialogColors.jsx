import React from 'react';
import chroma from 'chroma-js';

const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.label);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? data.label
          : isFocused
          ? color.alpha(0.1).css()
          : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.label,
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor:
            !isDisabled && (isSelected ? data.label : color.alpha(0.3).css()),
        },
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.label);
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.label,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.label,
      ':hover': {
        backgroundColor: data.label,
        color: 'white',
      },
    }),
  };

  export default colourStyles;