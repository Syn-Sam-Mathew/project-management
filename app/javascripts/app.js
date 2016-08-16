var app=angular.module('pmapp',['ui.router','ngFileUpload']);

// Routing 
app.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'views/HomeView.html'
  })
    .state('client', {
    url: '/client',
    abstract: true,
    templateUrl: 'views/ClientView.html'
  })
    .state('client.dashboard', {
    url: '/dashboard',
    views: {
      menuContent:{
      templateUrl: 'views/ClientDashView.html'
      }
    }
  })
    .state('client.createContract', {
    url: '/createContract',
    views: {
      menuContent:{
      templateUrl: 'views/CreateContractView.html'
      }
    }
  })
    .state('vendor', {
    url: '/vendor',
    abstract: true,
    templateUrl: 'views/VendorView.html'
  })
    .state('management', {
    url: '/management',
    abstract: true,
    templateUrl: 'views/ManagementView.html'
  })
    .state('development', {
    url: '/development',
    abstract: true,
    templateUrl: 'views/DevelopmentView.html'
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');
});

