import './NavBar.css';
import React, {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BiShoppingBag} from "react-icons/bi";
import  {withRouter} from "react-router-dom"
import {AiOutlineBars,  IoPersonOutline} from "react-icons/all";


import GenerateProductSelectionView from "./NavBarModules/GenerateProductSelectionView";
import GenerateProductSelectionInNavBar from "./NavBarModules/GenerateProductSelectionInNavBar";

const iconSize = 28
const userLogIn = true;

const NavBar = (props) => {

    const [productView , setProductView] = useState(false)
    const [selectionChoicesView , setSelectionChoicesView] = useState(-1)


    const toggleProductSelectionNavBar = () => {
        setProductView(!productView)
    }

    const toggleSelectionChoicesView = (selectionIndex) => {
        if (selectionChoicesView === selectionIndex) {
            setSelectionChoicesView(-1)
        }
        else {
            setSelectionChoicesView(selectionIndex)
        }
    }

    const setSelectedProduct = (selection) => {
        //redirect to product page once user has selected a product category
        props.setProductTypeSelection(selection)
        props.history.push("/productPage")
    }

    const returnToHomePage = () => {
        //redirect to homepage when user click on shop logo
        props.history.push("/")
    }

    //Generate the Navbar component
    return(

    <div className = 'navBar'>

        <GenerateProductSelectionView
            toggleProductSelectionNavBar = {toggleProductSelectionNavBar}
            toggleSelectionChoicesView = {toggleSelectionChoicesView}
            productSideNavBarView = {productView}
            selectionChoicesView = {selectionChoicesView}
            userLogInStatus = {userLogIn}
            userPets = {props.userPet}
            setSelectedProduct = {setSelectedProduct}/>


        <div className="navBarHeader">

            <div className="left">
                <button><AiOutlineBars className='icon' size={iconSize} onClick = { ()=> {toggleProductSelectionNavBar()}}/></button>
                <GenerateProductSelectionInNavBar setSelectedProduct = {setSelectedProduct} userPet = {props.userPet}/>
            </div>
            <div className="middle">
                <button onClick={() => {returnToHomePage()}}>PET'S MART</button>
            </div>
            <div className="right">

                <IoPersonOutline size={iconSize} onClick = { ()=> {props.toggleLoginNavBarView()}}/>
                <button><BiShoppingBag className='icon' size={iconSize} onClick = { ()=> {props.toggleDisplayCart()}}/></button>
            </div>

        </div>
    </div>
    )
}

export default withRouter(NavBar)