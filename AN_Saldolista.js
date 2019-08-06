FXMobile.AN_Saldolista = function (params) {

    var viewModel = {

        styleWidth: ko.observable("90%"),
        fromDatum: ko.observable(''),//new Date(GetInnevarandeAr(),0, 1, 0,0, 0, 0)),
        tomDatum: ko.observable(''),//new Date(GetInnevarandeAr(), 11, 31, 0, 0, 0, 0)),
        typ: ko.observable('Komplett'),
        ds: ko.observable(),


        viewShowing: function () {
            if (DevExpress.devices.current().platform === 'generic') {
                this.styleWidth("30%");
            }
        },


        SkapaRapport: function () {
            //this.loadPanelVisible(true);

            var utrangerad = '';
            if (this.typ() === 'Avyttrade') {
                utrangerad = 'N';
            } else {
                utrangerad = '';
            }

            this.ds(AN_Get_Avskrivningar(this.fromDatum(), this.tomDatum(), utrangerad));

            //this.loadPanelVisible(false);
        }

    };

    return viewModel;
};