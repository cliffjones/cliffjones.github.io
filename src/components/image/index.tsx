import React, { useCallback, useEffect, useState } from 'react';

import './index.scss';

const BASE_CLASS = 'Image';
const LOADING_CLASS = `${BASE_CLASS}--loading`;

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  loader?: string;
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
  newProps.className = newProps.className ? `${newProps.className} ${BASE_CLASS}` : BASE_CLASS;
  if (loading) {
    newProps.className = `${newProps.className} ${LOADING_CLASS}`;
  }

  return <img alt='' {...newProps} src={source} loading='lazy' />;
}

export default Image;
