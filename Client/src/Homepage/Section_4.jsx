import React, {useEffect, useState} from 'react'
import content from "./SliderContent"
import Slider from "react-slick";
import './Section_4.css'

const Cards = (props) => (

    <figure className="cardStyle">
        <img src={props.data.imagePath}/>
        <figcaption>
            <h3>{props.data.foodName}</h3>
            <h5>{props.data.foodText}</h5>
        </figcaption>
        <a href="#"></a>
    </figure>
)

const Carousel = (props) => {
    const [window_width, setWindow_width] = useState(0)
    const [window_height, setWindow_height] = useState(0)

    const [carouselSettings , setCarouselSettings] = useState({
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
    })

    useEffect(() => {
        //update window_width/height when component mount

        const updateCarouselSettings = () => {
            if (window.innerWidth < 800) {
                console.log("entered here")
                setCarouselSettings({
                    dots: true,
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                })
            }
            else {
                setCarouselSettings({
                    dots: true,
                    infinite: true,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                })
            }
        }
        window.addEventListener("resize" , updateCarouselSettings)
        return () => window.removeEventListener("resize", updateCarouselSettings)
    }, [],)


    let cardsTemplate;
    if (content.length > 0) {
        cardsTemplate = content.map(function (item, index) {
            return (
                <div key={index}>
                    <Cards data={item}/>
                </div>
            )
        })
    } else {
        cardsTemplate = <p>Please add some cards</p>
    }

    return (
        <div className='section4V2'>
            <h2 className="recommendedProducts">Vets recommendations</h2>
            <span> *hover to see products details </span>
            <Slider {...carouselSettings}>{cardsTemplate}</Slider>
        </div>
    );

}

export default Carousel
