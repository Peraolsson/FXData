FXMobile.AN_Meny = function (params) {

	var viewModel = {

		treeViewData: ko.observable(''),
		treeWidth: ko.observable('auto'),
		searchValue: ko.observable(''),
		loadPanelVisible: ko.observable(false),
		generic: ko.observable(true),

		viewShown: function (e) {
			//viewModel.loadPanelVisible(true);
			FXMobile.db.get("GetMenu", { MenuName: 'Fenix', ModuleName: 'Anläggningar' }).done(function (data) {
				viewModel.treeViewData(JSON.parse(String(data)).Fenix_Menu_FXM);
				viewModel.loadPanelVisible(false);
			});
			if (DevExpress.devices.current().platform !== 'generic') {
				this.treeWidth('60%')
				this.generic(false)
			} else {
				this.treeWidth(300)
			}
			$('#search :input').focus();
		},

		nodeTemplate: function (itemData, itemIndex, itemElement) {
			var icon = "<img data-bind='attr:{src: icon  }' height='32' width='32' src='" + itemData.icon + "'>"
			var label = ' ' + itemData.text
			if (itemData.badge != null) {
				var badge = "<span class='dx-list-item-badge dx-badge'>" + itemData.badge + "</span>"
			} else badge = ''
			itemElement.append(icon, label, badge);
		},

		OpenView: function (e) {


			SY_OpenView(e.itemData.program)

		}
	};

	return viewModel;
};



