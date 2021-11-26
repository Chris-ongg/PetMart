import React, {useEffect} from 'react'
import {RiErrorWarningLine} from "react-icons/all";
import {Form} from "react-bootstrap";


const RegistrationView = (props) => {

    useEffect(() => {

        return () => {
            props.setErrorMessage("")
            props.setSuccessMessage("")
        }
    } , [])

    return (
        <div className = "innerContainer">
            {
                props.errorMsg.length > 0?
                    <div className = 'message messageError' >
                        <RiErrorWarningLine className = "icon" size = {25}/>
                        <span>{props.errorMsg}</span>
                    </div> : null

            }
            {
                props.successMsg.length > 0?
                    <div className = 'message messageSuccess' >
                        <span>{props.successMsg}</span>
                    </div> : null
            }

            <h2 className = 'title'>Register</h2>
            <p>Create an account now to join us as a member</p>

            <Form className = "loginForm" onSubmit={props.handleRegistrationFormSubmit}>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="floatingInputCustom1"
                        type="text"
                        name = "name"
                        onChange={props.handleRegistrationFormChange}
                    />
                    <label htmlFor="floatingInputCustom">Name</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="floatingInputCustom2"
                        type="email"
                        name = "emailAdd"
                        onChange={props.handleRegistrationFormChange}
                    />
                    <label htmlFor="floatingInputCustom">Email address</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="floatingPasswordCustom1"
                        type="password"
                        name = "password"
                        onChange={props.handleRegistrationFormChange}
                    />
                    <label htmlFor="floatingPasswordCustom">Password</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="floatingPasswordCustom2"
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

export default RegistrationView