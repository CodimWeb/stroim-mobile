class Tender {
    constructor() {
        this.lotList = [
            {
                categories: [],
                isShowTable: false,
                title: '',
                description: '',
                note: '',
                estimated: '',
                delivery: false,
                address: ''
            }
        ];
        this.activeLotIndex = 0;
    }

    getSelectedCategories = () => {
        $('.filter-collapse__list input').prop('checked', false);
        this.lotList[this.activeLotIndex].categories.map((item) => {
            $(`input[value=${item.id}]`).prop('checked', true)
        })
    } 

    render = () => {
        let htmlNav = '';
        let htmlContent = '';

        this.lotList.map((item, index) => {
            htmlNav += `<li class="nav-item" role="presentation">
                                <a class="nav-link ${this.activeLotIndex == index ? 'active' : ''}" id="lot-${index + 1}-tab" data-toggle="tab" href="#lot-${index + 1}" role="tab" data-index="${index}" >Лот ${index + 1}</a>
                            </li>`;

            let lotTableAction = `<div class="create-tender__action mt-3 mb-4">
                                    <a href="#" class="link" data-toggle="modal" data-target="#choose-position">Выбрать позиции</a>
                                    <a href="#" class="link js-remove-lot" ${this.lotList.length == 1 ? 'disabled' : ''} data-index="${index}">Удалить лот</a>
                                </div>`
            let lotTable = '';
            item.categories.map((item, index2) => {
                lotTable += `<div class="basket-card mb-32" lot-category-index="${index2}">
                                <div class="basket-card__head">
                                    <span class="text sm"><strong>№${index2 + 1}</strong></span>
                                </div>
                                <div class="basket-card__row">
                                    <div class="basket-card__col">
                                        <p class="xs grey">Наименование</p>
                                        <p class="sm">
                                            ${item.name}
                                        </p>
                                    </div>
                                </div>
                                <div class="basket-card__row">
                                    <div class="basket-card__col basket-card__col-6">
                                        <p class="xs grey mb-1">Кол-во</p>
                                        <input type="text" class="form-control base-input sm lot-category-input quantity" value="${item.quantity ? item.quantity : ''}" name="lots[${index}].tenderItems[${index2}].quantity">
                                    </div>
                                    <div class="basket-card__col basket-card__col-6">
                                        <p class="xs grey mb-1">Ед. изм</p>
                                        <select name="" id="" class="select select--sm lot-category-select unitId" value="${item.unitId ? item.unitId : ''}" name="lots[${index}].tenderItems[${index2}].unitId">
                                            <option value="1">кг</option>
                                            <option value="2">центнер</option>
                                            <option value="4">тона</option>
                                            <option value="5">килотона</option>
                                            <option value="6">мегатона</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="basket-card__row">
                                    <div class="basket-card__col basket-card__col-6">
                                        <p class="xs grey mb-1">Размер/Толщина</p>
                                        <input type="text" class="form-control base-input sm lot-category-input size" value="${item.size ? item.size : ''}" name="lots[${index}].tenderItems[${index2}].size">
                                    </div>
                                    <div class="basket-card__col basket-card__col-6">
                                        <p class="xs grey mb-1">Длина (X ширина)</p>
                                        <input type="text" class="form-control base-input sm lot-category-input length" value="${item._length ? item._length : ''}" name="lots[${index}].tenderItems[${index2}].length">
                                    </div>
                                </div>
                                <div class="basket-card__row">
                                    <div class="basket-card__col basket-card__col-6">
                                        <p class="xs grey mb-1">Сорт</p>
                                        <input type="text" class="form-control base-input sm lot-category-input steel" value="${item.steel ? item.steel : ''}" name="lots[${index}].tenderItems[${index2}].steel">
                                    </div>
                                    <div class="basket-card__col basket-card__col-6">
                                        <p class="xs grey mb-1">Цена (не больше)</p>
                                        <input type="text" class="form-control base-input sm lot-category-input maxPrice" value="${item.maxPrice ? item.maxPrice : ''}" name="lots[${index}].tenderItems[${index2}].maxPrice">
                                    </div>
                                </div>
                                <div class="basket-card__row">
                                    <div class="basket-card__col">
                                        <p class="xs grey mb-1">Примечание</p>
                                        <input type="text" class="form-control base-input sm lot-category-input comment" placeholder="Примечание" value="${item.comment ? item.comment : ''}" name="lots[${index}].tenderItems[${index2}].comment">
                                    </div>
                                </div>
                                ${
                                    item.isCloned ? '<a href="#" class="link basket-card__footer lot-remove-category"><strong>Удалить</strong></a>':
                                                    '<a href="#" class="link basket-card__footer lot-clone-category"><strong>Дублировать</strong></a>'
                                }
                                
                            </div>`;
            })
            
            htmlContent += `<div class="tab-pane fade ${this.activeLotIndex == index ? 'show active' : ''}" id="lot-${index + 1}" role="tabpanel" aria-labelledby="lot-${index + 1}-tab" data-index="${index}">
                                ${item.categories.length == 0 ?
                                    `<div class="lot-empty">
                                        <p class="lot-empty__title">Вы ещё не выбрали ни одну позицию.</p>
                                        <button class="btn btn-primary btn-block" data-toggle="modal" data-target="#choose-position">Выберите позиции</button>
                                    </div>`
                                    :
                                    `<div>
                                        ${!item.isShowTable ?
                                            `<div class="tender-select-category">
                                                <p class="tender-select-category__title">Вы объявляете тендер на приобретение следующих категорий сортамента:</p>
                                                <p class="tender-select-category__list">
                                                ${item.categories.map((category, index) =>{ 
                                                    return index == 0 ? `${category.name}` : ` ${category.name}`})
                                                }
                                                </p>
                                                <p class="text-center link sm mb-2"><a href="#" data-toggle="modal" data-target="#choose-position">Изменить</a></p>
                                                <p class="text-center sm gray"><a href="#" class="link sm lot-show-table">Заполните таблицу</a> или <a href="#" class="link sm tender-add-file">Добавить файл</a></p>
                                            </div>`
                                            :
                                            lotTableAction + lotTable
                                        }
                                    </div>
                                    <h5 class="mt-4 mb-2">Описание лота</h5>
                                    <label class="materil-group mb-4 ${item.title ? 'active' : ''}">
                                        <span class="materil-group__label">Заголовок лота<span class="red">*</span></span>
                                        <input type="text" class="form-control base-input materil-group__input lg lot-description-input lot-input-title" value="${item.title ? item.title : ''}" name="lots[${index}].title">
                                    </label>

                                    <label class="materil-group mb-4 ${item.description ? 'active' : ''}"">
                                        <span class="materil-group__label">Дополнительные сведения</span>
                                        <input type="text" class="form-control base-input materil-group__input lg lot-description-input lot-input-description"  value="${item.description ? item.description : ''}" name="lots[${index}].description">
                                    </label>

                                    <label class="materil-group mb-4 ${item.note ? 'active' : ''}">
                                        <span class="materil-group__label">Примечание</span>
                                        <input type="text" class="form-control base-input materil-group__input lg lot-description-input lot-input-note" value="${item.note ? item.note : ''}" name="lots[${index}].note">
                                    </label>

                                    <label class="materil-group mb-4 ${item.estimated ? 'active' : ''}"">
                                        <span class="materil-group__label">Ориентировочная сумма контракта</span>
                                        <input type="text" class="form-control base-input materil-group__input lg lot-description-input lot-input-estimated" value="${item.estimated ? item.estimated : ''}" name="lots[${index}].estimatedCost">
                                    </label>

                                    <label class="mb-4">
                                        <input type="checkbox" class="lot-description-checkbox" ${item.delivery ? 'checked' : ''} name="tender.lots[${index}].delivery">
                                        <span class="checkbox__text">Требуется доставка</span>
                                    </label>

                                    <label class="materil-group mb-32 ${item.address ? 'active' : ''}">
                                        <span class="materil-group__label">Адрес доставки</span>
                                        <input type="text" class="form-control base-input materil-group__input lg lot-description-input lot-input-address" value="${item.address ? item.address : ''}" name="lots[${index}].deliveryAddress">
                                    </label>`
                                }   
                            </div>`;
        })

        $('#create-tender-nav').html(htmlNav);
        $('#create-tender-content').html(htmlContent);
        $('.select.select--sm').select2({
            width: '100%',
            selectionCssClass: 'base-select select--sm',
            dropdownCssClass: 'base-select-dropdown',
        })

        $('.basket-card .select').each(function(){
            // console.log($(this).val(), 'loop sel val')
            var value = $(this).attr('value');
            $(this).val(value)
            $(this).trigger('change');
        });
    }    
}

export default Tender;