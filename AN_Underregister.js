FXMobile.AN_Underregister = function (params) {

    var viewModel = {

        dsTextr: {
            store: FXMobile.db.TEXTR,
            sort: [{ getter: "NR" }],
            filter: ['TEXT_TYP', '=', params.id],
        },

        addNewRow: function(rowInfo) {
            rowInfo.data.TEXT_TYP = params.id;
            return rowInfo;
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



