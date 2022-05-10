import React, { useCallback, useEffect, useState } from 'react';

import './index.scss';

const BASE_CLASS = 'Image';
const LOADING_CLASS = `${BASE_CLASS}--loading`;

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  loader?: string;
}

// Adds a given class to a supplied props object.
function addClassName(props: any, className: string) {
  props.className = props.className ? `${props.className} ${className}` : className;
}

function Image({ loader, src, ...props }: ImageProps) {
  const [source, setSource] = useState(loader || src);
  const [loading, setLoading] = useState(!!loader);

  const onLoad = useCallback(() => {
    setSource(src);
  }, [src]);

  useEffect(() => {
    const image = document.createElement('img');
    image.src = src as string;
    image.addEventListener('load', onLoad);
    return () => {
      image.removeEventListener('load', onLoad);
      setLoading(false);
    };
  }, [src, onLoad]);

  addClassName(props, BASE_CLASS);
  if (loading) {
    addClassName(props, LOADING_CLASS);
  }

  return <img {...props} src={source} loading='lazy' />;
}

export default Image;
