module App {
	export var num: number = 0;
    angular.module('Wanker', ['Wanker.controllers']);
    
    angular.module('Wanker.controllers', []).
    controller('shellController', function($scope) {
    $scope.message="Hello World";
});
}