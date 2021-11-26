import React from 'react'
import { ImFacebook2 } from 'react-icons/im'
import {FaTwitterSquare} from 'react-icons/fa'
import {GrLinkedin} from 'react-icons/gr'
import {ImInstagram} from 'react-icons/im'
import './Footer1.css'

const Footer = (props) => {
        return (
            <div className = 'footer'>
                <div className = 'footer-limiter'>

                    <div className = 'footer-left'>
                        <p className = 'footer-links'> PRODUCTS YOU CAN TRUST</p>
                        <p>PET'S MART © 2016</p>
                    </div>

                    <div className = 'footer-right'>
                            <ImFacebook2  className = 'icon' size = {35} />
                            <FaTwitterSquare className = 'icon' size = {35}/>
                            <GrLinkedin className = 'icon'  size = {35}/>
                            <ImInstagram  className = 'icon' size = {35}/>
                    </div>

                </div>
            </div>
        )
}

export default Footer