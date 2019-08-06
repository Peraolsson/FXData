FXMobile.AN_Avskrivningar = function (params) {
    
	var viewModel = {

		dsREKTK: ko.observable(),
		dsREKOD1: ko.observable(),
		dsREKOD2: ko.observable(),
		dsREKOD3: ko.observable(),
		dsREKOD4: ko.observable(),

        dsREATT: {
            store: FXMobile.db.REATT,
            filter: ['ANL_NR', '=', params.id],
        },


        dsREPRR: {
            store: FXMobile.db.REPRR,
            searchExpr: "PROJ_BEN",
            filter: ["STATUS", "P"],
            map: function (itemData) {
            	return {
            		NAMN: itemData.PROJEKT_NR + " - " + itemData.PROJ_BEN,
            	}
            }
        },

        viewShown: function (e) {

        	FXMobile.db.get("RE_GetKontoplan", { 
        		verDatum: '',
        		Ftg: FXMobile.Database 
        	}).done(function (data) {
        		viewModel.dsREKTK((JSON.parse(String(data)).REKTK));
        	})

        	FXMobile.db.get("RE_GetKdAttest",{
        		userId: FXMobile.UserName,
        		kdNr: '1'
        	}).done(function(data) {
        		viewModel.dsREKOD1((JSON.parse(String(data)).REKOD));
        	})

        	FXMobile.db.get("RE_GetKdAttest", {
        		userId: FXMobile.UserName,
        		kdNr: '2'
        	}).done(function (data) {
        		viewModel.dsREKOD2((JSON.parse(String(data)).REKOD));
        	})

        	FXMobile.db.get("RE_GetKdAttest", {
        		userId: FXMobile.UserName,
        		kdNr: '3'
        	}).done(function (data) {
        		viewModel.dsREKOD3((JSON.parse(String(data)).REKOD));
        	})

        	FXMobile.db.get("RE_GetKdAttest", {
        		userId: FXMobile.UserName,
        		kdNr: '4'
        	}).done(function (data) {
        		viewModel.dsREKOD4((JSON.parse(String(data)).REKOD));
        	})
        },

        KonteringEditorOptions: {
        	searchTimeout: 0,
        	onFocusIn: function (e) {
        		setTimeout(function () {
        			e.element.find('input').select();
        		});
        	}
        },

        cellKonto: function (container, options) {
        	container.addClass('konto-cell');
        	FXMobile.db.get("getDataSource", { sql: "Select KONTO_BEN From REKTK Where KONTO_NR = '" + options.value + "' And BF_AR = " + parseInt(FXMobile.InnevarandeAr), table: 'REKTK', ftg: FXMobile.Database }).done(function (data) {
        		var ben = JSON.parse(String(data)).REKTK;
        		$('<div class=fx-konto>' + options.value + '</div><a>' + ben[0].KONTO_BEN + '</a>').appendTo(container);
        	});
        },

        cellKd: function (container, options) {
			
        	if (options.value !== '' && options.value !== undefined && options.value !== null) {

				container.addClass('konto-cell');
				var kdNr = ''

				switch (options.column.dataField) {
					case 'DEBET_PROJEKT': case 'KREDIT_PROJEKT':
						kdNr = 'P'
						break;
					case 'DEBET_KD1': case 'KREDIT_KD1':
						kdNr = '1'
						break;
					case 'DEBET_KD2': case 'KREDIT_KD2':
						kdNr = '2'
						break;
					case 'DEBET_KD3': case 'KREDIT_KD3':
						kdNr = '3'
						break;
					case 'DEBET_KD4': case 'KREDIT_KD4':
						kdNr = '4'
						break;
					// to be implemented
					//case 'DEBET_KD5': case 'KREDIT_KD5':
					//	kdNr = '5'
					//	break;
					//case 'DEBET_KD6': case 'KREDIT_KD6':
					//	kdNr = '6'
					//	break;
					//case 'DEBET_KD7': case 'KREDIT_KD7':
					//	kdNr = '7'
					//	break;
					//case 'DEBET_KD8': case 'KREDIT_KD8':
					//	kdNr = '8'
					//	break;
				}

				FXMobile.db.get("RE_GetKoddelBen",{
					KdNr: kdNr,
					KdId: options.value,
					Typ: ''
				}).done(function (data)  {
					$('<div class=fx-konto>' + options.value + '</div><a>' + data + '</a>').appendTo(container);
				})

				}
        },

    };


    return viewModel;
};