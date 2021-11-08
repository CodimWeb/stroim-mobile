'use strict'

import JQuery from 'jquery';
window.$ = window.JQuery = JQuery;

import Util from 'bootstrap/js/dist/util.js'
import Modal from 'bootstrap/js/dist/modal'
import { Collapse } from 'bootstrap';
import slick from 'slick-carousel';
import moment from 'moment';
import Inputmask from "inputmask";
import daterangepicker from 'jquery-date-range-picker';
import select2 from 'select2';
import magnificPopup from 'magnific-popup/dist/jquery.magnific-popup';
import Dropzone from "dropzone";
import Tender from './Tender';


//styles
import "jquery-date-range-picker/dist/daterangepicker.min.css"
import 'slick-carousel';
import 'magnific-popup/dist/magnific-popup.css';
import "dropzone/dist/dropzone.css";
import '../scss/style.scss';

Dropzone.autoDiscover = false;
$(document).ready(function(){

    var phones = document.querySelectorAll('.phone-input')
    if (phones) {
        Inputmask({ "mask": "+7(999) 999-99-99" }).mask(phones);
    }

    $('.main-slider .slider').slick({
        dots: true,
        arrows: false,
        slidesToShow: 1,
        adaptiveHeight: true,
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

    $('.select.select--sm').select2({
        width: '100%',
        selectionCssClass: 'base-select select--sm',
        dropdownCssClass: 'base-select-dropdown',
    })

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
    });

    $('.js-modal-close').on( "click", function() {
        $.magnificPopup.close();
    });


    initialDatePicker();
    initCeniSlider();
    initProductsSlider();
    fileReader();
    phoneBtn();
    filterModal();
    collapseFilter();
    initHeader();
    initImageLoader();
    autoHeightTextarea();
    positionModal();
    locationModal();
    categoryModal();

    const tender = new Tender;
    tender.render();

    $('.btn-add-lot').on('click', function(e){
        if(tender.lotList.length < 7) {
            var lot = {
                categories: [],
                isShowTable: false,
            }
            tender.lotList.push(lot);
            tender.activeLotIndex = tender.lotList.length -1;
            tender.render();
            tender.getSelectedCategories();
            console.log(tender.lotList);
        }
    })

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
    const $link = $('.js-filter');
    $link.length && $link.magnificPopup({
        type: 'inline',
        fixedContentPos: true,
        removalDelay: 500, //delay removal by X to allow out-animation
        callbacks: {
            beforeOpen: function() {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
    });
};

function positionModal() {
    $('#choose-position').on('show.bs.modal', function () {
        const $search = $('.js-position-search');
        $search.on('input', function (e) {
            const $wrapper = $(e.target).closest('.filter-collapse__body')
            const $showMore = $wrapper.find('.js-filter-show-more');
            const substr = $(e.target).val().toLowerCase();
            const $checkbox = $wrapper.find('input[type="checkbox"]');
            if(substr.length) {
                $wrapper && $wrapper.removeClass('show-all');
                $showMore.hide();
                $checkbox.each((_, item) => {
                    const value = $(item).data('value').toLowerCase();
                    if(!value.includes(substr)) {
                        $(item).closest('.filter-collapse__row').hide()
                    }else {
                        $(item).closest('.filter-collapse__row').show()
                    }
                })
            }else {
                $wrapper && $wrapper.addClass('show-all');
                $showMore.show();
                $checkbox.each((_, item) => {
                    $(item).closest('.filter-collapse__row').css("display","");
                })
            }
        });
    });
    $('#choose-position').on('hidden.bs.modal', function () {
        const $resultsContainer = $('.js-choose-position-result');
        const $currentCheck = $('.position-checkbox');
        let accum = [];
        $currentCheck.each((i, el) => {
            if($(el).is(":checked")) {
                accum.push($(el).val());
            }
        });
        $resultsContainer.text(accum.join(', '))
    });
};

function categoryModal() {
    $('#choose-category').on('show.bs.modal', function () {
        const $search = $('.js-category-search');
        $search.on('input', function (e) {
            const $wrapper = $(e.target).closest('.filter-collapse__body')
            const $showMore = $wrapper.find('.js-filter-show-more');
            const substr = $(e.target).val().toLowerCase();
            const $checkbox = $wrapper.find('input[type="radio"]');
            if(substr.length) {
                $wrapper && $wrapper.removeClass('show-all');
                $showMore.hide();
                $checkbox.each((_, item) => {
                    const value = $(item).data('value').toLowerCase();
                    if(!value.includes(substr)) {
                        $(item).closest('.filter-collapse__row').hide()
                    }else {
                        $(item).closest('.filter-collapse__row').show()
                    }
                })
            }else {
                $wrapper && $wrapper.addClass('show-all');
                $showMore.show();
                $checkbox.each((_, item) => {
                    $(item).closest('.filter-collapse__row').css("display","");
                })
            };
        });
    });

    $('#choose-category').on('hidden.bs.modal', function () {
        const $resultsContainer = $('.js-choose-category-result');
        const $currentCheck = $('.category-radio');
        let accum = [];
        $currentCheck.each((i, el) => {
            if($(el).is(":checked")) {
                accum.push($(el).val());
            }
        });
        $resultsContainer.val(accum.join(', '))
        $resultsContainer.focus();
    });
}

function locationModal() {
    $('#choose-location').on('show.bs.modal', function () {
        const $search = $('.js-location-search');
        $search.on('input', function (e) {
            const substr = $(e.target).val().toLowerCase();
            $('.location-checkbox__input').each((_, item) => {
                const value = $(item).data('value').toLowerCase();
                if(!value.includes(substr)) {
                    $(item).closest('.location-checkbox-wrap').hide()
                }else {
                    $(item).closest('.location-checkbox-wrap').show()
                }
            })
        });
    });

    $('#choose-location').on('hidden.bs.modal', function () {
        const $resultsContainer = $('.js-choose-location-result');
        const $currentCheck = $('.location-checkbox__input');
        let accum = [];

        $currentCheck.each((i, el) => {
            if($(el).is(":checked")) {
                accum.push($(el).val());
            }
        });
        if($resultsContainer.is("input")){
            $resultsContainer.val(accum.join(', '));
            $resultsContainer.focus();
        }else {
            $resultsContainer.text(accum.join(', '));
        }
    });
};

function collapseFilter() {
    const $links = $('.js-filter-show-more');
    $links.on('click', function(e) {
        e.preventDefault();
        const $target = $(e.target);
        $target.closest('.filter-collapse__body').toggleClass('show-all');
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
};

function initImageLoader() {
    const dropzone = document.getElementById('my-form');
    if(!dropzone) return;
    let num = 1;
    new Dropzone("#my-form", {
        url: "/",
        autoProcessQueue: false,
        init: function() {
            this.on("addedfile", function(file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    let img = new Image();
                    img.src = reader.result;
                    $(`.preview-box--${num}`).html(img);
                    $(`.preview-box--${num}`).append(`<span class="preview-box--bg" style="background-image: url(${reader.result})"></span>`)
                    num === 5 ? num = 1 : num ++;
                }
            })
        }
    });
};

function autoHeightTextarea() {
    document.querySelectorAll('textarea').forEach(el => {
        el.style.height = el.setAttribute('style', 'height: ' + el.scrollHeight + 'px');
        el.classList.add('auto');
        el.addEventListener('change', e => {
            el.style.height = 'auto';
            el.style.height = (el.scrollHeight) + 'px';
        });
    });
}