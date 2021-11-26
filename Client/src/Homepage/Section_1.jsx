import React, {useState} from 'react'
import NavBar from '../NavBar/NavBar'
import './Section_1.css'
import GenerateShoppingBagView from "../NavBar/NavBarModules/GenerateShoppingBagView";


const Header = (props) => {

    const [shoppingCartDisplay , setShoppingCartDisplay] = useState(false)

    const toggleDisplayCart = () => {
        setShoppingCartDisplay(!shoppingCartDisplay)
        console.log(shoppingCartDisplay)
    }

    let navBar = <div><NavBar
        toggleDisplayCart = {toggleDisplayCart}
        toggleLoginNavBarView = {props.toggleLoginNavBarView}
        setProductTypeSelection = {props.setProductTypeSelection}
        userPet = {props.userPet}/></div>

    return (
        <React.Fragment>
            <GenerateShoppingBagView
                shoppingCartDisplay = {shoppingCartDisplay}
                userDetails = {props.userDetails}
                toggleDisplayCart = {toggleDisplayCart}
                cartItems = {0}
            />

            <div className = "Section1">
                {navBar}
            </div>
        </React.Fragment>)

}

export default Header
