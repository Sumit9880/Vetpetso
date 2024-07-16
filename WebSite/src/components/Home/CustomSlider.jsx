import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { STATIC_URL } from "../../utils/api";


const CustomSlider = ({ images }) => {
    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        customPaging: (i) => (
            <div className="dot"></div>
        ),
        dotsClass: "slick-dots custom-dots",
        autoplaySpeed: 5000
    };

    return (
        <Slider {...carouselSettings} className="relative w-full">
            {images.map((image) => (
                <div key={image.ID} className="relative w-full h-auto overflow-hidden">
                    <img
                        className="w-full h-auto object-contain transition-transform duration-300 transform hover:scale-105"
                        src={`${STATIC_URL}Banners/${image.URL}`}
                        alt={image.NAME}
                    />
                </div>
            ))}
        </Slider>
    );
};

export default CustomSlider;
