import React, {useEffect} from 'react'
import {RiErrorWarningLine} from "react-icons/all";
import {Form} from "react-bootstrap";
import GoogleLogin from "react-google-login";

const LoginView = (props) => {

    useEffect(() => {

        return () => {props.setErrorMessage("")}
    } , [])

    return(
        <div className = "innerContainer" >

            {
                props.errorMsg.length > 0?
                    <div className = 'message messageError'>
                        <RiErrorWarningLine className = "icon" size = {25}/>
                        <span>{props.errorMsg}</span>
                    </div> : null
            }

            <h2 className = 'title'>Sign In</h2>
            <p>If you already have an account please sign in here</p>

            <Form className = "loginForm" onSubmit={props.handleLoginFormSubmit}>
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
                             buttonText={"Login"} onSuccess={props.responseGoogle} onFailure={props.responseGoogle} cookiePolicy={'single_host_origin'} />
            </Form>

            <div className = "line"> </div>

            <div className = "registerOrSignInAccount">
                <p>If you do not have a account, please register here</p>
                <button onClick = {() => {props.toggleLoginView(false)}}>Register</button>
            </div>
        </div>
    )
}

export default LoginView