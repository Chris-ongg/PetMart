import React, {useEffect, useState} from 'react'
import {Col, FloatingLabel, Form, Row} from "react-bootstrap";
import {petType, breedList, healthIssue} from './FormPageInfo'
import  {withRouter} from "react-router-dom"
import {gql, useMutation} from "@apollo/client";

import GenerateShoppingBagView from "../NavBar/NavBarModules/GenerateShoppingBagView";
import Footer from "../Footer/Footer"
import NavBar from "../NavBar/NavBar";
import './FormPage.css'


const gender = ["Male" , "Female"]
const petRegistration = gql` 
    mutation newPetRegistration (
            $name: String!, 
            $gender: String!,
            $species: String!,
            $petBreed: String!,
            $age: String!,
            $weight: String!,
            $healthConcern: String!,
            $ownerEmail: String!
        ){
        registerPet(newPet: {
            name: $name,
            gender: $gender,
            species: $species,
            petBreed: $petBreed,
            age: $age,
            weight: $weight,
            healthConcern: $healthConcern,
            ownerEmail: $ownerEmail
        }) 
        {
            name
            ownerEmail
        }
    }`;

function GenerateSelectValue(props) {
    let generateValue = props.content.map(function (value_) {
        return (<option value={value_}> {value_}</option>)
    })

    return generateValue
}

function GenerateSelectValueForPetType(props) {

    let petBreedList = ["None"];
    props.breedList.forEach(function (content) {
        if (content.petType == props.petType) {
            petBreedList = content.breeds
        }
    })

    let generateValue = petBreedList.map(function (value_) {
        return (<option value={value_}> {value_}</option>)
    })

    return generateValue
}

function checkFormInput(petDetails) {

    //let info = JSON.parse(JSON.stringify(petDetails));

    let status = true //assume no error in form
    let errMsg = "No error"
    if (petDetails.name.length < 2) {
        status = false
        errMsg = "Please enter a valid pet Name"
    }

    if ( petDetails.weight.toString() === "0.0") {
        status = false
        errMsg = "please enter a valid weight"
    }

    if ( petDetails.age === 0) {
        status = false
        errMsg = "please enter a valid age"
    }

    return {
        first: status,
        second: errMsg
    }
}



const FormPage = (props) => {

    const [registerPet]  = useMutation(petRegistration)

    //capture pet fields input
    const [petDetails , setPetDetails] = useState({
        name: "",
        gender: "Male",
        species: "Dog",
        petBreed: "GermanShepard",
        age: 0,
        weight: 0.0,
        healthConcern: "No Health Concern",
        ownerEmail: ""
    })

    const [shoppingCartDisplay , setShoppingCartDisplay] = useState(false)

    const toggleDisplayCart = () => {
        setShoppingCartDisplay(!shoppingCartDisplay)
    }

    const handleOnChange = (event) => {
        setPetDetails(prevState => ({...prevState, [event.target.name]: event.target.value}));
    }

    const handleSubmit = (event) => {
        //Check field input for pet registration
        //If success, register pet to database else show error message
        event.preventDefault()
        let validSubmit = checkFormInput(petDetails)
        if (validSubmit.first) {
            let result = registerPet({
                variables : petDetails
            })
        } else {
            alert(validSubmit.second)
        }
    }

    const submitAndReset = (event) => {
        //submit and reset form
        let validSubmit = checkFormInput(petDetails)
        if (validSubmit.first) {
            let result = registerPet({
                variables : petDetails
            })
        } else {
            alert(validSubmit.second)
        }
        //reset the state
        setPetDetails({
            name: "",
            gender: "Male",
            species: "Dog",
            petBreed: "GermanShepard",
            age: "",
            weight: "",
            healthConcern: "No Health Concern",
            ownerEmail: props.userDetails.email
         })
    }

    useEffect(() => {

        if (Object.is(props.userDetails.name , "")) {
            //if user is not log in, redirect back to home page
            props.history.push("/")
        }
        else {
            //set owner email
            setPetDetails(prevState => ({...prevState, ownerEmail: props.userDetails.email}));
        }

    } , [props.userDetails])

    //Generate the formpage look
    return (
        <React.Fragment>
            <GenerateShoppingBagView
                shoppingCartDisplay = {shoppingCartDisplay}
                userDetails = {props.userDetails}
                toggleDisplayCart = {toggleDisplayCart}
                cartItems = {0}
            />
        <div className = "formPage">

            <NavBar
                toggleDisplayCart = {toggleDisplayCart}
                toggleLoginNavBarView = {props.toggleLoginNavBarView}
                setProductTypeSelection = {props.setProductTypeSelection}
                userPet = {props.userPet}/>

            <Form className = "petRegistrationForm" onSubmit={handleSubmit}>
                <h1 className="titleText">Share with us about your pet(s)!</h1>
                <Row className="g-2 mb-4">
                    <Col>
                        <FloatingLabel controlId="floatingInputGrid" label="Pet Name">
                            <Form.Control type="text" placeholder="Pet Name" name="name" onChange={handleOnChange}/>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="floatingSelectGrid" label="Species">
                            <Form.Select aria-label="Floating label select example" name="species" onChange={handleOnChange}>
                                <GenerateSelectValue content={petType}/>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="floatingSelectGrid" label="Pet Breed">
                            <Form.Select aria-label="Floating label select example" name="petBreed" onChange={handleOnChange} >
                                <GenerateSelectValueForPetType petType={petDetails.species} breedList={breedList} />
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>


                <Row className="g-2 mb-4">

                    <Col>
                        <FloatingLabel controlId="floatingSelectGrid" label="Gender">
                            <Form.Select aria-label="Floating label select example" name="gender" onChange={handleOnChange}>
                                <GenerateSelectValue content={gender}/>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>

                    <Col>
                        <FloatingLabel controlId="floatingSelectGrid" label="Health Concern">
                            <Form.Select aria-label="Floating label select example" name="healthConcern" onChange={handleOnChange}>
                                <GenerateSelectValue content={healthIssue}/>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>

                </Row>

                <Form.Group className="mb-4">
                    <Row>
                        <Col >
                            <Form.Control  style={{height: '60px'}} type="number" placeholder="Age (years)" name="age" onChange={handleOnChange}/>
                        </Col>
                        <Col>
                            <Form.Control   style={{height: '60px'}} type="number" step="0.1" placeholder="Weight in Kg (e.g 5.2)" name="weight" onChange={handleOnChange}/>
                        </Col>
                    </Row>
                </Form.Group>


                <Form.Group className="mb-4">
                    <Form.Label >Please enter any other concern below (if any)</Form.Label>
                    <FloatingLabel controlId="floatingTextarea2" label="Comments">
                        <Form.Control
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{height: '100px'}}
                        />
                    </FloatingLabel>
                </Form.Group>

                <div className = "buttonRow">
                    <button type = 'reset' style = {{marginRight: 'auto'}}>Clear Form</button>
                    <button type = 'reset' onClick={submitAndReset}>Add Another Pet</button>
                    <button style = {{marginLeft: 'auto'}}>Submit</button>
                </div>

            </Form>



            <Footer/>
        </div>
        </React.Fragment>


    )
}

export default withRouter(FormPage)