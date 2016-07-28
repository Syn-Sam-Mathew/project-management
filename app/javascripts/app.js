var app = angular.module("pmapp",[]);

app.controller("MainController",['$scope',function($scope){
  web3.eth.defaultAccount = web3.eth.accounts[0]

  // Keep track of all auctions
  $scope.projects = [];
  $scope.project = {};
  $scope.asset = "";
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
    $scope.project.status = [];
    $scope.project.assets = [];
    for (var i = 0 ; i < $scope.project.assignTo.length ; i++){
      $scope.project.status[i] = false;
      $scope.project.assets[i] = "";
    }
    $scope.assignTo = $scope.serialize($scope.project.assignTo);
    $scope.status = $scope.serialize($scope.project.status);
    $scope.assets = $scope.serialize($scope.project.assets);
    //console.log($scope.status);
    //console.log($scope.assignTo);
    myethPMA.startRFP($scope.project.name, $scope.project.description, $scope.project.amount, $scope.selectedAccount, $scope.assignTo, $scope.status, $scope.assets).then (
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
    $scope.projects[data.projectID.toNumber()].status = data.status.split(",");
    $scope.projects[data.projectID.toNumber()].assets = data.assets.split(",");
    $scope.projects[data.projectID.toNumber()].phase = {};
    $scope.projects[data.projectID.toNumber()].projectAsset = {};
    for (var i = 0 ; i < $scope.projects[data.projectID.toNumber()].assignTo.length ; i++){
      $scope.projects[data.projectID.toNumber()].phase[$scope.getAccountName($scope.projects[data.projectID.toNumber()].assignTo[i])] = $scope.projects[data.projectID.toNumber()].status[i];
      $scope.projects[data.projectID.toNumber()].projectAsset[$scope.getAccountName($scope.projects[data.projectID.toNumber()].assignTo[i])] = $scope.projects[data.projectID.toNumber()].assets[i];  
    }
    console.log($scope.projects[data.projectID.toNumber()].phase);
    console.log($scope.projects[data.projectID.toNumber()].projectAsset);
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

  $scope.accept = function(name,value,asset){
    console.log(name,value,asset);
    var id = $scope.getId(name);
    console.log(id);
    for (var i = 0 ; i < $scope.projects[id].assignTo.length ; i++){
      if(value == $scope.projects[id].assignTo[i]){
        $scope.projects[id].status[i] = true;
        $scope.projects[id].assets[i] = asset; 
      }
    }
    $scope.status = $scope.serialize($scope.projects[id].status);
    console.log($scope.status);
    $scope.assets = $scope.serialize($scope.projects[id].assets);
    console.log($scope.assets);
    myethPMA.updateContract(id,$scope.status,$scope.assets).then(
      function (project)
    { 
      console.log('Contract Updated: ', project);
    }); 
  }

  $scope.getId = function(name){
   for ( var i=0; i < $scope.projects.length; i++){
        if ($scope.projects[i].name == name)
        {
          console.log(i);
          return i;
        }
    } 
  }

  $scope.serialize = function(arr){
    var temp = "";
    for (var i = 0 ; i < arr.length ; i++){
      temp += arr[i];
      if (i !=  arr.length - 1){
        temp += ",";
      }
    }
    return temp;  
  }

}]); 