var app = angular.module("pmapp",[]);

app.controller("MainController",['$scope',function($scope){
  web3.eth.defaultAccount = web3.eth.accounts[0]

  // Keep track of all auctions
  $scope.projects = [];
  $scope.project = {};
  $scope.asset = "";
  $scope.reject = "";
  $scope.done = "";
  var accounts = web3.eth.accounts;
  web3.eth.defaultAccount = accounts[0];
  $scope.selectedAccount = accounts[1];
  var ethPMA = EthPMA.at(EthPMA.deployed_address);
  var myethPMA = ethPMA;

  $scope.accounts={
    "Client" : accounts[1],
    "Synechron" : accounts[2],
    "Project Manager" : accounts[3],
    "Developer" : accounts[4] 
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
          $scope.showBalance();
          console.log('projects', $scope.projects);
        } else {
          console.log('error occurred', err);
        }
      });
      myethPMA.Ended().watch(function(error, event) {
        if (!error) {
          console.log('project ended', event);
          $scope.showBalance();
        } else {
          console.log('error occurred', err);
        }
      });
      $scope.showBalance();
      console.log('EthPMA created');
    }, function(err) {
      console.log(err);
    });

  $scope.showBalance = function(){
  var balance=web3.eth.getBalance(ethPMA.address);
  $scope.balance = web3.fromWei(balance.toNumber(), 'ether');
  $scope.balances={
    "Client" : web3.fromWei(web3.eth.getBalance(accounts[1]).toNumber(),"ether"),
    "Synechron" : web3.fromWei(web3.eth.getBalance(accounts[2]).toNumber(),"ether"),
    "Project Manager" : web3.fromWei(web3.eth.getBalance(accounts[3]).toNumber(),"ether"),
    "Developer" : web3.fromWei(web3.eth.getBalance(accounts[4]).toNumber(),"ether")
  }
  console.log($scope.balances.Client);
  console.log($scope.accounts.Client);
  console.log($scope.balances.Synechron);
  console.log($scope.accounts.Synechron);
  $scope.$apply();
  }

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
    console.log($scope.assignTo);
    var xvalue = web3.toWei(Number($scope.project.amount),"ether");
    var xfrom = $scope.selectedAccount;
    console.log(xfrom);
    console.log(xvalue);
    myethPMA.startRFP($scope.project.name, $scope.project.description, $scope.accounts.Synechron,$scope.assignTo, $scope.status, $scope.assets, { from: xfrom, value: xvalue }).then (
    function (project)
    { 
      $scope.project= {}; 
      console.log('Action created: ', project);
      console.log('Update done')
    });
  }

  $scope.updatePending = function(data){
    var count = 0;
    $scope.projects[data.projectID.toNumber()] = {}
    $scope.projects[data.projectID.toNumber()].projectID= data.projectID.toNumber();
    $scope.projects[data.projectID.toNumber()].name= data.name;
    $scope.projects[data.projectID.toNumber()].description = data.description
    $scope.projects[data.projectID.toNumber()].amount = data.amount.toNumber();
    $scope.projects[data.projectID.toNumber()].client = data.client;
    $scope.projects[data.projectID.toNumber()].consultant = data.consultant;
    $scope.projects[data.projectID.toNumber()].assignTo = [];
    $scope.projects[data.projectID.toNumber()].assignTo = data.assignTo.split(",");
    $scope.projects[data.projectID.toNumber()].status = data.status.split(",");
    $scope.projects[data.projectID.toNumber()].assets = data.assets.split(",");
    $scope.projects[data.projectID.toNumber()].phase = {};
    $scope.projects[data.projectID.toNumber()].projectAsset = {};
    $scope.projects[data.projectID.toNumber()].reject = "";
    $scope.projects[data.projectID.toNumber()].done = "";
    for (var i = 0 ; i < $scope.projects[data.projectID.toNumber()].assignTo.length ; i++){
      $scope.projects[data.projectID.toNumber()].phase[$scope.getAccountName($scope.projects[data.projectID.toNumber()].assignTo[i])] = $scope.projects[data.projectID.toNumber()].status[i];
      $scope.projects[data.projectID.toNumber()].projectAsset[$scope.getAccountName($scope.projects[data.projectID.toNumber()].assignTo[i])] = $scope.projects[data.projectID.toNumber()].assets[i];
      if ($scope.projects[data.projectID.toNumber()].status[i] == "true"){
        count = count + 1;
      }  
    }
    if(count == $scope.projects[data.projectID.toNumber()].assignTo.length)
    {
      $scope.endContract(data.name);
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

  $scope.endContract = function(name)
  {
    var id = $scope.getId(name);
    $scope.projects[id].done = "true";
    console.log(id);
    console.log($scope.projects[id].done);
    myethPMA.endContract(id, {from : $scope.projects[id].consultant}).then(
      function (project)
    { 
      console.log('Contract Ended: ', project);
    });
  }

  $scope.reject = function(name){
    var id = $scope.getId(name);
    $scope.projects[id].reject = "true";
    myethPMA.rejectContract(id, {from : $scope.projects[id].client}).then(
      function (project)
    { 
      console.log('Contract Ended: ', project);
    });
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