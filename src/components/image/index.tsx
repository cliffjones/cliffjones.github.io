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
    setLoading(false);
    setSource(src);
  }, [src]);

  useEffect(() => {
    const image = document.createElement('img');
    image.addEventListener('load', onLoad);
    image.src = src as string;
    return () => {
      image.removeEventListener('load', onLoad);
    };
  }, [src, onLoad]);

  const newProps = { ...props };
  addClassName(newProps, BASE_CLASS);
  if (loading) {
    addClassName(newProps, LOADING_CLASS);
  }

  return <img {...newProps} src={source} loading='lazy' />;
}

export default Image;
