FXMobile.AN_Huvudanlaggning = function (params) {
    
    var viewModel = {

        dsREANH: {
            store: FXMobile.db.REANH,
            sort: [{ getter: "NR" }],
        },

        dsREKTK: {
            store: FXMobile.db.REKTK,
            sort: [{ getter: "KONTO_NR" }],
            filter: ['BF_AR', '=', parseInt(GetInnevarandeAr())],
        },

        dsGrupp: {
            store: FXMobile.db.TEXTR,
            filter: ['TEXT_TYP', '=', 'FG'],
        },

        dsKat: {
            store: FXMobile.db.TEXTR,
            filter: ['TEXT_TYP', '=', 'FK'],
        },

        dsAnsvarig: {
            store: FXMobile.db.TEXTR,
            filter: ['TEXT_TYP', '=', 'FR'],
        },

        dsPlats: {
            store: FXMobile.db.TEXTR,
            filter: ['TEXT_TYP', '=', 'PL'],
        },



        // Disable slideOut when dragging columns
        viewShown: function (e) {
            if (DevExpress.devices.current().platform !== 'generic') {
                e.viewInfo.layoutController.slideOut.option('swipeEnabled', false);
            }
        },

        viewHidden: function (e) {
            if (DevExpress.devices.current().platform !== 'generic') {
                e.viewInfo.layoutController.slideOut.option('swipeEnabled', true);
            }
        }

    };

    return viewModel;
};