'use strict';

// Configuring the Articles module
angular.module('cabinets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Cabinets', 'cabinets', 'dropdown', '/cabinets(/create)?');
		Menus.addSubMenuItem('topbar', 'cabinets', 'List Cabinets', 'cabinets');
		Menus.addSubMenuItem('topbar', 'cabinets', 'New Cabinet', 'cabinets/create');
	}
]);