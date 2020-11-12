import React from 'react';
import Slider from 'react-slick';
import './style.css';

import CollectionCard from '../Collection/CollectionCard'

class CollectionCarousel extends React.Component {
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
        //Get the collections
        const { collections, title } = this.props;

        return (
            <div className="collection-carousel">
                <h1 className="collection-carousel-title">{ title }</h1>
                <Slider {...this.settings}>
                {
                    collections.map((collection, index) => {
                        return (
                            <CollectionCard 
                                {...collection}
                                showDelete={false}
                                inverted={true}
                                key={index}/>
                        )
                    })
                }
                </Slider>
            </div>
        );
    }
}

export default CollectionCarousel;