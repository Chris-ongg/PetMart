import {FaTwitterSquare, GrLinkedin, ImFacebook2, ImInstagram} from "react-icons/all";
import React from "react";
import './Footer.css'


const GenerateFooter = (props) => {
    return (
        <div className='footer'>

            <div className='footer-left'>
                <p className='footer-links'> PRODUCTS YOU CAN TRUST</p>
                <p>PET'S MART © 2016</p>
            </div>

            <div className='footer-right'>
                <ImFacebook2 className='icon' size={35}/>
                <FaTwitterSquare className='icon' size={35}/>
                <GrLinkedin className='icon' size={35}/>
                <ImInstagram className='icon' size={35}/>
            </div>


        </div>
    )
}

export default GenerateFooter