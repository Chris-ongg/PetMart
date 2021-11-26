import React from 'react'
import {CSSTransition} from "react-transition-group";
import {ImCross, IoIosArrowDown, IoIosArrowUp} from "react-icons/all";
import './ProductSelectionView.css'
let productTypes = ["Weight Management" , "Diabetes"]

function GenerateSelectionViewForPets(props){
    return (
        <div className = "selectionTitle">
            <div className= "innerContainer">
                <span>Products for your pets</span>

                {
                    props.selectionChoicesView === 0 ?
                        <IoIosArrowUp className = "icon" onClick={() => {props.toggleSelectionChoicesView(0)}}/>:
                        <IoIosArrowDown className = "icon" onClick={() => {props.toggleSelectionChoicesView(0)}}/>
                }

            </div>
            {
                props.selectionChoicesView === 0 ?
                    <div className = "selectionChoices" style = {{display: 'flex'}}>
                        {
                            props.userPets.map(function (item, index) {
                                return (
                                    <button>{item.name}</button>
                                )
                            })
                        }
                    </div> : null
            }
        </div>
    )
}

function GenerateSelectionViewForProductTypes(props){
    return (
        <div className = "selectionTitle">
            <div className= "innerContainer">
                <span>Product Types</span>

                {
                    props.selectionChoicesView === 1 ?
                        <IoIosArrowUp className = "icon" onClick={() => {props.toggleSelectionChoicesView(1)}}/>:
                        <IoIosArrowDown className = "icon" onClick={() => {props.toggleSelectionChoicesView(1)}}/>
                }

            </div>
            {
                props.selectionChoicesView === 1 ?
                    <div className = "selectionChoices" style = {{display: 'flex'}}>

                        <span>Product For Dog</span>
                        {
                            productTypes.map(function(item, index) {
                                return (
                                    <button onClick={() => {props.setSelectedProduct([1, "Dog" , item])}}>{item}</button>
                                )
                            })
                        }

                        <span>Product For Cat</span>
                        {
                            productTypes.map(function(item, index) {
                                return (
                                    <button onClick={() => {props.setSelectedProduct([1, "Cat" , item])}}>{item}</button>
                                )
                            })
                        }

                    </div>

                    : null
            }
        </div>
    )

}

function GenerateSelectionViewForAllProducts(props){
    return (
        <div className = "selectionTitle">
            <div className= "innerContainer">
                <button onClick={() => {props.setSelectedProduct([0 , "" , ""])}}>All Products</button>
            </div>

        </div>
    )
}

function GenerateSelectionViewForProductsOnSale(){
    return (
        <div className = "selectionTitle">
            <div className= "innerContainer">
                <button>Products on Sale</button>
            </div>

        </div>
    )
}

const GenerateProductSelectionView = (props) =>{
    return (
        <CSSTransition in = {props.productSideNavBarView} timeout = {500} classNames= "sideNavBar" unmountOnExit>
            <div className = "productSelectionView">
                <button onClick =  { ()=> {props.toggleProductSelectionNavBar()}} className = 'closeView'><ImCross size = {25}  /></button>

                <div className = "selectionTitle">
                    <div className= "innerContainer">
                        <p>Free Shipping On All Orders</p>
                    </div>

                </div>
                {
                    (props.userPets.length)?
                        <GenerateSelectionViewForPets
                            toggleSelectionChoicesView = {props.toggleSelectionChoicesView}
                            selectionChoicesView = {props.selectionChoicesView}
                            userPets = {props.userPets}/>:
                        null
                }
                <GenerateSelectionViewForProductTypes toggleSelectionChoicesView = {props.toggleSelectionChoicesView} selectionChoicesView = {props.selectionChoicesView}/>
                <GenerateSelectionViewForAllProducts setSelectedProduct = {props.setSelectedProduct}/>
                <GenerateSelectionViewForProductsOnSale />
            </div>
        </CSSTransition>
    )
}

export default GenerateProductSelectionView