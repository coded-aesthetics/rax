'use strict';

// Configuring the Articles module
angular.module('racks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Racks', 'racks', 'dropdown', '/racks(/create)?');
		Menus.addSubMenuItem('topbar', 'racks', 'List Racks', 'racks');
		Menus.addSubMenuItem('topbar', 'racks', 'New Rack', 'racks/create');
	}
]);