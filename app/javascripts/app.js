var app = angular.module("pmapp",['ngFileUpload']);

//Main Controller
app.controller("MainController",['$scope','Upload', '$timeout', function ($scope, Upload, $timeout){
  
  //Default Ethereum Account
  web3.eth.defaultAccount = web3.eth.accounts[0]

  $scope.projects = [];     // Track all projects
  $scope.project = {};      //Project Contract Object
  $scope.reject = "";       //Project Rejected flag
  $scope.done = "";         //Project Completed flag
  $scope.downloadURL = "";  //Asset download link 
  var accounts = web3.eth.accounts;                       //Ethereum Accounts
  var storageRef = firebase.storage().ref();              //Assigning storage reference
  $scope.selectedAccount = accounts[1];                   //Default Selected Account
  var ethPMA = EthPMA.at(EthPMA.deployed_address);        //PMA deployed address
  var myethPMA = ethPMA;                                  

  //Account Naming
  $scope.accounts={
    "Client" : accounts[1],
    "Provider" : accounts[2],
    "Management" : accounts[3],
    "Development" : accounts[4] 
  }

  //PMA Instance Creation
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
      
      //watch for termination 
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

  //Account Balances
  $scope.showBalance = function(){
    var balance=web3.eth.getBalance(ethPMA.address);
    $scope.balance = web3.fromWei(balance.toNumber(), 'ether');  //Contract Balance in Ether
    
    //Ethereum Account Balances 
    $scope.balances={
      "Client" : web3.fromWei(web3.eth.getBalance(accounts[1]).toNumber(),"ether"),
      "Provider" : web3.fromWei(web3.eth.getBalance(accounts[2]).toNumber(),"ether"),
      "Management" : web3.fromWei(web3.eth.getBalance(accounts[3]).toNumber(),"ether"),
      "Development" : web3.fromWei(web3.eth.getBalance(accounts[4]).toNumber(),"ether")
    }

  console.log($scope.balances.Client);
  console.log($scope.accounts.Client);
  console.log($scope.balances.Provider);
  console.log($scope.accounts.Provider);
  $scope.$apply();
  }

  //Returns account name after taking address as input 
  $scope.getAccountName= function(value) {
      for ( var key in $scope.accounts){
        if ($scope.accounts[key] == value)
        {
          return key;
        }
      }
  }

  //Converting array to string
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

  //Returns project id by taking project name as input 
  $scope.getId = function(name){
   for ( var i=0; i < $scope.projects.length; i++){
        if ($scope.projects[i].name == name)
        {
          console.log(i);
          return i;
        }
    } 
  }

  //Returns Filelinks by taking name as input
  $scope.getLink = function(name){
    // Create a reference to the file we want to download
    var starsRef = storageRef.child('images/'+name);

    // Get the download URL 
    starsRef.getDownloadURL().then(function(url) {
    // Insert url into an <img> tag to "download"
      console.log(url);
      return url;
    }).catch(function(error) {
      switch (error.code) {
        case 'storage/object_not_found':
        // File doesn't exist
        break;

        case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;

        case 'storage/canceled':
        // User canceled the upload
        break;

        case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
      }
      return "";
    });
  }

  //Selecting asset file  
  $scope.selectFile = function(f, errFiles) {
        $scope.f = f;
        // File or Blob named mountains.jpg
        /*var file = f;
        var storageRef = firebase.storage().ref();


        // Create the file metadata
        var metadata = {
          contentType: 'image/png'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child('images/' + file.name).put(file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
            }
        }, function(error) {
            switch (error.code) {
              case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

              case 'storage/canceled':
              // User canceled the upload
              break;

              case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
            }
        }, function() {
          // Upload completed successfully, now we can get the download URL
          $scope.downloadURL = uploadTask.snapshot.downloadURL;
          console.log($scope.downloadURL);
          $scope.$apply();
        });*/
    }


  //Starting project contract
  $scope.startRFP = function(){
    //console.log($scope.project);
    $scope.project.status = [];   //project status array
    $scope.project.assets = [];   //project asset names array

    //Intializing status and assets arrays
    for (var i = 0 ; i < $scope.project.assignTo.length ; i++){
      $scope.project.status[i] = "Pending";
      $scope.project.assets[i] = "";
    }

    //Converting assignTo, status, assets, links arrays to strings
    $scope.assignTo = $scope.serialize($scope.project.assignTo);
    $scope.status = $scope.serialize($scope.project.status);
    $scope.assets = $scope.serialize($scope.project.assets);
    
    console.log($scope.status);
    console.log($scope.assignTo);
    
    var xvalue = web3.toWei(Number($scope.project.amount),"ether");
    var xfrom = $scope.selectedAccount;
    
    console.log(xfrom);
    console.log(xvalue);
    
    //Calling PMA startRFP function
    myethPMA.startRFP($scope.project.name, $scope.project.description, $scope.accounts.Provider,$scope.assignTo, $scope.status, $scope.assets,{ from: xfrom, value: 10000000000000000000000 }).then (
    function (project)
    { 
      $scope.project= {}; 
      console.log('Action created: ', project);
    });
  }

  //Getting data from PMA 
  $scope.updatePending = function(data){
    $scope.projects[data.projectID.toNumber()] = {}
    $scope.projects[data.projectID.toNumber()].projectID= data.projectID.toNumber();      //Project ID
    $scope.projects[data.projectID.toNumber()].name= data.name;                           //Project Name
    $scope.projects[data.projectID.toNumber()].description = data.description             //Project Description
    $scope.projects[data.projectID.toNumber()].amount = data.amount.toNumber();           //Project Amount
    $scope.projects[data.projectID.toNumber()].client = data.client;                      //Project Client
    $scope.projects[data.projectID.toNumber()].consultant = data.consultant;              //Project Provider
    $scope.projects[data.projectID.toNumber()].assignTo = data.assignTo.split(",");       //Project Contract Visibility
    $scope.projects[data.projectID.toNumber()].status = data.status.split(",");           //Project Status Array
    $scope.projects[data.projectID.toNumber()].assets = data.assets.split(",");           //Project Asset Array
    $scope.projects[data.projectID.toNumber()].reject = "";                               //Flag to check whether the project is rejected
    $scope.projects[data.projectID.toNumber()].done = "";                                 //Flag to check whether the project is complete
    $scope.projects[data.projectID.toNumber()].phase = {};                                //Object to store the account names and if the have submitted the assets
    $scope.projects[data.projectID.toNumber()].projectAsset = {};                         //Object to store the account names and assets
    $scope.projects[data.projectID.toNumber()].stage = "Awaiting Provider Approval";      //display the present stage
    $scope.projects[data.projectID.toNumber()].fileLinks = {};
    
    //Setting phase, assets, filelinks
    for (var i = 0 ; i < $scope.projects[data.projectID.toNumber()].assignTo.length ; i++){
      $scope.projects[data.projectID.toNumber()].phase[$scope.getAccountName($scope.projects[data.projectID.toNumber()].assignTo[i])] = $scope.projects[data.projectID.toNumber()].status[i];
      $scope.projects[data.projectID.toNumber()].projectAsset[$scope.getAccountName($scope.projects[data.projectID.toNumber()].assignTo[i])] = $scope.projects[data.projectID.toNumber()].assets[i];
      
      if($scope.projects[data.projectID.toNumber()].assets[i] != ""){
        var name = $scope.projects[data.projectID.toNumber()].assets[i];
        var starsRef = storageRef.child('images/'+name);

        // Get the download URL 
        starsRef.getDownloadURL().then(function(url) {
        // Insert url into an <img> tag to "download"
          $scope.projects[data.projectID.toNumber()].fileLinks[name] = url;
          console.log(name);
          console.log($scope.projects[data.projectID.toNumber()].fileLinks);
          console.log($scope.projects[data.projectID.toNumber()].fileLinks[name]);
          $scope.$apply();
        }).catch(function(error) {
          switch (error.code) {
           case 'storage/object_not_found':
          // File doesn't exist
          break;

          case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;

          case 'storage/canceled':
          // User canceled the upload
          break;

          case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
        }
      });
      /*$scope.projects[data.projectID.toNumber()].fileLinks[$scope.projects[data.projectID.toNumber()].assets[i]] = $scope.getLink($scope.projects[data.projectID.toNumber()].assets[i]);
      console.log($scope.getLink($scope.projects[data.projectID.toNumber()].assets[i]));*/
      }
    }

    //Check the project present stage 
    if($scope.projects[data.projectID.toNumber()].phase.Provider == "Done"){
      $scope.projects[data.projectID.toNumber()].stage = "Awaiting Project Plan";
      if($scope.projects[data.projectID.toNumber()].phase.Management == "Done"){
        $scope.projects[data.projectID.toNumber()].stage = "Project Under Development";
        if($scope.projects[data.projectID.toNumber()].phase.Development == "Done"){
          $scope.projects[data.projectID.toNumber()].stage = "Client Review";
          if($scope.projects[data.projectID.toNumber()].phase.Client== "Done"){
            $scope.projects[data.projectID.toNumber()].stage = "Completed";
            $scope.endContract(data.name);
          }
        }
      }
    }
    console.log($scope.projects[data.projectID.toNumber()].phase);
    console.log($scope.projects[data.projectID.toNumber()].projectAsset);
    $scope.$apply();
  }

  //Submitting Assets 
  $scope.accept = function(name,value,asset){
    console.log(name,value,asset);
    var id = $scope.getId(name);
    console.log(id);

    var file = $scope.f;                          //Assigning File


    // Create the file metadata
    var metadata = {
          contentType: 'image/png'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child('images/' + file.name).put(file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
            }
    }, function(error) {
            switch (error.code) {
              case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

              case 'storage/canceled':
              // User canceled the upload
              break;

              case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
            }
    }, function() {
          // Upload completed successfully, now we can get the download URL
          $scope.downloadURL = uploadTask.snapshot.downloadURL;
          console.log($scope.downloadURL);
          for (var i = 0 ; i < $scope.projects[id].assignTo.length ; i++){
            if(value == $scope.projects[id].assignTo[i]){
              $scope.projects[id].status[i] = "Done";
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
            $scope.f = "";
            console.log('Contract Updated: ', project);
            
          });
      });
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

}]);