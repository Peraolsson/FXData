FXMobile.AN_Avskrivning = function (params) {

    var viewModel = {

        styleWidth: ko.observable("90%"),
        chkSimulera: ko.observable(false),
        visBfar: ko.observable(false),
        showAnlnr: ko.observable(false),
        showHuvanlnr: ko.observable(false),
        showGrupp: ko.observable(false),

        SkapaAvskrivning: function(e) {
            alert('To be implemented...');
        },

        handleBack: function () {
        	FXMobile.app.back();
        },

        typAvskrivning: function (e) {
            this.showAnlnr(false);
            this.showHuvanlnr(false);
            this.showGrupp(false);
            
            switch (e.value) {
                case 'En huvudanläggning':
                    this.showHuvanlnr(true);
                    break;
                case 'En grupp':
                    this.showGrupp(true);
                    break;
                case 'Alla anläggningar':
                    break;
                case 'En anläggning':
                    this.showAnlnr(true);
                    break;
            }

        },


        dsFenix_VerSerie: new DevExpress.data.DataSource({
            store: FXMobile.db.Fenix_VerSerie,
            sort: [{ getter: "Namn" }],
        }),

        dsREARE: new DevExpress.data.DataSource({
            store: FXMobile.db.REARE,
        }),

        dsREANH: new DevExpress.data.DataSource({
            store: FXMobile.db.REANH,
        }),

        dsTextr: {
            store: FXMobile.db.TEXTR,
            sort: [{ getter: "TEXT_TYP" }],
            filter: ['TEXT_TYP', '=', 'FG'],

        },

        viewShowing: function () {
            if (DevExpress.devices.current().platform === 'generic') {
                this.styleWidth("30%");
            }
        },



    };

    return viewModel;
};