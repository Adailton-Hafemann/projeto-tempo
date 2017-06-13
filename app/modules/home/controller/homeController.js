angular.module('projeto.tempo.home',[]).controller('homeController', homeController);

homeController.$inject = ['homeService', 'moment', 'listCity', 'listState', '$cookies'];
function homeController(homeService, moment, listCity, listState, $cookies){
  var vm = this;
  vm.data = [];
  vm.series = [];
  vm.labels = [];
  vm.maxTemperature = {
    temperature: null,
    date: null,
    icon: null
  };
  vm.minTemperature = {
    temperature: null,
    date: null,
    icon: null
  };
  vm.messageError = false;
  vm.showTemperature = false;
  vm.colors = ['#f009','#00f9']
  var Sunny = 1000;
  vm.mountsStateString = mountsStateString;
  vm.selectCity = selectCity;
  vm.formatDate = formatDate;
  vm.getDateOfWeek = getDateOfWeek;
  vm.isCurrentDate = isCurrentDate;
  vm.isGoodWeatherForBeach = isGoodWeatherForBeach;
  vm.mountsListCitiesInState = mountsListCitiesInState;
  vm.saveFavorites = saveFavorites;
  vm.listCity = listCity.data;
  vm.listState = listState.data;

  function higherTemperature(forecastday){
    vm.maxTemperature.temperature = null;
    angular.forEach(forecastday, function(value){
      if (vm.maxTemperature.temperature === null){
        vm.maxTemperature.temperature = value.day.maxtemp_c;
        vm.maxTemperature.date = value.date;
        vm.maxTemperature.icon = value.day.condition.icon;
      }
      if (vm.maxTemperature.temperature < value.day.maxtemp_c){
        vm.maxTemperature.temperature = value.day.maxtemp_c;
        vm.maxTemperature.date = value.date;
        vm.maxTemperature.icon = value.day.condition.icon;
      }
    })
  }

  function lowerTemperature(forecastday){
    vm.minTemperature.temperature = null;
    angular.forEach(forecastday, function(value){
      if (vm.minTemperature.temperature === null){
        vm.minTemperature.temperature = value.day.mintemp_c;
        vm.minTemperature.date = value.date;
        vm.minTemperature.icon = value.day.condition.icon;
      }
      if (vm.minTemperature.temperature > value.day.mintemp_c){
        vm.minTemperature.temperature = value.day.mintemp_c;
        vm.minTemperature.date = value.date;
        vm.minTemperature.icon = value.day.condition.icon;
      }
    })
  }

  function mountsStateString(state){
    if (state){
      return state.name + " (" + state.abbreviation + ")";
    }
  }

  function selectCity(city){
    getWeatherForecastByCity(city);
  }

  function formatDate(stringDate){
    return moment(stringDate).format('DD/MM/YYYY');
  }

  function mountsListCitiesInState(state){
    vm.listCityInState = [];
    angular.forEach(vm.listCity, function(value){
      if (value.state === state.id){
        vm.listCityInState.push(value);
      }
    });
  }

  function getWeatherForecastByCity(city){
    vm.messageError = false;
    homeService.getWeatherForecastByCity(city.name).then(function(response){
      vm.weatherForecast = response.data;
      vm.isDay = vm.weatherForecast.current.is_day === 0 ? 'Noite' : 'Dia';
      graphSetting(vm.weatherForecast.forecast.forecastday);
      lowerTemperature(vm.weatherForecast.forecast.forecastday);
      higherTemperature(vm.weatherForecast.forecast.forecastday);
      vm.showTemperature = true;
    }).catch(function(){
      vm.messageError = true;
    });
  }

  function isCurrentDate(date){
    var currentDate = moment().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
    return moment(currentDate).isSame(moment(date))
  }

  function getDateOfWeek(stringDate){
    if(angular.isDefined(stringDate)) {
      switch (moment(stringDate).day()) {
        case 1 :
        return "Segunda";
        case 2 :
        return "Terça";
        case 3 :
        return "Quarta";
        case 4 :
        return "Quinta";
        case 5 :
        return "Sexta";
        case 6 :
        return "Sábado";
        case 0 :
        return "Domingo";

      }
    }
  }

  function graphSetting(forecastday){
    var listMaximumTemperatures = [];
    var listMinimumTemperatures = [];
    vm.data = [];
    vm.labels = [];
    angular.forEach(forecastday, function(value){
      vm.labels.push(getDateOfWeek(value.date));
      listMaximumTemperatures.push(value.day.maxtemp_c);
      listMinimumTemperatures.push(value.day.mintemp_c);
    });
    vm.series = ['Maior temperatura', 'Menor temperatura'];
    vm.data.push(listMaximumTemperatures);
    vm.data.push(listMinimumTemperatures);
  }

  function isGoodWeatherForBeach(forecastday){
    angular.forEach(forecastday, function(value){
      if (getDateOfWeek(value.date) === "Domingo" || getDateOfWeek(value.date) === "Sábado" && value.condition.code === Sunny){
        if (value.day.mintemp_c > 25){
          return true;
        }
      }
    });
  }

  function saveFavorites(){
    var favorites = {
      city: vm.city,
      state: vm.state
    }
    $cookies.putObject("Favorites", favorites);
  }

  function loadFavorites(){
    var favorites = $cookies.getObject("Favorites");
    if(!favorites){
      vm.state = {
        "id": "24",
        "abbreviation": "SC",
        "name": "Santa Catarina"
      };
      vm.city = {id: "4449", name: "Blumenau", state: "24"};
    }else{
      vm.state = favorites.state;
      vm.city = favorites.city;
    }
    mountsListCitiesInState(vm.state);
    getWeatherForecastByCity(vm.city);
  }
  loadFavorites();
}
