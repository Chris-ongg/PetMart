import {CSSTransition} from "react-transition-group";
import {ImCross, RiErrorWarningLine} from "react-icons/all";
import React, {useEffect, useState} from "react";
import './LoginPage.css'
import CryptoJS from "crypto-js/crypto-js";
import {gql, useLazyQuery, useMutation, useQuery} from "@apollo/client";
import LoggedInView from "./LoggedInView";
import RegistrationView from "./RegistrationView";
import LoginView from "./LoginView";
import  {withRouter} from "react-router-dom"

//Queries statement to database
const emailLogin = gql` 
    query AuthenticateUser($email: String! , $password: String!) {
        customerEmailLogin(login: {email: $email , password: $password}) {
            name
            email
            accessToken
        }
    }
`;

const googleLogin = gql`
    query AuthenticateGoogleUser ($token : String!) {
        customerGoogleLogin(login: { token :$token }) 
        {
            email
        }
    }
   `;

const logoutUser = gql` 
    mutation userLogout ($email: String!) {
        customerLogout(logout: {email: $email}) 
        {
            name
            email
        }
    }`;

const registerUser = gql` 
    mutation registerNewUser ($name: String! ,$email: String!, $password: String!) {
        customerRegistration(register: {name: $name , email: $email , password: $password})
        {
            name
            email
        }
    }`;

const getkey = gql` 
    query get_key {
        encryptionKey 
        {
            key
        }
    }`

const LoginPage = (props) => {

    const [authenticatedEmailUser, ] = useLazyQuery(emailLogin , {
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
        onCompleted: async result => {
            try{
                if (result.customerEmailLogin.accessToken != "") {
                    props.setErrorMessage("")
                    setLoggedIn(true)
                    props.setLoggedInUserDetails({
                        name: result.customerEmailLogin.name,
                        email: result.customerEmailLogin.email
                    })
                }
                else {
                    props.setErrorMessage("Wrong Email or Password")
                }
            } catch {}
        }
    })

    const [authenticatedGoogleUser, ] = useLazyQuery(googleLogin , {
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
        onCompleted: async result => {
            try{
                if (result && result.customerGoogleLogin.accessToken != "") {
                    props.setErrorMessage("")
                    setLoggedIn(true)
                    props.setLoggedInUserDetails({
                        name: result.customerGoogleLogin.name,
                        email: result.customerGoogleLogin.email
                    })
                }
                else {
                    props.setErrorMessage("Google login unsuccessful. Please login in through your email.")
                }
            } catch {}
        }
    });


    const encryptionKey = useQuery(getkey , {
        fetchPolicy: "network-only",
        nextFetchPolicy: "network-only",
    });


    const [handleCustomerLogout] = useMutation(logoutUser);

    const [handleNewUser] = useMutation(registerUser);

    //if true show login view else show registration view
    const [loginView , setLoginView] = useState(true)
    //capture login field inputs
    const [loginFields , setLoginFields] = useState({
        emailAdd: "",
        password: ""
    })
    //check for user login
    const [loggedIn , setLoggedIn] = useState(false)
    const [successMsg , setSuccessMsg] = useState("")
    //capture for new customer registration field input
    const [registrationFields , setRegistrationFields] = useState({
        name: "",
        emailAdd: "",
        password: "",
        password2: ""
    })


    const setSuccessMessage= (msg) =>{
        setSuccessMsg(msg)
        props.setErrorMessage("")
    }

    const handleLogoutSubmit = async () => {
        await handleCustomerLogout({
            variables: {
                email: props.userDetails.email
            }
        })
        props.setLoggedOutUserDetails()
        localStorage.setItem('petMartCart' , '[]')
        setLoginStatus()
        props.history.push("/")
    }

    const responseGoogle = async (response) => {
        //authenticated user through google login
        await authenticatedGoogleUser({variables:{token: response.tokenId}})

    }

    const toggleLoginView = (state) => {

        if (state) {
            setLoginView(true)
        }
        else {
            setLoginView(false)
        }
    }

    const handleLoginFormChange = (event) => {
        setLoginFields(prevState => ({...prevState, [event.target.name]: event.target.value}));
    }

    const handleLoginFormSubmit = async (event) => {
        event.preventDefault()

        if (loginFields.password.length < 5) {
            //password length must be more than 5 characters
            props.setErrorMessage("Invalid password")
        }
        else {
            let encryptKey = await encryptionKey.refetch()
            //Encrypt password
            let ciphertext = CryptoJS.AES.encrypt(loginFields.password, encryptKey.data.encryptionKey.key).toString();
            //Send encrypted password to server to verify user
            await authenticatedEmailUser({variables:{email: loginFields.emailAdd, password: ciphertext}})
            //If password is correct, log in user else show error message
        }
    }

    const handleRegistrationFormChange = (event) => {
        setRegistrationFields(prevState => ({...prevState, [event.target.name]: event.target.value}));
    }

    const handleRegistrationFormSubmit = async (event) => {
        event.preventDefault()
        let flag = true;
        //Registration form check
        for (const [key, value] of Object.entries(registrationFields)) {
            if (value == "") {
                props.setErrorMessage("Invalid. " + key + " is empty")
                flag = false
            }
            if (key == "password" && value.length < 5) {
                props.setErrorMessage("Invalid. Password has to have a min length of 5 characters")
                flag = false
            }
            break;
        }

        if (flag) {
            if (registrationFields.password != registrationFields.password2) {
                props.setErrorMessage("Invalid. Please ensure passwords are similar")
                flag = false
            }
        }
        //if check successfully, register new user to database
        if (flag) {
            let encryptKey = await encryptionKey.refetch()
            let ciphertext = CryptoJS.AES.encrypt(registrationFields.password, encryptKey.data.encryptionKey.key).toString();
            let result = await handleNewUser({
                variables: {
                    name: registrationFields.name,
                    email: registrationFields.emailAdd,
                    password: ciphertext
                }
            })
            if (result.data.customerRegistration.name == "") {
                props.setErrorMessage("This email has already been registered")
            }

            else {
                setSuccessMsg("Registration successful. Please proceed to log in.")
            }

        }
    }

    const setLoginStatus = () => {
        setLoggedIn(!loggedIn)
    }

    useEffect(() => {

        if (!Object.is(props.userDetails.name, "")){
            //set log in status if there is a logged in user
            setLoggedIn(true)
        }
        else {
            setLoggedIn(false)
        }

    } , [props.userDetails])

    //Generate view for login page
    return (
        <CSSTransition in = {props.loginNavBarView} timeout = {500} classNames= "loginNavBar" unmountOnExit>
            <div className = "userAccount">

                <button onClick = { ()=> {props.toggleLoginNavBarView()}} className = 'closeView'><ImCross size = {25}  /></button>

                {
                    loggedIn?

                        <LoggedInView
                            handleLogoutSubmit = {handleLogoutSubmit}
                            userDetails = {props.userDetails}/> :

                        loginView?

                            <LoginView
                                toggleLoginView = {toggleLoginView}
                                handleLoginFormChange = {handleLoginFormChange}
                                handleLoginFormSubmit = {handleLoginFormSubmit}
                                setErrorMessage = {props.setErrorMessage}
                                responseGoogle = {responseGoogle}
                                errorMsg = {props.errorMsg}/> :

                            <RegistrationView
                                toggleLoginView = {toggleLoginView}
                                handleRegistrationFormChange = {handleRegistrationFormChange}
                                handleRegistrationFormSubmit = {handleRegistrationFormSubmit}
                                setErrorMessage = {props.setErrorMessage}
                                errorMsg = {props.errorMsg}
                                setSuccessMessage = {setSuccessMessage}
                                successMsg = {successMsg}
                            />
                }
            </div>
        </CSSTransition>
    )
}

export default withRouter(LoginPage)