import React from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';
import logo from '../images/fh_logo.png';

const Header = () => {
  return (<div className='header'>
    <Link to='/music' className='link'>Music</Link>
    <Link to='/'><img src={logo} alt='False Heather' className='logo' /></Link>
    <Link to='/' className='link'></Link>
  </div>);
}

export default Header;
