angular.module('projeto.tempo.spinnerbar', []).directive('spinnerBar', SpinnerBarDirective);

SpinnerBarDirective.$inject = ['$rootScope', '$http'];
function SpinnerBarDirective($rootScope, $http) {
        return {
            link: function(scope, element, attrs) {
                element.addClass('hide');
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide');
                    $('body').removeClass('page-on-load');
                });
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide');
                });
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
                scope.isLoading = function() {
                    return $http.pendingRequests.length > 0;
                };
                scope.$watch(scope.isLoading, function(v) {
                    if (v) {
                        element.removeClass('hide');
                    } else {
                        element.addClass('hide');
                    }
                });

            }
        }
    }
