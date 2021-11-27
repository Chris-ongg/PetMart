import React, {useEffect, useState} from 'react'
import NavBar from '../Homepage/NavBar'
import Footer from '../Homepage/Footer'
import styled from "styled-components";
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import {Countries} from './Countries'
import {gql, useQuery} from "@apollo/client";
import {withRouter} from "react-router-dom"

const Container = styled.div``;

const Details = styled.div`
  flex: 3;
  padding:50px;
`;

const Wrapper = styled.div`
  padding: 30px;
  display: flex;
  justify-content: space-between;
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

const Title = styled.h1`
  font-weight: 300;
  padding-top: 100px;
  text-align: center;
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

const PurchaseButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
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

function checkFormInput(Fulladdress) {

    let info = JSON.parse(JSON.stringify(Fulladdress));

    let status = true //assume no error in form
    let errMsg = "No error"
    if (info.firstname.length < 2) {
        status = false
        errMsg = "Please enter a valid First Name"
    }

    if (info.lastname.length < 2) {
        status = false
        errMsg = "Please enter a valid Last Name"
    }

    if (info.address.length < 2) {
        status = false
        errMsg = "Please enter a valid Complete address"
    }

    if (isNaN(info.phone)) {
        status = false
        errMsg = "please enter a valid Phone number"
    }

    if (isNaN(info.postal)) {
        status = false
        errMsg = "please enter a Postal code"
    }

    return {
        first: status,
        second: errMsg
    }
}


function GenerateSelectValue(props) {
    let generateValue = props.content.map(function (value_) {
        return (<option value={value_}> {value_}</option>)
    })

    return generateValue
}

const Checkout = (props) => {

    const [registrationAddress, setRegistrationAddress] = useState({
            firstname: "",
            lastname: "",
            phone: "",
            country: "0",
            address: "",
            postal: "",
            city: ""
        }
    )

    const [cartItems, setCartItems] = useState([])

    const shoppingCart = useQuery(getShoppingCart, {
        variables: {
            email: ""
        },
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only"
    })

    const handleOnChange = (event) => {
        setRegistrationAddress(prevState => ({...prevState, [event.target.name]: event.target.value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(this.state)
        let validSubmit = checkFormInput(this.state)
        if (validSubmit.first) {
            alert("Address Successfully Confirmed!")
        } else {
            alert(validSubmit.second)
        }
    }

    const calculateBill = () => {
        let bill = 0;
        cartItems.map(function (item, index) {
            bill += item.price * item.quantity
        })
        return bill
    }

    useEffect(async () => {

        let itemsInCart = []

        let cartResult = null;

        if (props.userDetails.email != "") {
            cartResult = await shoppingCart.refetch({email: props.userDetails.email})
            if (cartResult) {
                if (cartResult.data.searchShoppingCart) {
                    console.log(cartResult)
                    itemsInCart = cartResult.data.searchShoppingCart
                } else {
                    itemsInCart = JSON.parse(localStorage.getItem('petMartCart'))
                }
            }
        } else {
            itemsInCart = JSON.parse(localStorage.getItem('petMartCart'))
        }

        if (!itemsInCart.length && !cartResult) {
            //props.history.push("/")
        } else {
            setCartItems(itemsInCart)
        }

    }, [])

    return (
        <Container>
            <Cartnav>
                <NavBar/>
            </Cartnav>
            <Title>CHECKOUT</Title>
            <Wrapper>
                <Details>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Row>
                                <Col>
                                    <Form.Control type="text" placeholder="First Name" name="firstname"
                                                  onChange={handleOnChange}/>
                                </Col>
                                <Col>
                                    <Form.Control type="text" placeholder="Last Name" name="lastname"
                                                  onChange={handleOnChange}/>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Row>
                                <Col>
                                    <Form.Control type="text" placeholder="Phone Number" name="phone"
                                                  onChange={handleOnChange}/>
                                </Col>
                            </Row>
                        </Form.Group>


                        <Form.Group className="mb-4">
                            <Row>
                                <Col xs={7}>
                                    <Form.Select name="country" placeholder="Country" onChange={handleOnChange}>
                                        <option value="0">Select shipping country</option>
                                        <GenerateSelectValue content={Countries}/>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Col>
                                <Form.Control type="text" placeholder="Complete Address" name="address"
                                              onChange={handleOnChange}/>
                            </Col>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Row>
                                <Col>
                                    <Form.Control type="text" placeholder="Postal Code" name="postal"
                                                  onChange={handleOnChange}/>
                                </Col>
                                <Col>
                                    <Form.Control type="text" placeholder="City" name="city"
                                                  onChange={handleOnChange}/>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Confirm Shipping Address
                        </Button>
                    </Form>
                </Details>
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
                    <PurchaseButton type="submit"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        alert("Order Successfully Placed!")
                                        window.location.href = '/';
                                    }}>PURCHASE</PurchaseButton>
                </Summary>
            </Wrapper>
            <Cartfoot>
                <Footer/>
            </Cartfoot>
        </Container>

    )

}

export default withRouter(Checkout);