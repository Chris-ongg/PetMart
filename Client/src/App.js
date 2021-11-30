import './App.css';
import React, {useEffect, useRef, useState} from 'react';
import HomePage from './Homepage/HomePage'
import FormPage from './FormPage/FromPage'
import ProfilePage from "./ProfilePage/ProfilePage";
import ProductPage from "./ProductPage/ProductPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from "./LoginPage/LoginPage";
import {gql, useMutation, useQuery} from "@apollo/client";
import CartPage from "./CartPage/CartPage"
import CheckoutPage from "./CartPage/CheckoutPage";

//Queries statement
const verifyAccessToken = gql` 
    query checkAccessToken($token: String! ) {
        verifyAccessToken(token: {token: $token}) {
            name
            email
        }
    }
`;

const getCustPets = gql`
    query getPets($email: String!) {
        getCustomerPets(customer: {email : $email}) {
            name
            gender
            species
            petBreed
            age
            weight
            healthConcern
        }
    }`;

const App = () =>  {

    const tokenVerification = useQuery(verifyAccessToken , {
        variables: {
            token: ""
        },
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only"
    })

    const customerPets = useQuery(getCustPets , {
        variables: {
            email: ""
        },
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only"
    })

    //Control the view for shopping bag, login, error Message
    const [shoppingCartDisplay , setShoppingCartDisplay] = useState(false)
    const [loginNavBarView , setLoginNavBarView] = useState(false)
    const [errorMsg , setErrorMsg]  = useState("")

    //Set logged in user details , pets and product choices selected by user
    const [userDetails , setUserDetails] = useState({
        name: "",
        email: ""
    })
    const [userPets , setUserPets] = useState([])
    const [productChoices , setProductChoices] = useState([0 , "", ""])

    const [checkOutPrice , setCheckOutPrice] = useState(0)

    const setFinalCheckOutPrice = (amount) => {
        setCheckOutPrice(amount)
    }

    const setProductTypeSelection = (selection) => {
        //selection input : [ 0 , "species" , "health Concern"]
        //0 = all products , 1 = select products from species with the following healthConcern

        setProductChoices(selection)
    }

    const refreshUserPets = async () => {
        let customer_Pets = await customerPets.refetch({email: userDetails.email})
        setUserPets(customer_Pets.data.getCustomerPets)
    }

    const setLoggedInUserDetails = async (details) => {
        //Set logged in user name, email and registered pets
        setUserDetails(details)
        //fetch user pets from database
        let customer_Pets = await customerPets.refetch({email: details.email})
        setUserPets(customer_Pets.data.getCustomerPets)
    }

    const setLoggedOutUserDetails = () => {
        //remove user details and pets from state
        setUserDetails({
            name: "",
            email: ""
        })
        setUserPets([])
    }

    const toggleDisplayCart = () => {
        //turn shopping bag display on/off
        setShoppingCartDisplay(!shoppingCartDisplay)
    }

    const toggleLoginNavBarView = () => {
        //turn login display on/off
        setLoginNavBarView(!loginNavBarView)
        setErrorMessage("")
    }

    const setErrorMessage = (msg) => {
        setErrorMsg(msg)
    }



    useEffect(async () => {

        try {
            //If access token is stored in browser cookie then verify access token with database
            let token = document.cookie.split(";").find(row => row.startsWith(" PET_MART_USER")).split('=')[1]
            let result = await tokenVerification.refetch({token: token})
            //If access token is valid then log in user
            if (!Object.is(result.data.verifyAccessToken.name , "")) {
                await setLoggedInUserDetails({
                    name: result.data.verifyAccessToken.name,
                    email: result.data.verifyAccessToken.email
                })
            }

        }catch {
            // If there is no access token in browser, catch error.
        }

        //set petMartCart in localstorage if not present
        if  (!localStorage.getItem('petMartCart')) {
            localStorage.setItem('petMartCart' , '[]')
        }

    } , [userPets])

    //Routes to different sites
      return (
        <BrowserRouter>

            <LoginPage loginNavBarView = {loginNavBarView}
                       toggleLoginNavBarView = {toggleLoginNavBarView}
                        errorMsg = {errorMsg}
                        setErrorMessage = {setErrorMessage}
                        setLoggedInUserDetails = {setLoggedInUserDetails}
                        setLoggedOutUserDetails = {setLoggedOutUserDetails}
                        userDetails = {userDetails}/>

            <Switch>
                <Route exact path = "/" component={() => (<HomePage
                    toggleDisplayCart = {toggleDisplayCart}
                    toggleLoginNavBarView = {toggleLoginNavBarView}
                    userPet = {userPets}
                    userDetails = {userDetails}
                    setProductTypeSelection = {setProductTypeSelection}/>)} />

                <Route path = "/formPage" component = {() => (<FormPage
                    toggleDisplayCart = {toggleDisplayCart}
                    toggleLoginNavBarView = {toggleLoginNavBarView}
                    userDetails = {userDetails}
                    userPet = {userPets}
                    refreshUserPets = {refreshUserPets}
                    setProductTypeSelection = {setProductTypeSelection}/>)} />

                <Route path = "/profilePage" component = {() => (<ProfilePage
                    toggleDisplayCart = {toggleDisplayCart}
                    toggleLoginNavBarView = {toggleLoginNavBarView}
                    userDetails = {userDetails}
                    userPet = {userPets}
                    setProductTypeSelection = {setProductTypeSelection}/>)}/>

                <Route path = "/productPage" component = {() => (<ProductPage
                    toggleDisplayCart = {toggleDisplayCart}
                    toggleLoginNavBarView = {toggleLoginNavBarView}
                    userDetails = {userDetails}
                    userPet = {userPets}
                    setProductTypeSelection = {setProductTypeSelection}
                    productChoices = {productChoices}/>)}/>

                <Route path = "/CartPage" component = {() => (<CartPage
                    toggleDisplayCart = {toggleDisplayCart}
                    toggleLoginNavBarView = {toggleLoginNavBarView}
                    userDetails = {userDetails}
                    userPet = {userPets}
                    setProductTypeSelection = {setProductTypeSelection}
                    setFinalCheckOutPrice = {setFinalCheckOutPrice}/>)}

                />)}/>

                <Route path = "/CheckoutPage" component = {() => (<CheckoutPage
                    toggleDisplayCart = {toggleDisplayCart}
                    toggleLoginNavBarView = {toggleLoginNavBarView}
                    userDetails = {userDetails}
                    userPet = {userPets}
                    setProductTypeSelection = {setProductTypeSelection}
                    checkOutPrice = {checkOutPrice}
                    />)}
                />)}/>



            </Switch>
      </BrowserRouter>
      )

}

export default App;

