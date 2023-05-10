import React from 'react';
import "./SlideProject.scss";
import Slider from 'infinite-react-carousel';



const SlideProject = ({ children, slidesToShow, arrowsScroll }) => {
    return (
        <div className='slide'>
            <div className="container">
                <h1>Get inspired with projects made by our freelancers</h1>
                <Slider slidesToShow={slidesToShow} arrowsScroll={arrowsScroll}>
                    {children}
                </Slider>
            </div>
        </div>
    )
}

export default SlideProject;