FXMobile.AN_SkattemassigAvskrivning = function (params) {

    var viewModel = {
        showAnlnr: ko.observable(false),
        showHuvanlnr: ko.observable(false),
        styleWidth: ko.observable("90%"),
        huvanlNr: ko.observable(),
        anlNr: ko.observable(),
        typ: ko.observable(),
        datum: ko.observable(),
        anlTyp: ko.observable('RA'), // PR RV
        periodiseringsDatum: ko.observable(),
        verSerie: ko.observable(),
        ds: ko.observable(),
        

        typAvskrivning: function (e) {
            this.showAnlnr(false);
            this.showHuvanlnr(false);

            switch (e.value) {
                case 'En huvudanläggning':
                    this.showHuvanlnr(true);
                    break;
                case 'Alla anläggningar':
                    break;
                case 'En anläggning':
                    this.showAnlnr(true);
                    break;
            }

        },


        dsREARE: new DevExpress.data.DataSource({
            store: FXMobile.db.REARE,
        }),

        dsREANH: new DevExpress.data.DataSource({
            store: FXMobile.db.REANH,
        }),

        dsFenix_VerSerie: new DevExpress.data.DataSource({
            store: FXMobile.db.Fenix_VerSerie,
            sort: [{ getter: "Namn" }],
        }),


        viewShowing: function () {
            if (DevExpress.devices.current().platform === 'generic') {
                this.styleWidth("30%");
            }
        },

        skapaTransClick: function (e) {
            this.ds({ store: AN_GetSkattemassiga() }) 
        },

    };



    return viewModel;
};








