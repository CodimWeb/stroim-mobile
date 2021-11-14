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

    // добавление лотов
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

    // переключение лотов
    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (event) {
        event.target // newly activated tab
        event.relatedTarget // previous active tab
        tender.activeLotIndex = event.target.getAttribute('data-index');
        tender.getSelectedCategories();
        console.log(tender.activeLotIndex);

    });

    // добавление категорий в лот
    $('.filter-collapse__list input').on('change', function(e) {
        console.log(tender.activeLotIndex, 'activeLotIndex')
        var category = {
            id: e.target.value,
            name: e.target.getAttribute('data-value'),
            isCloned: false,
            quantity: '',
            unitId: '',
            size: '',
            _length: '',
            steel: '',
            maxPrice: '',
            comment: '',
        }

        if($(this).prop('checked') == true) {
            tender.lotList[tender.activeLotIndex].categories.push(category)
        }
        else {
            tender.lotList[tender.activeLotIndex].categories = tender.lotList[tender.activeLotIndex].categories.filter(item => item.id != category.id);
        }
        tender.render();

        console.log(tender.lotList);
    })

    // показать таблицу
    $(document).on('click', '.lot-show-table', function(e){
        e.preventDefault();
        var index = $(this).closest('.tab-pane').attr('data-index');
        tender.lotList[index].isShowTable = true;
        tender.render();
    })

    $(document).on('click', '.tender-add-file', function(e){
        e.preventDefault();
        console.log('scroll');
        let offsetTop = $('.create-tender__footer').offset().top;
        $('body,html').animate({scrollTop: offsetTop}, 500);
    })

    // дублировать категорию
    $(document).on('click', '.lot-clone-category', function(e){
        e.preventDefault();
        let categoryIndex = $(this).closest('.basket-card').attr('lot-category-index');
        let insertPosition = 0;
        let categoryId = tender.lotList[tender.activeLotIndex].categories[categoryIndex].id;
        // определение позиции вставки
        for(let i = categoryIndex; i < tender.lotList[tender.activeLotIndex].categories.length; i++) {

            if(tender.lotList[tender.activeLotIndex].categories[i].id == categoryId) {
                insertPosition = i + 1;
            }
        }

        let category = Object.assign({}, tender.lotList[tender.activeLotIndex].categories[categoryIndex]);
        category.isCloned = true;
        category.quantity = '';
        category.unitId = '';
        category.size = '';
        category._length = '';
        category.steel = '';
        category.maxPrice = '';
        category.comment = '';

        tender.lotList[tender.activeLotIndex].categories.splice(insertPosition, 0, category)
        tender.render();
    })

    // удалить дублированую категорию
    $(document).on('click', '.lot-remove-category', function(e){
        e.preventDefault();
        let categoryIndex = $(this).closest('.basket-card').attr('lot-category-index');
        let category = Object.assign({}, tender.lotList[tender.activeLotIndex].categories[categoryIndex]);
        category.isCloned = true;
        tender.lotList[tender.activeLotIndex].categories.splice(categoryIndex, 1)
        tender.render();
    })

    // удалить лот
    $(document).on('click', '.js-remove-lot', function(e){
        e.preventDefault();
        if(tender.lotList.length > 1) {
            tender.lotList.splice(tender.activeLotIndex, 1);
            if(tender.activeLotIndex != 0) {
                tender.activeLotIndex--;
            }
            else {
                tender.activeLotIndex = 0;
            }
            tender.render()
            tender.getSelectedCategories();
            console.log(tender.lotList);
        }
    })

    // заполнение полей таблицы лота
    $(document).on('input', '.lot-category-input', function(e){
        let categoryIndex = $(this).closest('.basket-card').attr('lot-category-index');

        if($(this).hasClass('quantity')) {
            tender.lotList[tender.activeLotIndex].categories[categoryIndex].quantity = e.target.value;
        }

        if($(this).hasClass('size')) {
            tender.lotList[tender.activeLotIndex].categories[categoryIndex].size = e.target.value;
        }

        if($(this).hasClass('length')) {
            tender.lotList[tender.activeLotIndex].categories[categoryIndex]._length = e.target.value;
        }

        if($(this).hasClass('steel')) {
            tender.lotList[tender.activeLotIndex].categories[categoryIndex].steel = e.target.value;
        }

        if($(this).hasClass('maxPrice')) {
            tender.lotList[tender.activeLotIndex].categories[categoryIndex].maxPrice = e.target.value;
        }

        if($(this).hasClass('comment')) {
            tender.lotList[tender.activeLotIndex].categories[categoryIndex].comment = e.target.value;
        }
    })

    // заполнение селекта таблицы лота
    $(document).on('select2:select', '.lot-category-select.unitId', function(e){
        let categoryIndex = $(this).closest('.basket-card').attr('lot-category-index');
        console.log(e.target.value)
        tender.lotList[tender.activeLotIndex].categories[categoryIndex].unitId = e.target.value;

    });

    // заполнение описания лота
    $(document).on('input', '.lot-description-input', function(e){
        if($(this).hasClass('lot-input-title')) {
            tender.lotList[tender.activeLotIndex].title = e.target.value;
        }

        if($(this).hasClass('lot-input-description')) {
            tender.lotList[tender.activeLotIndex].description = e.target.value;
        }

        if($(this).hasClass('lot-input-note')) {
            tender.lotList[tender.activeLotIndex].note = e.target.value;
        }

        if($(this).hasClass('lot-input-estimated')) {
            tender.lotList[tender.activeLotIndex].estimated = e.target.value;
        }

        if($(this).hasClass('lot-input-address')) {
            tender.lotList[tender.activeLotIndex].address = e.target.value;
        }
    })

    $(document).on('change', '.lot-description-checkbox', function(e){
        if($(this).prop('checked') == true) {
            tender.lotList[tender.activeLotIndex].delivery = true;
        }
        else {
            tender.lotList[tender.activeLotIndex].delivery = false;
        }
    });

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

    $('.js-position-search').on('input', function(e) {
        console.log(e.target.value)
        var searchtList = $(this).closest('.filter-collapse__body').find('.filter-collapse__list');
        
        var links = searchtList.find('.filter-collapse__row');
        console.log(links)
        links.each(function() {
            console.log($(this).find('input').attr('data-value'));
            console.log($(this).find('input').attr('data-value').toLowerCase().indexOf(e.target.value.toLowerCase()) == -1)
            if ($(this).find('input').attr('data-value').toLowerCase().indexOf(e.target.value.toLowerCase()) == -1) {
                $(this).addClass('hidden');
            } else {
                $(this).removeClass('hidden');
            }
        })
        var visibleLink = searchtList.find('.filter-collapse__row:not(.hidden)');
        if (visibleLink.length < 9) {
            $(this).closest('.collapse').find('.filter-show-more').addClass('hidden')
        } else {
            $(this).closest('.collapse').find('.filter-show-more').removeClass('hidden')
        }
    });

    $('#choose-position').on('show.bs.modal', function () {
        // const $search = $('.js-position-search');
        // const $showMore = $('.js-filter-show-more').closest('.filter-collapse__row');
        // const $box = $('.filter-collapse__box');
        // $search.on('input', function (e) {
        //     const substr = $(e.target).val().toLowerCase();
        //     const $checkbox = $(this).closest('.filter-collapse').find('input[type="checkbox"]');
        //     $box.is(':hidden') && $box.show();
        //     $showMore.is(':visible ') && $showMore.hide();
        //     $checkbox.each((_, item) => {
        //         const value = $(item).attr('data-value').toLowerCase();
        //         if(!value.includes(substr)) {
        //             $(item).closest('.filter-collapse__row').hide()
        //         }else {
        //             $(item).closest('.filter-collapse__row').show()
        //         }
        //     })
        // });
        
    });
    $('#choose-position').on('hidden.bs.modal', function () {
        const $resultsContainer = $('.js-choose-position-result');
        const $currentCheck = $('.position-checkbox');
        let accum = [];

        $currentCheck.each((i, el) => {
            if($(el).is(":checked")) {
                accum.push($(el).attr('data-value'));
            }
        });
        $resultsContainer.text(accum.join(', '))
    });
};

function locationModal() {
    $('#choose-location').on('show.bs.modal', function () {
        const $search = $('.js-location-search');
        $search.on('input', function (e) {
            const substr = $(e.target).val().toLowerCase();
            $('.location-checkbox__input').each((_, item) => {
                const value = $(item).val().toLowerCase();
                console.log(value, 'value');
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

function categoryModal() {

    $('#choose-category').on('show.bs.modal', function () {
        // const $search = $('.js-category-search');
        // const $showMore = $('.js-filter-show-more').closest('.filter-collapse__row');
        // const $box = $('.filter-collapse__box');
        // $search.on('input', function (e) {
        //     const substr = $(e.target).val().toLowerCase();
        //     const $checkbox = $(this).closest('.filter-collapse').find('input[type="radio"]');
        //     $box.is(':hidden') && $box.show();
        //     $showMore.is(':visible ') && $showMore.hide();
        //     $checkbox.each((_, item) => {
        //         const value = $(item).val().toLowerCase();
        //         if(!value.includes(substr)) {
        //             $(item).closest('.filter-collapse__row').hide()
        //         }else {
        //             $(item).closest('.filter-collapse__row').show()
        //         }
        //     })
        // });

        //select checkbox
        const $resultsContainer = $('.js-choose-category-result');
        let accum = [];
        $('.category-radio').on('change', function(e) {
            const $currentCheck = $(e.target);
            const checkedVal = $currentCheck.attr('data-value');

            if($currentCheck.is(":checked")) {
                accum.push(checkedVal);
            }else {
                accum = accum.filter(item => item !== checkedVal);
            }
            $resultsContainer.val(accum.join(', '));
            $resultsContainer.focus();
        });
    });

}

function collapseFilter() {
    $(document).on('click', '.js-filter-show-more', function(e) {
        e.preventDefault();
        var links = $(this).closest('.filter-collapse__body').find('.filter-collapse__list .filter-collapse__row');
        var linkHeight = links.outerHeight();
        var maxHeight = (linkHeight + 12) * links.length;
        if ($(this).hasClass('active')) {
            $(this).closest('.filter-collapse__body').find('.filter-collapse__list').removeAttr('style')
            $(this).removeClass('active');
        } else {
            $(this).closest('.filter-collapse__body').find('.filter-collapse__list').css('max-height', maxHeight + 'px');
            $(this).addClass('active');
        }
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