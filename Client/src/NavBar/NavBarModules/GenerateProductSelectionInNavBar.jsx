import React from "react";
import './ProductSelectionViewInNavBar.css'

let productTypes = ["Weight Management" , "Diabetes"]

const GenerateProductSelectionInNavBar = (props) =>{


    return (
        <div className = "innerContainer">
            <button >Products</button>
            <div className = "dropdown-content">
                <div className = "dropdown-content-inner">
                    { props.userPet.length?

                        <div className="selection">
                            <span>Products for your pets</span>
                            {props.userPet.map(function (item, index) {
                                return (
                                    <button onClick={() => {
                                        props.setSelectedProduct([1, item.species, item.healthConcern])
                                    }}>{item.name}</button>
                                )
                            })}
                        </div>:null
                    }
                    <div className = "selection">
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


                    <div className = "selection">
                        <button className = "titleButton" onClick={() => {props.setSelectedProduct([0 , "" , ""])}}>All Products</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default GenerateProductSelectionInNavBar