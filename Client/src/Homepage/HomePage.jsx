import React, {useEffect, useState} from 'react'
import Header from './Section_1';
import CoreValues from './Section_2';
import Blog from './Section_6';
import ContactUs from './Section_7';
import Carousel from './Section_4'
import Footer from '../Footer/Footer'


const HomePage = (props) => {

        return (
            <React.Fragment>

                    <div style = {{maxWidth: '1900px' , marginLeft: 'auto' , marginRight: 'auto'}}>
                        <Header
                            toggleDisplayCart = {props.toggleDisplayCart}
                            toggleLoginNavBarView = {props.toggleLoginNavBarView}
                            setProductTypeSelection = {props.setProductTypeSelection}
                            userPet = {props.userPet}
                            userDetails = {props.userDetails}
                        />
                        <CoreValues />
                        <Carousel />
                        <Blog />
                        <ContactUs />
                        <Footer />
                  </div>
            </React.Fragment>
        )
}

export default HomePage


//<Header userLogIn = {this.props.userLogIn} userLogOut= {this.props.userLogOut}/>
//<CoreValues />
//<CallToAction />
//<Carousel />
//<Memories />
//<Blog />
//<ContactUs />  
//<Footer />
//<FormPage />