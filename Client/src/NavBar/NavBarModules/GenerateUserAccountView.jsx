import {CSSTransition} from "react-transition-group";
import {ImCross, RiErrorWarningLine} from "react-icons/all";
import React from "react";
import {Form} from "react-bootstrap";
import GoogleLogin from "react-google-login";
import './UserAccountView.css'

const responseGoogle = async (response) => {
    console.log(response)
}

function GenerateUserAccountLoginView(props){
    return(
        <div className = "innerContainer" onSubmit={props.handleLoginFormSubmit}>

            {
                props.errorMsg.length > 0?
                    <div className = 'messageError'>
                        <RiErrorWarningLine className = "icon" size = {25}/>
                        <span>{props.errorMsg}</span>
                    </div> : null
            }

            <h2 className = 'title'>Sign In</h2>
            <p>If you already have an account please sign in here</p>

            <Form className = "loginForm">
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="floatingInputCustom"
                        type="email"
                        name="emailAdd"
                        onChange={props.handleLoginFormChange}
                    />
                    <label htmlFor="floatingInputCustom">Email address</label>
                </Form.Floating>
                <Form.Floating>
                    <Form.Control
                        id="floatingPasswordCustom"
                        type="password"
                        name="password"
                        onChange={props.handleLoginFormChange}
                    />
                    <label htmlFor="floatingPasswordCustom">Password</label>
                </Form.Floating>

                <button>Sign In</button>
                <GoogleLogin className = "googleLogin" clientId={"10043720919-sdvflhtpemgtvn6cs043ims18ut4pk53.apps.googleusercontent.com"}
                             buttonText={"Login"} onSuccess={responseGoogle} onFailure={responseGoogle} cookiePolicy={'single_host_origin'} />
            </Form>

            <div className = "line"> </div>

            <div className = "registerOrSignInAccount">
                <p>If you do not have a account, please register here</p>
                <button onClick = {() => {props.toggleLoginView(false)}}>Register</button>
            </div>
        </div>
    )
}

function GenerateUserAccountRegistrationView(props){
    return (
        <div className = "innerContainer">
            {
                props.errorMsg.length > 0?
                    <div className = 'messageError'>
                        <RiErrorWarningLine className = "icon" size = {25}/>
                        <span>{props.errorMsg}</span>
                    </div> : null
            }

            <h2 className = 'title'>Register</h2>
            <p>Create an account now to join us as a member</p>

            <Form className = "loginForm" onSubmit={props.handleRegistrationFormSubmit}>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="floatingInputCustom"
                        type="text"
                        name = "name"
                        onChange={props.handleRegistrationFormChange}
                    />
                    <label htmlFor="floatingInputCustom">Name</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="floatingInputCustom"
                        type="email"
                        name = "emailAdd"
                        onChange={props.handleRegistrationFormChange}
                    />
                    <label htmlFor="floatingInputCustom">Email address</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="floatingPasswordCustom"
                        type="password"
                        name = "password"
                        onChange={props.handleRegistrationFormChange}
                    />
                    <label htmlFor="floatingPasswordCustom">Password</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="floatingPasswordCustom"
                        type="password"
                        name = "password2"
                        onChange={props.handleRegistrationFormChange}
                    />
                    <label htmlFor="floatingPasswordCustom">Re-enter Password</label>
                </Form.Floating>

                <button>Register </button>

            </Form>

            <div className = "line"> </div>

            <div className = "registerOrSignInAccount">
                <p>If you already have a account, please sign in here</p>
                <button onClick = {() => {props.toggleLoginView(true)}}>Sign In</button>
            </div>

        </div>



    )
}

function GenerateUserAccountLoggedInView(props) {
    return (
        <div className = "innerContainer">
            <h2 className = 'title'>Account</h2>
            <div className = "customerDetails">
                <p>Niki Sim</p>
                <span>chrisong1991@email.com</span>
            </div>

            <div className = "selection">
                <button>Account Summary</button>
            </div>
            <div className = "selection">
                <button>Transaction</button>
            </div>
            <div className = "selection">
                <button onClick = {() => {props.setLoginStatus()}}>Logout</button>
            </div>

        </div>
    )
}

const GenerateUserAccountView = (props) => {
    return (
        <CSSTransition in = {props.loginNavBarView} timeout = {500} classNames= "loginNavBar" unmountOnExit>
            <div className = "userAccount">

                <button onClick = { ()=> {props.toggleLoginNavBarView()}} className = 'closeView'><ImCross size = {25}  /></button>

                {
                    props.loggedIn? <GenerateUserAccountLoggedInView setLoginStatus = {props.setLoginStatus}/> :
                        props.loginView?

                            <GenerateUserAccountLoginView
                                toggleLoginView = {props.toggleLoginView}
                                handleLoginFormChange = {props.handleLoginFormChange}
                                handleLoginFormSubmit = {props.handleLoginFormSubmit}
                                setErrorMessage = {props.setErrorMessage}
                                errorMsg = {props.errorMsg}/> :

                            <GenerateUserAccountRegistrationView
                                toggleLoginView = {props.toggleLoginView}
                                handleRegistrationFormChange = {props.handleRegistrationFormChange}
                                handleRegistrationFormSubmit = {props.handleRegistrationFormSubmit}
                                setErrorMessage = {props.setErrorMessage}
                                errorMsg = {props.errorMsg}
                            />
                }
            </div>
        </CSSTransition>
    )
}

export default GenerateUserAccountView