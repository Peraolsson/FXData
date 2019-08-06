FXMobile.AN_Anlaggning = function (params) {

    var viewModel = {

        //navItems:  [
        //    { text: "Anskaffningar", icon: "/images/shopping_cart2.png" },
        //    { text: "Avskrivningar", icon: "money" },
        //    { text: "Transaktioner", icon: "/images/zoom_in.png" },
        //    //{ text: "Transaktioner", icon: "overflow" },
        //],

        toolbarData: ko.observable(
			  [
			  {
			  	widget: 'dxButton',
			  	options: {
			  		type: 'default',
			  		text: Globalize.formatMessage('Avskrivningar'),
			  		onClick: function (e) {
			  			var dataGrid = $('#gridREARE').dxDataGrid('instance');
			  			var selectedRowsData = dataGrid.getSelectedRowsData();
			  			var AnlNr = selectedRowsData[0].ANL_NR;
			  			FXMobile.app.navigate('AN_Avskrivningar/' + AnlNr)
			  		}
			  	},
			  	locateInMenu: 'never',
			  	location: 'after'
			  },
			  {
			  	widget: 'dxButton',
			  	options: {
			  		type: 'default',
			  		text: Globalize.formatMessage('Transaktioner'),
			  		onClick: function (e) {
			  			var dataGrid = $('#gridREARE').dxDataGrid('instance');
			  			var selectedRowsData = dataGrid.getSelectedRowsData();
			  			var AnlNr = selectedRowsData[0].ANL_NR;
			  			FXMobile.app.navigate('AN_Transaktioner/' + AnlNr)
			  		}
			  	},
			  	locateInMenu: 'never',
			  	location: 'after'
			  }
			  ]
			  ),

      

        //navItemClicked: function (e) {

        //    var dataGrid = $('#gridREARE').dxDataGrid('instance');
        //    var selectedRowsData = dataGrid.getSelectedRowsData();
        //    var AnlNr = selectedRowsData[0].ANL_NR;

        //    switch(e.itemData.text) {
        //        case 'Anskaffningar':
        //            FXMobile.app.navigate('AN_Anskaffningar/' + AnlNr)
        //            break;
        //        case 'Avskrivningar':
        //            FXMobile.app.navigate('AN_Avskrivningar/' + AnlNr)
        //            break;
        //        case 'Transaktioner':
        //            FXMobile.app.navigate('AN_Transaktioner/' + AnlNr)
        //            break;
        //    }
        //},


        dsREARE: new DevExpress.data.DataSource({
            store: FXMobile.db.REARE,
        }),

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

        dsREANH: {
            store: FXMobile.db.REANH,
            sort: [{ getter: "NR" }],
        },

        dsFenixKomponent: {
            store: FXMobile.db.Fenix_Komponent,
            sort: [{ getter: "Kod" }],
        },

        dsFenixFastighet: {
            store: FXMobile.db.Fenix_Fastighet,
            sort: [{ getter: "FastNr" }],
        },

    };

    return viewModel;
};


//<div data-bind="dxCommand: { id: 'anskaffning', title: '@Anskaffning', onExecute: navigateAnskaffningar } "></div>
//<div data-bind="dxCommand: { id: 'avskrivning', title: '@Avskrivningar', onExecute: navigateAvskrivningar } "></div>
//<div data-bind="dxCommand: { id: 'transaktioner', title: '@Transaktioner', onExecute: navigateTransaktioner } "></div>
//navigateAnskaffningar: function () {
//    alert('Anskaffningar');
//},

//navigateAvskrivningar: function () {
//    alert('Avskrivningar');
//},

//navigateTransaktioner: function () {
//    alert('Transaktioner');
//},

