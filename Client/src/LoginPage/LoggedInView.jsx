import React from 'react'
import  {withRouter} from "react-router-dom"

const LoggedInView = (props) => {

    const addPetsPage = () => {
        props.history.push("/formPage")
    }

    const profilePage = () => {
        props.history.push("/profilePage")
    }

    return (
        <div className = "innerContainer">
            <h2 className = 'title'>Account</h2>
            <div className = "customerDetails">
                <p>{props.userDetails.name}</p>
                <span>{props.userDetails.email}</span>
            </div>

            <div className = "selection">
                <button onClick = {() => {profilePage()}}>Account Summary</button>
            </div>
            <div className = "selection">
                <button onClick = {() => {profilePage()}}>Transaction</button>
            </div>
            <div className = "selection">
                <button onClick = {() => {addPetsPage()}}>Register Pets</button>
            </div>
            <div className = "selection">
                <button onClick = {() => {props.handleLogoutSubmit()}}>Logout</button>
            </div>
        </div>
    )
}

export default withRouter(LoggedInView);