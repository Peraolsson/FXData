FXMobile.AN_Justering = function (params) {

    var viewModel = {

        visBelopp: ko.observable(true),
        visAntalperioder: ko.observable(true),
        visVerserie: ko.observable(true),
        visVerdatum: ko.observable(true),
        visAndel: ko.observable(true),
        styleWidth: ko.observable("90%"),
        typ: ko.observable('Försäljning'), // Deductiontype
        anlNr: ko.observable(), // Assetnumber
        andel: ko.observable(0), // %-andel utrangering
        belopp: ko.observable(0), // Amount
        antalPerioder: ko.observable(0), // Number of "months"
        periodiseringsDatum: ko.observable(''), // Accounting date
        verSerie: ko.observable(''), // JournalSerie

        justeringClick: function (e) {
            // --- Create transactions and journals
            if (this.anlNr() === undefined) {
                DevExpress.ui.notify(Globalize.formatMessage('Angeanlaggningsnummer'), 'error', 3000);
            }

            var justeringsTyp = "";
            switch (this.typ()) {
                case 'Försäljning':
                    justeringsTyp = "F"
                    break;
                case 'Utrangering':
                    justeringsTyp = "U"
                    break;
                case 'Justering av avskrivning':
                    justeringsTyp = "J"
                    break;
                case 'Justera basbelopp':
                    justeringsTyp = "JB"
                    break;
                case 'Ändra avskrivningstid':
                    justeringsTyp = "JT"
                    break;
            }

            var tmp = Set_JusteringAnlaggning(justeringsTyp, this.verSerie(), this.periodiseringsDatum(), this.anlNr(), this.belopp(), this.antalPerioder(), this.andel())
            if (tmp === '') {
                // 'info'|'warning'|'error'|'success'.
                DevExpress.ui.notify(Globalize.formatMessage('Uppdateringenklar'), 'success', 3000);
            }
        },

        typChanged: function (e) {
            this.visBelopp(false)  ;
            this.visAntalperioder(false);
            this.visVerserie(false);
            this.visVerdatum(false);
            this.visAndel(true);
            switch(e.value) {
                case 'Försäljning':
                    this.visAntalperioder(true)
                    this.visAntalperioder(true);
                    break;
                case 'Utrangering':
                    this.visBelopp(true);
                    this.visAntalperioder(true);
                    this.visAndel(false);
                    break;
                case 'Justering av avskrivning':
                    this.visAntalperioder(true);
                    this.visAndel(true);
                    break;
                case 'Justera basbelopp':
                    this.visBelopp(false);
                    this.visAntalperioder(true);
                    this.visVerserie(true);
                    this.visVerdatum(true);
                    this.visAndel(true);
                    break;
                  case 'Ändra avskrivningstid':
                    this.visBelopp(true);
                    this.visAntalperioder(false);
                    this.visVerserie(true);
                    this.visVerdatum(false);
                    this.visAndel(true);
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


        viewShowing: function () {
        
            if (DevExpress.devices.current().platform === 'generic') {
                this.styleWidth("30%");
                }
        }
 


    };

    return viewModel;
};


