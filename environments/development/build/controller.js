

//Main Controller
app.controller("MainController",['$scope','Upload', '$timeout','$window','$state', function ($scope, Upload, $timeout,$window,$state){  
  //Default Ethereum Account
  web3.eth.defaultAccount = web3.eth.accounts[0]

  $scope.projects = [];     // Track all projects
  $scope.project = {};      //Project Contract Object
  $scope.reject = "";       //Project Rejected flag
  $scope.done = "";         //Project Completed flag
  $scope.downloadURL = "";  //Asset download link 
  $scope.flag = false;      //flag to display client balance
  $scope.flag1 = false;     //flag to display assignTo
  $scope.vendorAccount = false      //flag to display vendor balance 
  $scope.completed = false;   //flag to display completed
  $scope.pending = false;     //flag to display pending
  $scope.deployed = false;    //flag to display deployed
  $scope.selected = "";
  $scope.err=[];
  var accounts = web3.eth.accounts;                       //Ethereum Accounts
  var storageRef = firebase.storage().ref();              //Assigning storage reference
  $scope.selectedAccount = accounts[1];                   //Default Selected Account
  var ethPMA = EthPMA.at(EthPMA.deployed_address);        //PMA deployed address
  var myethPMA = ethPMA;                                  

  $scope.blocks={
    "Client" : false,
    "Vendor" : false,
    "Management" : false,
    "Developer" : false,
    "Complete" : false
  }

  //Account Naming
  $scope.accounts={
    "Client" : accounts[1],
    "Vendor" : accounts[2],
    "Management" : accounts[3],
    "Developer" : accounts[4] 
  }
  
  //set Vendor Account Flag
  $scope.setVendorAccount= function(){
    if ($scope.vendorAccount == false)
      $scope.vendorAccount = true;
    else
      $scope.vendorAccount = false;
  }

  //set Selected
  $scope.setSelected = function(arg){
    $scope.selected = arg;
  }

  //set Completed Flag
  $scope.setCompleted = function(){
    if ($scope.completed == false){
      $scope.completed = true;
      $scope.deployed = false;
      $scope.pending = false;
    }
    else
      $scope.completed = false;
  }

  //set Pending Flag
  $scope.setPending = function(){
    if ($scope.pending == false){
      $scope.pending = true;
      $scope.completed = false;
      $scope.deployed = false;
    }
    else
      $scope.pending = false;
  }

  //set Deployed Flag 
  $scope.setDeployed = function(){
    if ($scope.deployed == false){
      $scope.deployed = true;
      $scope.pending = false;
      $scope.completed = false;
    }
    else
      $scope.deployed = false;
  }

  //set Flag variable
  $scope.setFlag= function(){
    if ($scope.flag == false)
      $scope.flag = true;
    else
      $scope.flag = false;
  }

  //set Flag1 variable 
  $scope.setFlag1= function(){
    if ($scope.flag1 == false)
      $scope.flag1 = true;
    else
      $scope.flag1 = false;
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
      console.log($scope.accounts);
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
      "Vendor" : web3.fromWei(web3.eth.getBalance(accounts[2]).toNumber(),"ether"),
      "Management" : web3.fromWei(web3.eth.getBalance(accounts[3]).toNumber(),"ether"),
      "Developer" : web3.fromWei(web3.eth.getBalance(accounts[4]).toNumber(),"ether")
    }

  console.log($scope.balances.Client);
  console.log($scope.accounts.Client);
  console.log($scope.balances.Vendor);
  console.log($scope.accounts.Vendor);
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
          //console.log(i);
          return i;
        }
    } 
  }

 //Returns Filelinks by taking name as input
  $scope.getLink = function(name){
    // Create a reference to the file we want to download
    var starsRef = storageRef.child('images/'+name);
    console.log(name);
    // Get the download URL 
    starsRef.getDownloadURL().then(function(url) {
    // Insert url into an <img> tag to "download"
      console.log(url);
       $window.open(url,"_blank");
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
  $scope.selectFile = function(f,i, errFiles) {
        $scope.f=[];
        $scope.f[i] = f;
        console.log($scope.f[i].name);
    }


  //Starting project contract
  $scope.startRFP = function(){
    if ($scope.project.assignTo == undefined){
      $scope.err1="Please assign visibility";
    }
    else if($scope.project.amount > 0)
    {
    $scope.err1="";
    //console.log($scope.project);
    $scope.flag1=false;
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
    
    //console.log($scope.status);
    //console.log($scope.assignTo);
    
    var xvalue = web3.toWei(Number($scope.project.amount),"ether");
    var xfrom = $scope.selectedAccount;
    
    //console.log(xfrom);
    //console.log(xvalue);
    
    //Calling PMA startRFP function
    myethPMA.startRFP($scope.project.name, $scope.project.description, $scope.accounts.Vendor,$scope.assignTo, $scope.status, $scope.assets,{ from: xfrom, value: xvalue }).then (
    function (project)
    { 
      $scope.project= {}; 
      console.log('Action created: ', project);
      $state.go('client.dashboard');
      $scope.setSelected('ClientDashboard');
      $scope.deployed = false;
      $scope.setDeployed();
      $scope.blocks['Client']=true;
    });
  }
  else{
     $scope.err1="Amount is not number";
      console.log($scope.err1);
  }
  }

  //Getting data from PMA 
  $scope.updatePending = function(data){
    $scope.projects[data.projectID.toNumber()] = {}
    $scope.projects[data.projectID.toNumber()].projectID= data.projectID.toNumber();      //Project ID
    $scope.projects[data.projectID.toNumber()].name= data.name;                           //Project Name
    $scope.projects[data.projectID.toNumber()].description = data.description             //Project Description
    $scope.projects[data.projectID.toNumber()].amount = web3.fromWei(data.amount.toNumber(),"ether");           //Project Amount
    $scope.projects[data.projectID.toNumber()].client = data.client;                      //Project Client
    $scope.projects[data.projectID.toNumber()].consultant = data.consultant;              //Project Vendor
    $scope.projects[data.projectID.toNumber()].assignTo = data.assignTo.split(",");       //Project Contract Visibility
    $scope.projects[data.projectID.toNumber()].status = data.status.split(",");           //Project Status Array
    $scope.projects[data.projectID.toNumber()].assets = data.assets.split(",");           //Project Asset Array
    $scope.projects[data.projectID.toNumber()].reject = "";                               //Flag to check whether the project is rejected
    $scope.projects[data.projectID.toNumber()].done = "";                                 //Flag to check whether the project is complete
    $scope.projects[data.projectID.toNumber()].phase = {};                                //Object to store the account names and if the have submitted the assets
    $scope.projects[data.projectID.toNumber()].projectAsset = {};                         //Object to store the account names and assets
    $scope.projects[data.projectID.toNumber()].stage = "Awaiting Vendor Approval";      //display the present stage
    $scope.projects[data.projectID.toNumber()].fileLinks = {};
    
    //Setting phase, assets, filelinks
    for (var i = 0 ; i < $scope.projects[data.projectID.toNumber()].assignTo.length ; i++){ 
      $scope.projects[data.projectID.toNumber()].phase[$scope.getAccountName($scope.projects[data.projectID.toNumber()].assignTo[i])] = $scope.projects[data.projectID.toNumber()].status[i];
      $scope.projects[data.projectID.toNumber()].projectAsset[$scope.getAccountName($scope.projects[data.projectID.toNumber()].assignTo[i])] = $scope.projects[data.projectID.toNumber()].assets[i];
      console.log(i);
      console.log($scope.projects[data.projectID.toNumber()].assets[i]);
    }
    
    //Check the project present stage 
    if($scope.projects[data.projectID.toNumber()].phase.Vendor == "Done"){
      $scope.projects[data.projectID.toNumber()].stage = "Awaiting Project Plan";
      
      if($scope.projects[data.projectID.toNumber()].phase.Management == "Done"){
        $scope.projects[data.projectID.toNumber()].stage = "Project Under Development";
        
        if($scope.projects[data.projectID.toNumber()].phase.Developer == "Done"){
          $scope.projects[data.projectID.toNumber()].stage = "Client Review";
          
          if($scope.projects[data.projectID.toNumber()].phase.Client== "Done"){
            $scope.projects[data.projectID.toNumber()].stage = "Completed";
            $scope.endContract(data.name);
          }
        
        }
      }
    }
    //console.log($scope.projects[data.projectID.toNumber()].phase);
    //console.log($scope.projects[data.projectID.toNumber()].projectAsset);
    $scope.$apply();
  }

  //Submitting Assets 
  $scope.accept = function(name,value,asset,i){
    if($scope.f == undefined){
      $scope.err[i]="Please select a file before accepting/ submitting";
    }
    else if($scope.f[i] == undefined){
      $scope.err[i]="Please select a file before accepting/ submitting";
    }
    else{
    $scope.err[i]="";
    console.log(name,value,asset,i);
    var id = $scope.getId(name);
    //console.log(id);

    var file = $scope.f[i];                          //Assigning File


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
          //console.log($scope.downloadURL);
          for (var i = 0 ; i < $scope.projects[id].assignTo.length ; i++){
            if(value == $scope.projects[id].assignTo[i]){
              $scope.projects[id].status[i] = "Done";
              $scope.projects[id].assets[i] = asset;
            }
          }

          $scope.status = $scope.serialize($scope.projects[id].status);
          //console.log($scope.status);
          $scope.assets = $scope.serialize($scope.projects[id].assets);
          //console.log($scope.assets);
          myethPMA.updateContract(id,$scope.status,$scope.assets).then(
            function (project)
          { 
            $scope.f = "";
            console.log('Contract Updated: ', project);
            $scope.blocks[$scope.getAccountName(value)]=true;
            console.log($scope.blocks);
          });
      });
    }
  }

  $scope.endContract = function(name)
  {
    var id = $scope.getId(name);
    $scope.projects[id].done = "true";
    //console.log(id);
    //console.log($scope.projects[id].done);
    myethPMA.endContract(id, {from : $scope.projects[id].consultant}).then(
      function (project)
    { 
      console.log('Contract Ended: ', project);
      $scope.setCompleted();
      $scope.blocks.Complete = true;
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