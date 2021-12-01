import React, {useEffect, useState} from 'react'
import {Container} from "react-bootstrap";
import {gql, useLazyQuery, useMutation, useQuery} from "@apollo/client";
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

    const [shoppingCart, ] = useLazyQuery(getShoppingCart , {
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
        onCompleted: async cartResult => {
            try{
                if (cartResult) {
                    if (cartResult.searchShoppingCart) {
                        setCartItems(cartResult.searchShoppingCart)
                    }
                }
            } catch {}
        }
    })

    const [queryProducts, ] = useLazyQuery(getProducts ,{
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
        onCompleted: async result => {
            try{
                setDisplayProducts(result.searchWarehouse)
            } catch {}
        }
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
        let cart_Items = JSON.parse(localStorage.getItem('petMartCart'))
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
        let updatedCart = cart_Items.map(function(cartItem , index) {
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

        localStorage.setItem('petMartCart' , JSON.stringify(updatedCart))

        setCartItems(updatedCart)
    }

    useEffect(async () => {
        //Once component mounts, load customer product category choice
        //If no choice is made, then show all products instead
        setCartItems(JSON.parse(localStorage.getItem('petMartCart')))
        try {
            await queryProducts({variables:{
                searchType: props.productChoices[0],
                species: props.productChoices[1],
                healthConcern: props.productChoices[2]
            }})
        }
        catch {
            await queryProducts.refetch({variables: {
                searchType: 0,
                species: "",
                healthConcern: ""
            }})
        }
        //if user is logged in, retrieve latest shopping cart from database (if any)
        if (props.userDetails.email != "") {
            await shoppingCart({variables:{email: props.userDetails.email}})
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




export default ProductPage