import React from 'react';
import classNames from 'classnames';
import ReactSelect, {components} from 'react-select';
import { text } from '@fortawesome/fontawesome-svg-core';

const CustomSelectContainer = ({ children, ...props }) => {
    const { hasValue, selectProps } = props;
  
    return (
      <components.ValueContainer 
        {...props}
        className={classNames(
            "custom-select-container", 
            hasValue ? 'has-value' : '', 
            
        )}
    >
        <div 
            className={classNames(
                `placeholder ${hasValue ? 'has-value text-neutral-400' : ''}`,
                "uppercase tracking-xs"
            )}
        >
          {selectProps.placeholder}
        </div>
        {children}
      </components.ValueContainer>
    );
  };
  
  const customComponents = {
    ValueContainer: CustomSelectContainer,
  };
  
  const CustomSelect = (props) => {
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: '#1f1f1f',
            backgroundColor: state.isFocused ? '#f1f1f1' : state.isSelected ? '#dddddd' : '#ffffff',
        ':active': {
            backgroundColor: '#ffffff',
        },
            
        }),
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#e5e5e5' : props.isDisabled ? '#1f1f1f' : '#737373',
            background: '#1f1f1f',
            height: '4.8rem',
            boxShadow: props.isDisabled ? 'inset 0 0 2.4rem 0 rgba(255, 255, 255, .1)' : 'inset 0 0 2.4rem 0 rgba(255, 255, 255, .25), 0 0 2.4rem 0 rgba(0, 0, 0, .55)',
            color: props.isDisabled ? '#666666' : '#f1f1f1',
            borderRadius: '1rem',
            padding: '0 0 0 1.6rem',
        }),
        input: (styles, state) => ({
            ...styles,
            color: '#f1f1f1',
            display: 'inline-flex',
        }),
        placeholder: () => ({ display: "none" }),
        singleValue: (styles) => ({ 
            ...styles, 
            fontFamily: 'Bungee',
            color: '#f1f1f1',
            margin: '0',
        }),
        valueContainer: base => ({
            ...base,
            overflow: 'visible',
            padding: '0',
        }),
        indicatorSeparator: () => ({ display: "none" }),
    }
    return (
      <ReactSelect
        {...props}
        components={customComponents}
        styles={customStyles} 
      />
    );
};

export const ReactSelectComponent = (props) => {
    const { className, ...rest } = props;
    
    return (
        <CustomSelect
            {...rest}
            className={classNames(className, `custom-select`)}
        />
    );
}