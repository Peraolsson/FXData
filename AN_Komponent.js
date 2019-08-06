FXMobile.AN_Komponent = function (params) {

    var viewModel = {

        dsFenixKomponent: {
            store: FXMobile.db.Fenix_Komponent,
            sort: [{ getter: "Kod" }],

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