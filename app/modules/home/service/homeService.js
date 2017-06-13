angular.module('projeto.tempo.core',[]).service('homeService', homeService);

homeService.$inject = ['$http'];
function homeService($http) {
  this.getListCity = getListCity;
  this.getListState = getListState;
  this.getWeatherForecastByCity = getWeatherForecastByCity;
  var url ="http://api.apixu.com/v1/forecast.json?key=5e7a329819c5484abe8171824171006&q=%cityName%&days=7&lang=pt";

  function getListCity(){
    return $http.get('shared/API/listCity.json');
  }

  function getListState(){
    return $http.get('shared/API/listState.json');
  }

  function getWeatherForecastByCity(cityName){
    var endPoint = url.replace('%cityName%', cityName);
      return $http.get(endPoint);
  }

}
