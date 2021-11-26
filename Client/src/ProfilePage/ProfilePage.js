import React, {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import  {withRouter} from "react-router-dom"


import GenerateShoppingBagView from "../NavBar/NavBarModules/GenerateShoppingBagView";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer"
import './ProfilePage.css'
import user_Transaction from '../Transaction';

//Table header
const tableHeader = ["Name", "Gender", "Species", "PetBreed", "Age(Years)", "Weight(Kg) ", "Health Concern"]
const tableTransactionHeader = ["Date", "OrderID", "Store", "Items", "Total", "Tracking ID", "Status"]

function GenerateTable(props) {
    //Create table header
    let tableHeader =
        <thead>
        <tr>
            {props.tableHeader.map(function (header, index) {
                return (<th key={index} className="tableHeader">{header}</th>)
            })}
        </tr>
        </thead>

    //Populate table
    let tableBodies =
        <tbody>
        {props.tableContent.map(function (content, outerIndex) {

            return (<tr key={outerIndex}>
                {
                    Object.values(content).map(function (field, index) {
                        return (
                            index < 7 ?
                                outerIndex % 2 ?
                                    <td key={index} className="fieldData" style={{backgroundColor: "white"}}>
                                        {field}
                                    </td> :
                                    <td key={index} className="fieldData" style={{backgroundColor: "#efeeee"}}>
                                        {field}
                                    </td>
                                : null
                        )
                    })
                }
            </tr>)
        })}
        </tbody>

    return (<div className="tableStyle">
        <table>{tableHeader}{tableBodies}</table>
    </div>)
}

function GenerateUserPetsTable(props) {
    //Create pets table
    return (
        <div className="tableSection">
            <h3>Your's Pet Records</h3>
            <GenerateTable tableHeader={tableHeader} tableContent={props.userPet}/>
            <button onClick={() => {props.goToFormPage()}}>Add a pet</button>
        </div>
    )

}

function GenerateTransactionTable() {
    //Create transaction table
    return (
        <div className="tableSection">
            <h3>Transactions</h3>
            <GenerateTable tableHeader={tableTransactionHeader} tableContent={user_Transaction}/>
        </div>
    )

}

const ProfilePage = (props) => {

    const [shoppingCartDisplay , setShoppingCartDisplay] = useState(false)

    const toggleDisplayCart = () => {
        setShoppingCartDisplay(!shoppingCartDisplay)
    }

    const goToFormPage = () => {
        //redirect user to pet registration page
        props.history.push("/formPage")
    }

    useEffect(() => {
        //if user is not log in, redirect to home page
        if (Object.is(props.userDetails.name, "")){
            props.history.push("/")
        }
        //update page whenever user details and pet changes
    } , [props.userDetails , props.userPet])

    return (
        <React.Fragment>
            <GenerateShoppingBagView
                shoppingCartDisplay = {shoppingCartDisplay}
                userDetails = {props.userDetails}
                toggleDisplayCart = {toggleDisplayCart}
                cartItems = {0}
            />
        <div className="profilePage">

            <NavBar
                toggleDisplayCart = {toggleDisplayCart}
                toggleLoginNavBarView = {props.toggleLoginNavBarView}
                setProductTypeSelection = {props.setProductTypeSelection}
                userPet = {props.userPet}/>

            <div className="customerDetails">
                <p>{props.userDetails.name}</p>
                <span>{props.userDetails.email}</span>
            </div>

            <div className="title">
                <span>Account Summary</span>
            </div>

            <GenerateUserPetsTable userPet = {props.userPet} goToFormPage = {goToFormPage}/>
            <GenerateTransactionTable/>
            <Footer/>
        </div>
        </React.Fragment>
    )

}

export default withRouter(ProfilePage);