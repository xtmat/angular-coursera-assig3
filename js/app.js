(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController',NarrowItDownController)
        .service('MenuSearchService',MenuSearchService)
        .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com')
        .directive('foundItems',foundItems);

    function foundItems() {
        let ddo = {
            restrict: 'E',
            templateUrl: 'foundItems.html',
            scope: {
                foundItems: '<',
                onRemove: '&'
            },
            controller: NarrowItDownController,
            controllerAs: '$ctrl',
            bindToController: true
        };
        return ddo;
    }
    
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        let $ctrl = this;
        $ctrl.isShowTable = false;
        $ctrl.isShowWarning = false;
        $ctrl.searchTerm = '';
        $ctrl.found = [];
        $ctrl.getMatchedMenuItems = function(searchTerm) {
            $ctrl.isShowTable = false;
            $ctrl.isShowWarning = false;
            $ctrl.found = [];
            if (searchTerm) {
                let promise = MenuSearchService.getMatchedMenuItems(searchTerm);
                promise.then((items) => {
                    if (items.length > 0){
                        $ctrl.found = items;
                        $ctrl.isShowTable = true;
                    }
                    else {
                        $ctrl.isShowWarning = true;
                    }
                });
            }
            else {
                $ctrl.isShowWarning = true;
            }
        }
        $ctrl.removeItem = function(index) {
            $ctrl.found.splice(index,1);
        }
    }

    MenuSearchService.$inject = ['$http','ApiBasePath'];
    function MenuSearchService($http,ApiBasePath) {
        let service = this;

        service.getMatchedMenuItems = function(searchTerm) {
            return $http({
                method: 'GET',
                url: (ApiBasePath + '/menu_items.json')
            }).then((response) => {
                return response.data['menu_items'].filter(item =>
                    item.description.toLowerCase().includes(searchTerm));
            });
        }
    }
}())
