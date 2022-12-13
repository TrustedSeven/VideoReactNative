import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

const MyView = (props) => {
  const { children, hide,} = props;
  if (hide) {
    return null;
  }
  return (
    <View style={{alignSelf:'flex-start'}}>
      { children }
    </View>
  );
};

MyView.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.element,
    ])),
  ]).isRequired,
  hide: PropTypes.bool,
};

export default MyView;