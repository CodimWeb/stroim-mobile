'use strict'

import $ from 'jquery';

import Util from 'bootstrap/js/dist/util.js'
import Modal from 'bootstrap/js/dist/modal'
import { Collapse } from 'bootstrap';
import slick from 'slick-carousel';
import moment from 'moment';
import daterangepicker from 'jquery-date-range-picker';
import select2 from 'select2';
import magnificPopup from 'magnific-popup/dist/jquery.magnific-popup';


//styles
import "jquery-date-range-picker/dist/daterangepicker.min.css"
import 'slick-carousel';
import 'magnific-popup/dist/magnific-popup.css';
import '../scss/style.scss';

$(document).ready(function(){
    
    $('.direction-slider .slider').slick({
        speed: 500,
        infinite: false,
        slidesToScroll: 1,
        slidesToShow: 4,
        pauseOnFocus: false,
        pauseOnHover: false,
        arrows: true,
        prevArrow: $('.direction-slider-prev'),
        nextArrow: $('.direction-slider-next'),
        dots: false
    });

    $('.review-slider .slider').slick({
        speed: 500,
        infinite: false,
        slidesToScroll: 1,
        slidesToShow: 3,
        pauseOnFocus: false,
        pauseOnHover: false,
        arrows: true,
        prevArrow: $('.review-slider-prev'),
        nextArrow: $('.review-slider-next'),
        dots: false
    });

    $('.select').select2({
        width: '100%',
        selectionCssClass: 'base-select',
        dropdownCssClass: 'base-select-dropdown'
    });

    $('.select-transparent').select2({
        width: '100%',
        selectionCssClass: 'select-transparent',
        dropdownCssClass: 'select-transparent-dropdown',
    });

    $('.select-unborder').select2({
        width: '100%',
        selectionCssClass: 'select-unborder',
        dropdownCssClass: 'select-transparent-dropdown',
    });

    $(document).on('focus', '.materil-group__input', function() {
        $(this).closest('.materil-group').addClass('active');
    })

    $(document).on('blur', '.materil-group__input', function(e) {
        if (e.target.value == '') {
            $(this).closest('.materil-group').removeClass('active');
        }
    })

    $('.materil-group__input').each((index, item ) => {
        if($(item).val()) {
            $(item).closest('.materil-group').addClass('active');
        }
    })


    initialDatePicker();
    initCeniSlider();
    initProductsSlider();
    fileReader();
    phoneBtn();
    filterModal();
    collapseFilter();
    initHeader();
});

function initialDatePicker() {

    /*Tender open time range*/
    moment.locale("ru");
    if(document.querySelector('input[name="daterange"]')) {
        $('input[name="daterange"]').dateRangePicker({
            separator: ' по ',
            language: 'ru',
            startOfWeek: 'monday',
            startDate: Date.now(),
            format: 'HH:mm DD MMMM YYYY',
            time: {
                enabled: true
            },
            /*defaultTime: moment().startOf('day').hour(9).minute(0).toDate(),*/
            defaultEndTime: moment().startOf('day').hour(17).minute(0).toDate(),
            minDays: 1,
            maxDays: 15,
            selectForward: true,
            autoClose: true,
            setValue: function (s, s1, s2) {
                $('input[name="daterange"]').val(s);
            },
            customOpenAnimation: function (cb) {
                $(this).fadeIn(300, cb);
            },
            customCloseAnimation: function (cb) {
                $(this).fadeOut(300, cb);
            }
        }).bind('datepicker-change',function(event,obj) {
            $('#startDate').val(obj.date1.getTime());
            $('#expiryDate').val(obj.date2.getTime());
        });
    }
};

function initCeniSlider() {
    const $slider = $(".js-slider-ceni .slider-wrapper");

    $slider.slick({
        dots: true,
        arrows: false,
    });
}

function initProductsSlider() {
    const $slider = $(".js-slider-products .slider-wrapper");
    $slider.slick({
        dots: true,
        arrows: false,
        slidesToShow: 1,
        variableWidth: true
    });
};

function fileReader() {
    const fileReaders = document.querySelectorAll(".file-reader");

    if (!(fileReaders && fileReaders.length)) return;

    fileReaders.forEach((fileReader) => {
        var fileInput = fileReader.querySelector(".file-reader__input");
        var button = fileReader.querySelector(".file-reader__label");
        var theReturn = fileReader.querySelector(".file-reader__return")
        var theReturnText = fileReader.querySelector(".file-reader__return-text");
        var closeBnt = fileReader.querySelector('.file-reader__icon-close');
        fileInput.addEventListener("change", function() {
            button.classList.add('loading');
            getData();
        });

        function getData() {
            const files = fileInput.files[0];
            if (files) {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(files);
                fileReader.addEventListener("load", function(e) {
                    setTimeout(() => {
                        button.classList.remove('loading')
                    }, 500)
                    theReturnText.textContent = files.name;
                    theReturn.style.display = "flex";
                });
                closeBnt.addEventListener('click', function() {
                    theReturn.style.display = "none";
                    fileReader.abort()
                    $(this).closest('.file-reader').find('.file-reader__input').val('');
                })
            }
            setTimeout(() => {
                button.classList.remove('loading')
            }, 500)
        }
    })
};

function phoneBtn() {
    const $links = $('.js-show-phone');
    if(!$links) return;
    $links.on('click', function (e) {
        e.preventDefault();
        $(e.target).closest('.phone-btn').toggleClass('show-number')
    })
};

function filterModal() {
    $('.js-filter').length && $('.js-filter').magnificPopup({
        type: 'inline',
        fixedContentPos: true,
        removalDelay: 500, //delay removal by X to allow out-animation
        callbacks: {
            beforeOpen: function() {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
    });
}

function collapseFilter() {
    const $links = $('.js-filter-show-more');
    $links.on('click', function(e) {
        e.preventDefault();
        const $target = $(e.target);
        $target.closest('.filter-collapse').find('.filter-collapse__box').toggleClass('show');
        $target.closest('.js-filter-show-more').hide();
    })
};

function initHeader() {
    const $header = $('.header');
    if(!$header.length) return;

    const $menuBtn = $header.find('.header__menu-btn');
    const $backBtn = $header.find('.header__search-reset');
    const $searchInput = $header.find('.search-input__field');

    $menuBtn.length && $menuBtn.magnificPopup({
        type: 'inline',
        fixedContentPos: true,
        removalDelay: 500, //delay removal by X to allow out-animation
        callbacks: {
            beforeOpen: function() {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
    });

    $searchInput.on('input', function (e) {
        const value = $(e.target).val();
        if(value.length) {
            if($header.hasClass('search-start')) return;
            $header.addClass('search-start');
        }else{
            $header.removeClass('search-start');
        }
    });

    $backBtn.on('click', function(e) {
        e.preventDefault();
        $header.removeClass('search-start');
        $searchInput.val('');
    });
}