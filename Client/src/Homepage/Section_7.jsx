import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './Section_7.css'

const ContactUs = (props) => {

    let form = <Form>
        <h3>Share your concern with us below</h3>
        <Form.Group className="mb-3" controlId="controlInput_Name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeHolder="Name"/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="controlInput_email">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="name@email.com"/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="controlInput_textarea">
            <Form.Label>Feedback</Form.Label>
            <Form.Control as="textarea" rows={3}/>
        </Form.Group>
        <Button variant="primary" type="submit">
            Submit
        </Button>
    </Form>

    return (
        <React.Fragment>
            <div id="contactUs" className="section7">
                <h2>Connect with us!</h2>
                <div className="contentArea">
                    {form}
                    <div className="contactInfo">
                        <h3>Where you can find us</h3>
                        <img src='../Images/Section_7_pic_1.JPG'/>
                        <p>Contact number: +65 1234 5678</p>
                        <p>Email: PetMart@gmail.com</p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ContactUs