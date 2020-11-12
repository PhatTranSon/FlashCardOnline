import React from 'react';
import './style.css';
import Slider from 'react-slick';

import Card from '../Card/Card';

class CardCarousel extends React.Component {
    constructor(props) {
        super(props);

        //Set const carousel setting
        this.settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 2000,
            adaptiveHeight: true
        };
    }

    render() {
        const { cards, title } = this.props;

        return (
            <div>
                <h1 className="card-carousel-title">{ title }</h1>
                <Slider {...this.settings}>
                {
                    cards.map((card, index) => {
                        return (
                            <Card 
                                {...card}
                                showDelete={false}
                                key={index}/>
                        )
                    })
                }
                </Slider>
            </div>
        );
    }
}

export default CardCarousel;