FXMobile.AN_Fastighet = function (params) {

    var viewModel = {

        dsFenixFastighet: {
            store: FXMobile.db.Fenix_Fastighet,
            sort: [{ getter: "FastNr" }],
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