import React, {useEffect, useState} from 'react'
import {Container} from "react-bootstrap";
import {memo} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import GenerateShoppingBagView from "../NavBar/NavBarModules/GenerateShoppingBagView";
import GenerateProductCard from "./ProductPageModules/GenerateProductCard";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer"
import './ProductPage.css'

const title = 'All Products'

//Queries and mutation statement
const getProducts = gql`
    query getProductForDisplay($searchType: Int! , $species: String! , $healthConcern: String! ) {
        searchWarehouse(search: {searchType: $searchType , species: $species , healthConcern: $healthConcern}) {
            itemID
            name
            price
            stock
            imagePath
            species
            healthConcern
             
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

const ProductPage = (props) => {

    const shoppingCart = useQuery(getShoppingCart , {
        variables: {
            email: ""
        },
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only"
    })
    const queryProducts = useQuery(getProducts ,{
        variables: {
            searchType: 0,
            species: "",
            healthConcern: ""
        },
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only"
    })
    const [saveCartItems] = useMutation(saveCart)

    //hold products to be display
    const [displayProducts , setDisplayProducts] = useState([])
    //hold products added to cart
    const [cartItems , setCartItems] = useState([])

    const [shoppingCartDisplay , setShoppingCartDisplay] = useState(false)
    const toggleDisplayCart = () => {
        setShoppingCartDisplay(!shoppingCartDisplay)
    }

    const addItemToCart = async (item , quantity_ , event) => {
        //get latest items in cart from localstorage
        //Add to cart and update localstorage. If user is log in then update database too.
        setCartItems(JSON.parse(localStorage.getItem('petMartCart')))

        let createItemShoppingBagProfile =  {
            itemID: item.itemID,
            name: item.name,
            price: item.price,
            quantity: quantity_,
            imagePath: item.imagePath
        }

        //assume no similar item is in cart
        let flag = false;

        //increase item quantity in cart
        let updatedCart = cartItems.map(function(cartItem , index) {
            let newCartItem = {...cartItem}
            if (cartItem.itemID === item.itemID) {
                newCartItem.quantity = cartItem.quantity + createItemShoppingBagProfile.quantity
                flag = true
                return newCartItem
            }
            return cartItem
        })

        if (!flag) {updatedCart.push(createItemShoppingBagProfile)}

        //save to database if user is log in
        if (props.userDetails.email != "") {
            let saveResult = await saveCartItems({
                variables: {
                    email: props.userDetails.email,
                    emptyCart: updatedCart.length > 0 ? false : true,
                    cart: updatedCart
                }
            })
        }
        else {
            localStorage.setItem('petMartCart' , JSON.stringify(updatedCart))
        }
        setCartItems(updatedCart)
    }

    useEffect(async () => {
        //Once component mounts, load customer product category choice
        //If no choice is made, then show all products instead
        try {
            let result = await queryProducts.refetch({
                searchType: props.productChoices[0],
                species: props.productChoices[1],
                healthConcern: props.productChoices[2]
            })
            setDisplayProducts(result.data.searchWarehouse)
        }
        catch {
            let result = await queryProducts.refetch({
                searchType: 0,
                species: "",
                healthConcern: ""
            })
            setDisplayProducts(result.data.searchWarehouse)
        }
        //if user is logged in, retrieve latest shopping cart from database (if any)
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
    } , [props.userDetails])

    //Generate the product page
    return (
        <React.Fragment >
                <GenerateShoppingBagView
                    shoppingCartDisplay = {shoppingCartDisplay}
                    userDetails = {props.userDetails}
                    toggleDisplayCart = {toggleDisplayCart}
                    cartItems = {cartItems}
                />


            <div className = "productPage">

                <NavBar toggleDisplayCart = {toggleDisplayCart}
                        toggleLoginNavBarView = {props.toggleLoginNavBarView}
                        setProductTypeSelection = {props.setProductTypeSelection}
                        userPet = {props.userPet}
                />

                <div className="productListing">
                    <h1 className='productListingTitle'>{title}</h1>
                    <div className="showProducts">
                        <Container>
                            <GenerateProductCard content = {displayProducts} addItemToCart = {addItemToCart}/>
                        </Container>
                    </div>

                </div>

                <Footer/>
            </div>
        </React.Fragment>
    )
}




export default memo(ProductPage)