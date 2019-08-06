FXMobile.AN_Transaktioner = function (params) {

    var viewModel = {


        dsREAVT: {
            store: FXMobile.db.REAVT,
            filter: ['ANL_NR', '=', params.id],
        },

        handleBack: function () {
        	FXMobile.app.back();
        },

    };

    return viewModel;
};