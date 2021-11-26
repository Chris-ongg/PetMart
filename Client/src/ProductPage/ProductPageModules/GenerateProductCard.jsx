import React from 'react'
import {Card, Col, Row} from "react-bootstrap";
import {AiOutlineShoppingCart} from "react-icons/all";


//Generate product card look
const GenerateProductCard = (props) => {
    let temp_array = new Array(Math.ceil(props.content.length / 4)).fill(0)
    let temp;

    return (
        temp_array.map(function (item, index) {
            index ? temp = temp + 4 : temp = 0
            return (
                <Row className="row" key = {index}>
                    {
                        props.content.slice(temp, temp + 4).map(function (item_, index) {
                            return (
                                <Col key={index} xs={6} lg={3}>
                                    <Card className="card">
                                        <Card.Img variant="top" src={item_.imagePath} className="foodImage"/>
                                        <Card.Body style={{marginTop: '20px'}}>
                                            <Card.Text>
                                                {item_.name}
                                            </Card.Text>
                                            <Card.Text>
                                                {"$" + item_.price}
                                            </Card.Text>
                                            {item_.stock ?
                                                <Card.Text>
                                                    <AiOutlineShoppingCart size = {25} onClick={(event) => {props.addItemToCart(item_ , 1 , event)}}/>
                                                </Card.Text>:
                                                <Card.Text className="soldOutCardText">
                                                    Sold Out
                                                </Card.Text>
                                            }
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            )
        })
    )
}

export default GenerateProductCard