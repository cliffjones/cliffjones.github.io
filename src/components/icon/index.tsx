import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faEdit,
  faEye,
  faKeyboard,
} from '@fortawesome/free-regular-svg-icons';
import {
  faAmazon,
  faFacebookF,
  faGithub,
  faGoodreadsG,
  faInstagram,
  faLinkedinIn,
  faMediumM,
  faPatreon,
  faQuora,
  faRedditAlien,
  faTumblr,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

import './index.scss';

function Icon({ name, hint = '', action = '', color = '' }) {
  const props: any = { className: `Icon Icon--${name}` };
  if (color) {
    props.className = `${props.className} Icon--${color}`;
  }

  if (hint) {
    props.title = hint;
  }

  if (typeof action === 'string' && action) {
    if (action.startsWith('/')) {
      // Use Router components for internal links.
      props.to = action;
    } else {
      props.href = action;
      if (action.startsWith('http')) {
        // Open external links in a new tab.
        props.target = '_blank';
      }
    }
  } else if (typeof action === 'function') {
    props.onClick = action;
  }

  if (name === 'amazon') {
    return <a {...props}><FontAwesomeIcon icon={faAmazon} /></a>;
  }

  if (name === 'eye') {
    return <NavLink {...props}><FontAwesomeIcon icon={faEye} /></NavLink>;
  }

  if (name === 'facebook') {
    return <a {...props}><FontAwesomeIcon icon={faFacebookF} /></a>;
  }

  if (name === 'github') {
    return <a {...props}><FontAwesomeIcon icon={faGithub} /></a>;
  }

  if (name === 'goodreads') {
    return <a {...props}><FontAwesomeIcon icon={faGoodreadsG} /></a>;
  }

  if (name === 'instagram') {
    return <a {...props}><FontAwesomeIcon icon={faInstagram} /></a>;
  }

  if (name === 'keyboard') {
    return <NavLink {...props}><FontAwesomeIcon icon={faKeyboard} /></NavLink>;
  }

  if (name === 'linkedin') {
    return <a {...props}><FontAwesomeIcon icon={faLinkedinIn} /></a>;
  }

  if (name === 'medium') {
    return <a {...props}><FontAwesomeIcon icon={faMediumM} /></a>;
  }

  if (name === 'note') {
    return <NavLink {...props}><FontAwesomeIcon icon={faEdit} /></NavLink>;
  }

  if (name === 'patreon') {
    return <a {...props}><FontAwesomeIcon icon={faPatreon} /></a>;
  }

  if (name === 'quora') {
    return <a {...props}><FontAwesomeIcon icon={faQuora} /></a>;
  }

  if (name === 'reddit') {
    return <a {...props}><FontAwesomeIcon icon={faRedditAlien} /></a>;
  }

  if (name === 'speech') {
    return <NavLink {...props}><FontAwesomeIcon icon={faComment} /></NavLink>;
  }

  if (name === 'tumblr') {
    return <a {...props}><FontAwesomeIcon icon={faTumblr} /></a>;
  }

  if (name === 'twitter') {
    return <a {...props}><FontAwesomeIcon icon={faTwitter} /></a>;
  }

  if (name === 'wattpad') {
    return <a {...props}></a>;
  }

  if (name === 'youtube') {
    return <a {...props}><FontAwesomeIcon icon={faYoutube} /></a>;
  }

  return <></>;
}

export default Icon;
