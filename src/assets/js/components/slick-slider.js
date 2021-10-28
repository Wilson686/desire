/* Slick Slider */
/* Слайдер для блока Intro */
//= ../../../../node_modules/slick-carousel/slick/slick.js

const introSlider = $("#intro__slider");

introSlider.slick({
    arrows: false,
    dots: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 12000
});