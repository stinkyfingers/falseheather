import React from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';
import logo from '../images/fh_logo.png';
import fb from '../images/Facebook.png';
import music from '../images/music.png';

const Header = () => {
  return (<div className='header'>
    <Link to='/music' title='Music'><img src={music} alt='Music' className='logo' /></Link>
    <Link to='/' title='Calendar'><img src={logo} alt='False Heather' className='logo' /></Link>
    <a href='https://www.facebook.com/FLSHeather' title='Goddamned Facebook'><img src={fb} alt='Facebook' className='facebook' /></a>
  </div>);
}

export default Header;
