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
        $('.tender-sidebar-category .sidebar__links__item input').prop('checked', false);
        this.lotList[this.activeLotIndex].categories.map((item) => {
            $(`input[value=${item.id}]`).prop('checked', true)
        })
    } 

    render = () => {
        let htmlNav = '';
        let htmlContent = '';

        this.lotList.map((item, index) => {
            htmlNav += `<li class="nav-item" role="presentation">
                                <a class="nav-link ${this.activeLotIndex == index ? 'active' : ''}" id="lot-${index + 1}-tab" data-toggle="tab" href="#lot-${index + 1}" role="tab" aria-controls="lot-${index + 1}" aria-selected="true">Лот ${index + 1}</a>
                            </li>`;
        })

        $('#create-tender-nav').html(htmlNav);
    }    
}

export default Tender;