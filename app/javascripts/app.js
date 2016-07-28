var app = angular.module("pmapp",[]);

app.controller("MainController",['$scope',function($scope){
  web3.eth.defaultAccount = web3.eth.accounts[0]

  // Keep track of all auctions
  $scope.projects = [];
  $scope.project = {};
  $scope.phase = {};
  var accounts = web3.eth.accounts;
  web3.eth.defaultAccount = accounts[0];
  $scope.selectedAccount = accounts[0];
  var ethPMA = EthPMA.at(EthPMA.deployed_address);
  var myethPMA = ethPMA;

  $scope.accounts={
    "Client" : accounts[0],
    "Synechron" : accounts[1],
    "Project Manager" : accounts[2],
    "Developer" : accounts[3] 
  }


  EthPMA.new().then(
    function(conf) {
      console.log(conf.address);
      ethPMA = EthPMA.at(conf.address);
      myethPMA = conf;
      // watch for changes
      myethPMA.Update().watch(function(error, event) {
        if (!error) {
          $scope.updatePending(event.args);
          console.log('projects', $scope.projects);
        } else {
          console.log('error occurred', err);
        }
      });


      console.log('EthPMA created');
    }, function(err) {
      console.log(err);
    });

  $scope.startRFP = function(){
    //console.log($scope.project);
    $scope.assignTo = "";
    $scope.status = "";
    for (var i = 0 ; i < $scope.project.assignTo.length ; i++){
      $scope.assignTo += $scope.project.assignTo[i];
      $scope.phase[$scope.getAccountName($scope.project.assignTo[i])] = false;
      $scope.status += false;
      if (i != $scope.project.assignTo.length - 1){
        $scope.assignTo += ",";
        $scope.status += ",";
      }
    } 
    console.log($scope.status);
    console.log($scope.assignTo);
    myethPMA.startRFP($scope.project.name, $scope.project.description, $scope.project.amount, $scope.selectedAccount, $scope.assignTo, $scope.status).then (
    function (project)
    { 
      $scope.project= {}; 
      console.log('Action created: ', project);
    });
  }

  $scope.updatePending = function(data){
    $scope.projects[data.projectID.toNumber()] = {}
    $scope.projects[data.projectID.toNumber()].projectID= data.projectID.toNumber();
    $scope.projects[data.projectID.toNumber()].name= data.name;
    $scope.projects[data.projectID.toNumber()].description = data.description
    $scope.projects[data.projectID.toNumber()].amount = data.amount;
    $scope.projects[data.projectID.toNumber()].recipient = data.recipient;
    $scope.projects[data.projectID.toNumber()].assignTo = [];
    $scope.projects[data.projectID.toNumber()].assignTo = data.assignTo.split(",");
    $scope.projects[data.projectID.toNumber()].phase = {};
    $scope.status = data.status.split(",");
    for (var i = 0 ; i < $scope.projects[data.projectID.toNumber()].assignTo.length ; i++){
      $scope.projects[data.projectID.toNumber()].phase[$scope.getAccountName($scope.projects[data.projectID.toNumber()].assignTo[i])] = $scope.status[i];  
    }
    console.log($scope.projects[data.projectID.toNumber()].phase);
    $scope.$apply();
  }

  $scope.getAccountName= function(value) {
      for ( var key in $scope.accounts){
        if ($scope.accounts[key] == value)
        {
          return key;
        }
      }
  }

}]); 