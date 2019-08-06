FXMobile.LR_Fraga_Detaljer = function (params) {
    "use strict";

    // 2019-08-05 PON Allow deleting false i attestflödet


    var viewModel = {

        title: ko.observable(Globalize.formatMessage('Fakturanr') + ' ' + params.verNr),
        styleWidth: ko.observable("90%"),
        popupMakuleraVisible: ko.observable(false),
        kopieraPdf: ko.observable(false),
        verNr: ko.observable(params.verNr),
        periodDatum: ko.observable(params.fakturaDatum),
        makuleradText: ko.observable('Makulerad av' + ' ' + FXMobile.UserName),

        LR_Fraga_DetaljerItems : [
        {
            title: "Konteringar",
        },
        {
            title: "Betalningar",
        },             
        {
            title: "Attest",
        },
        {
            title: "Notering",
        },
        {
            title: "KonteringarAnywhere",
        },
        ],

        handleBack: function () {
            FXMobile.app.back();
        },

        cmdMakulera: function () {
                viewModel.popupMakuleraVisible(true);
            },

        cmdKontera:  function () {
            RE_RehuvToRedag(params.verNr).done(function (data) {
                var uri = FXMobile.app.router.format({
                    view: 'RE_Verifikation',
                    verNr: params.verNr,
                    verDatum: params.periodDatum
                });
                FXMobile.app.navigate(uri);
            });
            },

        cmdBetala: function () {
            // Betala fakturan
                FXMobile.db.get("LR_BetalaFaktura",
                    {
                        VerNr: params.verNr,
                        Datum: params.periodDatum,
                        JustBelopp: params.beloppAttBetala,
                        likvidkonto: params.likvidKonto
                    }).done(function (data) {
                        if (data !== 0) {
                            msgOk(data, 'Betalafaktura');
                        } else {
                            $("#grdFakturor").dxDataGrid('instance').refresh;
                            msgOk('Fakturanbetald', 'Betalafaktura');
                        }
                        viewModel.popupMakuleraVisible(false);
                    });
            },

        makuleraOk: function (e) {
            // Makulera
            FXMobile.db.get("LR_MakuleraFaktura",
            {
                VerNr: viewModel.verNr(),
                Datum: formatDate(viewModel.periodDatum()),
                Beskrivning: viewModel.makuleradText(),
                KopieraPDF: viewModel.kopieraPdf()
            }).done(function (data) {
                if (data !== 0) {
                    msgOk(data, 'Makulera');
                } else {
                    $("#grdFakturor").dxDataGrid('instance').refresh;
                    msgOk('Fakturanmakulerad', 'Makulera');
                }
                viewModel.popupMakuleraVisible(false);
                });
        },

        makuleraAvbryt: function (e) {
            $("#makuleraContainer").dxPopup("instance").hide();
        },

            cmdSkrivUt: function () {
            },

            cmdInaktiveraMoms: function () {
            },


        visaPdf: function (clickedCell) {
            // Visa pdf
            var verNr = clickedCell.row.data.VER_NR;
            var uri = FXMobile.app.router.format({
                view: 'SY_Showpdf',
                url: verNr,
                typ: ''
            });
            FXMobile.app.navigate(uri);
        },

        viewShowing: function (e) {
            if (DevExpress.devices.current().platform === 'generic') {
                viewModel.styleWidth("30%");
            }

           

        },

        viewShown: function () {
            let theme = getThemeColor();
            $("#panel1").css("background-color", theme.bgcolor);
            $("#panel1").css("color", theme.color);

            var dsREHUV = {
                store: FXMobile.db.REHUV,
                filter: ['VER_NR', '=', parseInt(params.verNr, 10)]
            };

            var dsLRBET = {
                store: FXMobile.db.LRBET,
                filter: ['LEV_VER_NR', '=', parseInt(params.verNr, 10)]
            };

            var dsOD_Invoice = {
                store: FXMobile.db.OD_Invoice,
                filter: ['FakturaNr', '=', params.verNr]
            };

            var dsOD_Invoice_Comment = {
                store: FXMobile.db.OD_Invoice_Comment,
                filter: ['VerNr', '=', params.verNr]
            };

            var dsOD_JournalRow = {
                store: FXMobile.db.OD_JournalRow,
                filter: ['VerNr', '=', params.verNr]
            };

            FXMobile.db.get("getDataSource", { sql: 'Select UserId, UserName From OrionUser Where IsNull(Sparrad,0) = 0 Order By UserName', table: 'OrionUser', ftg: 'OrionSys' }).done(function (data) {
                //viewModel.dsOrionUser((JSON.parse(String(data)).OrionUser));
                var dsOrionUser = JSON.parse(String(data)).OrionUser;
            });

            $('#jqxSplitter').on('resize',
            function (event) {
                $('#pdfFrame').css('width', event.args.panels[1].size);
                $('#pdfFrame').css('height', $(window).height() - (166 + 65));
                // 2018-05-23 PON Spara splitterinställningar
                localStorage.setItem("LR_Fraga_Detaljer*bredd1", event.args.panels[0].size);
                localStorage.setItem("LR_Fraga_Detaljer*bredd2", event.args.panels[1].size);
            });

            // 2018-02-27 PON Om desktop splitterinställningar är sparade använd dem, annars default
            bredd1 = localStorage.getItem("LR_Fraga_Detaljer*bredd1");
            bredd2 = localStorage.getItem("LR_Fraga_Detaljer*bredd2");
            if (bredd1 === null && DevExpress.devices.current().platform === 'generic') {
                var bredd1 = $(window).width() * 0.7;
                var bredd2 = $(window).width() * 0.3;
            }

            $("#jqxSplitter").jqxSplitter({
                width: '100%',
                height: $(window).height() -  (166 + 65),
                theme: 'darkblue',
                panels: [{ size: bredd1 }, { size: bredd2 }]
            });

            displayPdffromODInvoice(params.verNr);



          
            $("#grdA").dxDataGrid({

                allowColumnReordering: { enabled: true },
                allowColumnResizing: { enabled: false },
                columnAutoWidth: true,
                columnChooser: { enabled: true },
                columnHidingEnabled: true,
                columns: [
                    { caption: 'VerNr', dataField: 'VER_NR', dataType: 'number' },
                    { caption: 'Datum', dataField: 'VER_DATUM', format: 'yyyy-MM-dd', width: 110, dataType: 'date' },
                    { caption: 'Period', dataField: 'PERIOD', dataType: 'number' },
                    { caption: Globalize.formatMessage('Bfar'), dataField: 'BF_AR', dataType: 'number' },
                    { caption: 'Konto', dataField: 'KONTO', dataType: 'string' },
                    { caption: FXMobile.kd1Namn, dataField: 'KD1', dataType: 'string' },
                    { caption: FXMobile.kd2Namn, dataField: 'KD2', dataType: 'string' },
                    { caption: FXMobile.kd3Namn, dataField: 'KD3', visible: false, dataType: 'string' },
                    { caption: FXMobile.kd4Namn, dataField: 'KD4', visible: false, dataType: 'string' },
                    { caption: FXMobile.kd5Namn, dataField: 'KD5', visible: false, dataType: 'string' },
                    { caption: FXMobile.kd6Namn, dataField: 'KD6', visible: false, dataType: 'string' },
                    { caption: FXMobile.kd7Namn, dataField: 'KD7', visible: false, dataType: 'string' },
                    { caption: FXMobile.kd8Namn, dataField: 'KD8', visible: false, dataType: 'string' },
                    { caption: 'Projekt', dataField: 'PROJEKT', dataType: 'string' },
                    { caption: 'Text', dataField: 'TEXT', dataType: 'string' },
                    { caption: 'RadNr', dataField: 'KVANT', visible: false, dataType: 'number' },
                    {
                        caption: 'Belopp', dataField: 'BELOPP', alignment: 'right',
                        format: function (value) {
                            return formatNumber(value);
                        }, dataType: 'number'
                    },
                    { caption: 'Ver.Typ', dataField: 'VER_TYP', visible: false, dataType: 'string' },
                    { caption: 'Reg.datum', dataField: 'REG_DATUM', format: 'yyyy-MM-dd', width: 110, visible: false, dataType: 'date' },
                    { caption: 'Upp.datum', dataField: 'UPP_DATUM', format: 'yyyy-MM-dd', width: 110, visible: false, dataType: 'date' },
                    { caption: 'Trans.typ', dataField: 'TRANS_TYP', visible: false, dataType: 'string' },
                    { caption: 'Användare', dataField: 'USER', visible: false, dataType: 'string' },
                    { caption: 'Avstämd', dataField: 'AVSTAMD', visible: false, dataType: 'number' },
                    { caption: 'Valfri 1', dataField: 'VALFRI_1', visible: false, dataType: 'string' },
                    { caption: 'Valfri 2', dataField: 'VALFRI_2', visible: false, dataType: 'string' },
                    { caption: 'Anl.Nr', dataField: 'ANL_NR', visible: false, dataType: 'string' },
                ] ,
                dataSource: dsREHUV,
                export: { enabled: true, fileName: 'Transaktioner' },
                filterRow: { visible: false },
                groupPanel: { visible: false },
                paging: { enabled:false,pageSize: 8 },
                pager: {
                    allowedPageSizes: [5, 8, 10,20],
                    showPageSizeSelector: true
                },
                rowAlternationEnabled: true,
                searchPanel: { visible: false },
                stateStoring: { enabled: true, storageKey: 'LR_Fraga_Detaljer_A' },
                selection: {mode:'single'},
            });

            $("#grdB").dxDataGrid({
                dataSource: dsLRBET,
                columnChooser: { enabled: true },
                paging: { enabled: false, pageSize: 8 },
                pager: {
                    allowedPageSizes: [5, 8, 10, 20],
                    showPageSizeSelector: true
                },
                rowAlternationEnabled: true,
                columnAutoWidth: true,
                export: { enabled: true, fileName: 'Betalningar' },
                stateStoring: { enabled: true, storageKey: 'LR_Fraga_Detaljer_B' },
                filterRow: { visible: false },
                searchPanel: { visible: false },
                groupPanel: { visible: false },
                allowColumnReordering: { enabled: true },
                allowColumnResizing: { enabled: true },
                selection: { mode: 'single' },
                width: '350px',
                columns: [
                    { caption: Globalize.formatMessage('Verdatum'), dataField: 'VER_DATUM', format: 'yyyy-MM-dd', width: 110, visible: true, dataType: 'date' },
                    {
                        caption: Globalize.formatMessage('Betaltbelopp'), dataField: 'BET_BELOPP', alignment: 'right', format: function (value) {
                            return formatNumber(value);
                        }, dataType: 'number'
                    },
                    { caption: Globalize.formatMessage('Betaldatum'), dataField: 'BET_DATUM', format: 'yyyy-MM-dd', width: 110, visible: true, dataType: 'date' },
                ]

            });

            $("#grdC").dxDataGrid({
                dataSource: dsOD_Invoice,
                columnChooser: {enabled:true},
                paging: { enabled:false,pageSize: 8 },
                pager: {
                    allowedPageSizes: [5, 8, 10,20],
                    showPageSizeSelector: true
                },
                editing: {
                    form: {
                        colCount: 2,

									items: [
									{ dataField: 'Konteringskod', },
									'Konterad',
									'Attestkod1',
									'Attesterad1',
									'Attestkod2',
									'Attesterad2',
									'Attestkod3',
									'Attesterad3',
									'Attestkod4',
									'Attesterad4',
									'Attestkod5',
									'Attesterad5',
									'Huvudattest',
									'Huvudattesterad'
									]
								
                    },
                mode: 'form',
                    allowUpdating: true,
                    allowAdding: true,
                    allowDeleting: false,
                    useIcons: true,
                },
                rowAlternationEnabled: true,
                columnAutoWidth: false,
                export: { enabled: true, fileName: 'Attest'},
                stateStoring: { enabled: true, storageKey: 'LR_Fraga_Detaljer_C' },
                filterRow: { visible: false },
                searchPanel: { visible: false },
                groupPanel: { visible: false },
                allowColumnReordering: {enabled:true},
                allowColumnResizing: {enabled:true},
                selection: {mode:'single'},
                columns: [
                { caption: Globalize.formatMessage('Konteringskod'),dataField: 'KonteringsKod',
                    lookup:
							{
								dataSource: FXMobile.dsUsers,
								valueExpr: 'UserId',
								displayExpr: 'UserName',
								allowClearing: true
							}
                },
                {
                    caption: Globalize.formatMessage('Attestkod1'), dataField: 'AttestKod1', visible: true,
                        lookup:
								{
									dataSource: FXMobile.dsUsers,
									valueExpr: 'UserId',
									displayExpr: 'UserName',
									allowClearing: true
								},
                },
                {
                    caption: Globalize.formatMessage('Attestkod2'), dataField: 'AttestKod2', visible: true,
                    lookup:
	{
		dataSource: FXMobile.dsUsers,
		valueExpr: 'UserId',
		displayExpr: 'UserName',
		allowClearing: true
	}
                },
                {
                    caption: Globalize.formatMessage('Attestkod3'), dataField: 'AttestKod3', visible: true,
                    lookup:
	{
		dataSource: FXMobile.dsUsers,
		valueExpr: 'UserId',
		displayExpr: 'UserName',
		allowClearing: true
	}
                },
                {
                    caption: Globalize.formatMessage('Attestkod4'), dataField: 'AttestKod4', visible: true,
                    lookup:
							{
								dataSource: FXMobile.dsUsers,
								valueExpr: 'UserId',
								displayExpr: 'UserName',
								allowClearing: true
							}
                },
                {
                    caption: Globalize.formatMessage('Attestkod5'), dataField: 'AttestKod5', visible: true,
                    lookup:
							{
								dataSource: FXMobile.dsUsers,
								valueExpr: 'UserId',
								displayExpr: 'UserName',
								allowClearing: true
							}
                },
                {
                    caption: Globalize.formatMessage('Huvudattest'), dataField: 'Huvudattest', visible: true,
                    lookup:
	{
		dataSource: FXMobile.dsUsers,
		valueExpr: 'UserId',
		displayExpr: 'UserName',
		allowClearing: true
	}
                },
                { caption: Globalize.formatMessage('Konterad'), dataField: 'Konterad', visible: true},
                { caption: Globalize.formatMessage('Attesterad1'),dataField: 'Attesterad1' ,visible:true},
                { caption: Globalize.formatMessage('Attesterad2'),dataField: 'Attesterad2' ,visible:true},
                { caption: Globalize.formatMessage('Attesterad3'),dataField: 'Attesterad3' ,visible:true},
                { caption: Globalize.formatMessage('Attesterad4'),dataField: 'Attesterad4' ,visible:true},
                { caption: Globalize.formatMessage('Attesterad5'),dataField: 'Attesterad5' ,visible:true},
                { caption: Globalize.formatMessage('Huvudattesterad'), dataField: 'Huvudattesterad', visible: true },
                ]
            });

            $("#grdD").dxDataGrid({
                dataSource: dsOD_Invoice_Comment,
                columnChooser: {enabled:true},
                paging: { enabled:false,pageSize: 8 },
                pager: {
                    allowedPageSizes: [5, 8, 10,20],
                    showPageSizeSelector: true
                },
                editing: {
                    allowUpdating: true,
                    mode: 'row',
                    allowAdding: true,
                    allowDeleting: true
                },
                rowAlternationEnabled: true,
                columnAutoWidth: false,
                export: { enabled: true, fileName: 'Attest'},
                stateStoring: { enabled: true, storageKey: 'LR_Fraga_Detaljer_D' },
                filterRow: { visible: false },
                searchPanel: { visible: false },
                groupPanel: { visible: false },
                allowColumnReordering: {enabled:true},
                allowColumnResizing: {enabled:true},
                selection: { mode: 'single' },
                //, lookup: { dataSource: dsOrionUser, valueExpr: 'UserId', displayExpr: 'UserName' }
                columns: [
                        { caption: Globalize.formatMessage('Anvandare'), dataField: 'UserID' },
                        {
                            caption: Globalize.formatMessage('Notering'),
                            dataField: 'AttestComment',
                            visible: true,
                            wordWrapEnabled: true,
                                },
                        { caption: Globalize.formatMessage('Datum'),dataField: 'created' ,visible:true,format: 'yyyy-MM-dd', width: 110 ,  dataType: 'date'}
                ]
            });


            $("#grdE").dxDataGrid({
                dataSource: dsOD_JournalRow,
                columnChooser: {enabled:true},
                paging: { enabled:false,pageSize: 8 },
                pager: {
                    allowedPageSizes: [5, 8, 10,20],
                    showPageSizeSelector: true
                },
                editing: {
                    allowUpdating: true,
                    mode: 'row',
                    allowAdding: true,
                    allowDeleting: true,
                    useIcons: true,
                },
                rowAlternationEnabled: true,
                columnAutoWidth: false,
                export: { enabled: true, fileName: 'Konteringattest'},
                stateStoring: { enabled: true, storageKey: 'LR_Fraga_Detaljer_E' },
                filterRow: { visible: false },
                searchPanel: { visible: false },
                groupPanel: { visible: false },
                allowColumnReordering: {enabled:true},
                allowColumnResizing: {enabled:true},
                selection: {mode:'single'},
                columns: [
                { caption: Globalize.formatMessage('Konto'), dataField: 'Konto', dataType: 'string' },
                { caption: FXMobile.kd1Namn, dataField: 'Kd1', dataType: 'string' },
                { caption: FXMobile.kd2Namn, dataField: 'Kd2', dataType: 'string' },
                { caption: FXMobile.kd3Namn, dataField: 'Kd3', visible: false, dataType: 'string' },
                { caption: FXMobile.kd4Namn, dataField: 'Kd4', visible: false, dataType: 'string' },
                { caption: FXMobile.kd5Namn, dataField: 'Kd5', visible: false, dataType: 'string' },
                { caption: FXMobile.kd6Namn, dataField: 'Kd6', visible: false, dataType: 'string' },
                { caption: FXMobile.kd7Namn, dataField: 'Kd7', visible: false, dataType: 'string' },
                { caption: FXMobile.kd8Namn, dataField: 'Kd8', visible: false, dataType: 'string' },
                { caption: Globalize.formatMessage('Projekt'), dataField: 'Projekt', dataType: 'string' },
                { caption: Globalize.formatMessage('Text'), dataField: 'Text', dataType: 'string' },
                { caption: Globalize.formatMessage('Kvantitet'), dataField: 'Antal', visible: false, dataType: 'number' },
                {
                    caption: Globalize.formatMessage('Belopp'), dataField: 'Belopp', alignment: 'right', format: function (value) {
                        return formatNumber(value);
                    }, dataType: 'number'
                },
                {
                    caption: Globalize.formatMessage('Justeratbelopp'), dataField: 'Justerat_Belopp', alignment: 'right', format: function (value) {
                        return formatNumber(value);
                    }, dataType: 'number'
                },
                { caption: Globalize.formatMessage('Verdatum'), dataField: 'VerDatum', format: 'yyyy-MM-dd', width: 110, dataType: 'date' },
                { caption: Globalize.formatMessage('Momskod'), dataField: 'Momskod', visible: false, dataType: 'number' },
                { caption: Globalize.formatMessage('Perkod'), dataField: 'Per_Kod', visible: false, dataType: 'string' },
                { caption: Globalize.formatMessage('Perstart'), dataField: 'Per_Start', format: 'yyyy-MM-dd', width: 110, dataType: 'date' },
                { caption: Globalize.formatMessage('Attesterad'), dataField: 'Attesterad', visible: false, dataType: 'string' },
                ]
            });


        },

        //cellNotering(container, options) {
        //    container.addClass('notering-cell');
        //    $('<div class=fx-konto>' + options.data.AttestComment + '</div><div class=fx-kontoben>' + options.data.UserID + '</div>').appendTo(container);
        //}



    };

    return viewModel;
};

