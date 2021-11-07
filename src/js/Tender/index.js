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
}

export default Tender;