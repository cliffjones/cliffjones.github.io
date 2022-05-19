import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faEdit,
  faEye,
  faKeyboard,
  faLightbulb,
  faStar,
  faUser,
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
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faAmazon} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faAmazon} /></span>;
  }

  if (name === 'eye') {
    return <NavLink {...props}><FontAwesomeIcon icon={faEye} /></NavLink>;
  }

  if (name === 'facebook') {
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faFacebookF} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faFacebookF} /></span>;
  }

  if (name === 'github') {
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faGithub} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faGithub} /></span>;
  }

  if (name === 'goodreads') {
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faGoodreadsG} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faGoodreadsG} /></span>;
  }

  if (name === 'instagram') {
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faInstagram} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faInstagram} /></span>;
  }

  if (name === 'keyboard') {
    return <NavLink {...props}><FontAwesomeIcon icon={faKeyboard} /></NavLink>;
  }

  if (name === 'lightbulb') {
    return <NavLink {...props}><FontAwesomeIcon icon={faLightbulb} /></NavLink>;
  }

  if (name === 'linkedin') {
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faLinkedinIn} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faLinkedinIn} /></span>;
  }

  if (name === 'medium') {
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faMediumM} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faMediumM} /></span>;
  }

  if (name === 'note') {
    return <NavLink {...props}><FontAwesomeIcon icon={faEdit} /></NavLink>;
  }

  if (name === 'patreon') {
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faPatreon} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faPatreon} /></span>;
  }

  if (name === 'person') {
    return <NavLink {...props}><FontAwesomeIcon icon={faUser} /></NavLink>;
  }

  if (name === 'quora') {
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faQuora} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faQuora} /></span>;
  }

  if (name === 'reddit') {
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faRedditAlien} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faRedditAlien} /></span>;
  }

  if (name === 'speech') {
    return <NavLink {...props}><FontAwesomeIcon icon={faComment} /></NavLink>;
  }

  if (name === 'spinner') {
    return <span {...props}><FontAwesomeIcon icon={faStar} spin /></span>;
  }

  if (name === 'tumblr') {
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faTumblr} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faTumblr} /></span>;
  }

  if (name === 'twitter') {
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faTwitter} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faTwitter} /></span>;
  }

  if (name === 'wattpad') {
    if (props.href) {
      return <a {...props}></a>;
    }
    return <span {...props}></span>;
  }

  if (name === 'youtube') {
    if (props.href) {
      return <a {...props}><FontAwesomeIcon icon={faYoutube} /></a>;
    }
    return <span {...props}><FontAwesomeIcon icon={faYoutube} /></span>;
  }

  return null;
}

export default Icon;
