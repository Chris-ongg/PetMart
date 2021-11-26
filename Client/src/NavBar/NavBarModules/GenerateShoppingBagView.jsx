import {CSSTransition} from "react-transition-group";
import {ImCross} from "react-icons/all";
import React, {useEffect, useRef, useState} from "react";

import './ShoppingBagView.css'
import {gql, useMutation, useQuery} from "@apollo/client";

const saveCart = gql`
    mutation SaveCart (
            $email: String!,
            $emptyCart: Boolean!,
            $cart: [cartItemsInput]!
     ){
    saveShoppingCart(saveCart: {
        email: $email,
        emptyCart: $emptyCart,
        cart: $cart
    }) 
    {
    email
    }
    }`;

const getShoppingCart = gql`
    query get_shoppingCart($email: String!) {
        searchShoppingCart(cart: {email: $email}) {
          itemID
          name
          price
          quantity
          imagePath       
        } 
    }`;

const GenerateShoppingBagView = (props) => {
    let totalSum = 0;
    let itemsCartBlockDisplay;


    const shoppingCart = useQuery(getShoppingCart , {
        variables: {
            email: ""
        },
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only"
    })
    const [saveCartItems] = useMutation(saveCart)
    const [cartItems , setCartItems] = useState([])

    const removeCartItem = async (itemName) => {
        let temp = cartItems.filter(function(item  ,index) {
            return item.name !== itemName
        })
        if (props.userDetails.email != "") {
            let saveResult = await saveCartItems({
                variables: {
                    email: props.userDetails.email,
                    emptyCart: temp.length > 0 ? false : true,
                    cart: temp
                }
            })
        }
        localStorage.setItem('petMartCart' , JSON.stringify(temp))
        setCartItems(temp)
    }

    useEffect(async () => {
        if (props.userDetails.email != "") {
            let cartResult = await shoppingCart.refetch({email: props.userDetails.email})
            if (cartResult) {
                if (cartResult.data.searchShoppingCart) {
                    setCartItems(cartResult.data.searchShoppingCart)
                } else {
                    setCartItems(JSON.parse(localStorage.getItem('petMartCart')))
                }
            }
        }
    } ,[props.cartItems] )


    cartItems.length ? itemsCartBlockDisplay = cartItems.map(function (item, index) {
        totalSum += item.price * item.quantity

        return (
            <div key={index} className="cart-block-items">
                <div className='cart-block-items-left'>
                    <p>{item.name}</p>
                    <span>{"$" + item.price * item.quantity}</span>
                    <span>Quantity: {item.quantity}</span>
                    <button onClick={() => removeCartItem(item.name)}>Remove</button>
                </div>

                <img src={item.imagePath}/>
            </div>
        )
    }) : itemsCartBlockDisplay = null

    return (

        <CSSTransition in={props.shoppingCartDisplay} timeout={500} classNames="menu" unmountOnExit>

            <div className="shoppingCart">

                <button onClick={() => {
                    props.toggleDisplayCart()
                }} className='closeView'><ImCross size={25}/></button>
                <h2 className='title'>Shopping Bag</h2>

                <div className='cart-price-items'>
                    <span> {"Total: $" + totalSum} </span>
                </div>

                {itemsCartBlockDisplay}

            </div>

        </CSSTransition>

    )
}

export default GenerateShoppingBagView