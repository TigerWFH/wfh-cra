import React from 'react';

if (process.env.NODE_ENV === 'development') {
  // if (__DEV__) {
  console.log('wfh----');
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    logOnDifferentValues: true
  });
}
