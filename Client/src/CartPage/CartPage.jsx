import React, {useEffect, useState} from 'react'
import NavBar from '../NavBar/NavBar'
import Footer from '../Footer/Footer'


import {Add, Remove} from "@material-ui/icons";
import styled from "styled-components";
import {withRouter} from "react-router-dom"

import GenerateShoppingBagView from "../NavBar/NavBarModules/GenerateShoppingBagView";
import {gql, useQuery} from "@apollo/client";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-weight: 300;
`;

const Top = styled.div`
  padding-top: 100px;
  padding-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
`;


const Bottom = styled.div`
  display: flex;
  justify-content: space-between;

`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;
const ProductDescip = styled.span``;

const ProductId = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

const Cartnav = styled.div`
    background-color: #292c2f;
    color: white;
    width: 100%;
    flex: 0 0 auto;
    position: fixed;
    top:0
`;

const Cartfoot = styled.div`
    position: fixed;
    bottom:0;
    width: 100%;
`;

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



function DisplayProduct(props) {
    // accept an array of purchased items

    let display_products = props.itemsArr.map(function(item , index) {
        return (
            <Product>
                <ProductDetail>
                    <Image src= {item.imagePath}/>
                    <Details>
                        <ProductName>
                            <b>Product:</b> {item.name}
                        </ProductName>
                        <ProductId>
                            <b>Item ID:</b> {item.itemID}
                        </ProductId>
                    </Details>
                </ProductDetail>
                <PriceDetail>
                    <ProductAmountContainer>
                        <Add onClick={() => {props.quantityAdd(item.itemID)}}/>
                        <ProductAmount>{item.quantity}</ProductAmount>
                        <Remove onClick = {() => {props.quantityMinus(item.itemID)}}/>
                    </ProductAmountContainer>
                    <ProductPrice>{"$" + item.price}</ProductPrice>
                </PriceDetail>
            </Product>
        )
    })

    return display_products
}

const Cart = (props) => {

    const shoppingCart = useQuery(getShoppingCart , {
        variables: {
            email: ""
        },
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only"
    })

    const [shoppingCartDisplay, setShoppingCartDisplay] = useState(false)

    const [cartItems , setCartItems] = useState([])

    const toggleDisplayCart = () => {
        setShoppingCartDisplay(!shoppingCartDisplay)
    }

    const calculateBill = () => {
        let bill = 0;
        cartItems.map(function(item , index) {
            bill += item.price * item.quantity
        })
        return bill
    }

    const quantityAdd = (itemID_) => {

        let updatedCart = cartItems.map(function(cartItem , index) {
            let newCartItem = {...cartItem}
            if (cartItem.itemID === itemID_) {
                newCartItem.quantity = cartItem.quantity + 1
                return newCartItem
            }
            return cartItem
        })
        setCartItems(updatedCart)
    }

    const quantityMinus = (itemID_) => {
        let removedItem = 0;
        let updatedCart = cartItems.map(function(cartItem , index) {
            let newCartItem = {...cartItem}
            if (cartItem.itemID === itemID_) {
                newCartItem.quantity = cartItem.quantity - 1
                if (!newCartItem.quantity) {
                    removedItem = itemID_
                }
                else {
                    return newCartItem
                }
            }
            return cartItem
        })

        updatedCart = updatedCart.filter(function(item  ,index) {
            return item.itemID !== removedItem
        })

        setCartItems(updatedCart)
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
        else {
            setCartItems(JSON.parse(localStorage.getItem('petMartCart')))
        }

        return () => {
            props.setFinalCheckOutPrice(calculateBill())
        }

    } ,[] )


    return (
        <Container>

            <GenerateShoppingBagView
                shoppingCartDisplay={shoppingCartDisplay}
                userDetails={props.userDetails}
                toggleDisplayCart={toggleDisplayCart}
                cartItems={0}
            />

            <NavBar
                toggleDisplayCart={toggleDisplayCart}
                toggleLoginNavBarView={props.toggleLoginNavBarView}
                setProductTypeSelection={props.setProductTypeSelection}
                userPet={props.userPet}/>


            <Wrapper>
                <Top>
                    <Title>YOUR CART</Title>
                    <TopButton type="filled" onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/product';
                    }}>CONTINUE SHOPPING</TopButton>
                </Top>
                <Bottom>
                    <Info>

                        <DisplayProduct itemsArr = {cartItems} quantityAdd = {quantityAdd} quantityMinus = {quantityMinus}/>


                    </Info>
                    <Summary>
                        <SummaryTitle>ORDER SUMMARY</SummaryTitle>
                        <SummaryItem>
                            <SummaryItemText>Subtotal</SummaryItemText>
                            <SummaryItemPrice>{"$" + calculateBill()}</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>Estimated Shipping</SummaryItemText>
                            <SummaryItemPrice>$ 5.90</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>Shipping Discount</SummaryItemText>
                            <SummaryItemPrice>$ -5.90</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem type="total">
                            <SummaryItemText>Total</SummaryItemText>
                            <SummaryItemPrice>{"$" + calculateBill()}</SummaryItemPrice>
                        </SummaryItem>
                        <Button onClick={(e) => {
                            e.preventDefault();
                            props.history.push("/CheckoutPage")
                        }}>CHECKOUT NOW</Button>
                    </Summary>
                </Bottom>
            </Wrapper>
            <Cartfoot>
                <Footer/>
            </Cartfoot>
        </Container>
    );
};

export default withRouter(Cart);