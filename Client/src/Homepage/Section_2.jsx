import React from "react"
import "./Section_2.css"
import greenCircle1 from "../Images/greenCircle1.jpg"
import greenCircle2 from "../Images/greenCircle2.jpg"
import CoreValuesSpeech from "./CoreValueTextFile"
import {Container, Row, Col} from "react-bootstrap"

let flag1 = true;
let flag2 = false;

function MakeValuesStatement(props) {
    let decorationToUse = props.flag ? greenCircle1 : greenCircle2

    return (
        <div className="InnerContainer">
            <img className="ValuesImage1" src={decorationToUse}/>
            <h3 class="CoreValues">{props.values}</h3>
            <p>{props.text}</p>
        </div>
    )
}

const CoreValues = (props) => {

    var self = this

    let generateCoreValuesSpeech1 =
        CoreValuesSpeech.slice(0, 2).map(function (speech) {
            {
                flag1 = flag1 ? false : true
            }
            return (
                <Col md={6}>
                    <MakeValuesStatement values={speech.coreValues} text={speech.writeUp} flag={flag1}/>
                </Col>
            )
        })


    let generateCoreValuesSpeech2 =
        CoreValuesSpeech.slice(2, 4).map(function (speech) {
            {
                flag2 = flag2 ? false : true
            }
            return (
                <Col md={6}>
                    <MakeValuesStatement values={speech.coreValues} text={speech.writeUp} flag={flag2}/>
                </Col>
            )
        })


    return (
        <React.Fragment>
            <div id="about" className="Section2">
                <h2 className="MissionTitle">Why Choose Us</h2>
                <p className="ValuesTitle">Personalised pet food. We tailored our selection of pet foods according to
                    your pet needs!</p>
                <Container>
                    <Row>
                        {generateCoreValuesSpeech1}
                    </Row>
                    <Row>
                        {generateCoreValuesSpeech2}
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    )

}

export default CoreValues

