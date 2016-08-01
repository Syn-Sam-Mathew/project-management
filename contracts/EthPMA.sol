contract EthPMA{
	struct project {
		string name;
		string description;
		uint amount;
		address client;
		address consultant;
		string assignTo;
		string status;
		string assets;
	}
	mapping(uint => project) Projects;
	uint totalProjects;

	event Update(string name, string description, uint amount, uint projectID, address client, address consultant,string assignTo, string status, string assets);
	event Ended(uint projectID);

	function startRFP(string name, string description, address consultant,string assignTo,string status, string assets)  {
		uint projectID = totalProjects++;

		Projects[projectID].name = name;
		Projects[projectID].description = description;
		Projects[projectID].amount = msg.value;
		Projects[projectID].client = msg.sender;
		Projects[projectID].consultant = consultant;
		Projects[projectID].assignTo = assignTo;
		Projects[projectID].status = status;
		Projects[projectID].assets = assets;
		//Projects[projectID].client.send(Projects[projectID].amount);
		

		/*uint projectID = 0;

		Projects[projectID].name = name;
		Projects[projectID].description = description;
		Projects[projectID].amount = msg.value;
		Projects[projectID].client = msg.sender;
		Projects[projectID].consultant = consultant;
		Projects[projectID].assignTo = assignTo;
		Projects[projectID].status = status;
		Projects[projectID].assets = assets;
		
		//Projects[projectID].client.send(Projects[projectID].amount);
		*/


		Update(Projects[projectID].name, Projects[projectID].description, Projects[projectID].amount, projectID, Projects[projectID].client, Projects[projectID].consultant, Projects[projectID].assignTo, Projects[projectID].status, Projects[projectID].assets); 
	}

	function updateContract(uint id,string status, string assets){
		project p = Projects[id];
		p.status = status;
		p.assets = assets;
		Update(p.name, p.description, p.amount, id, p.client, p.consultant, p.assignTo, p.status, p.assets);	
	}

	function endContract(uint id){
		project p = Projects[id];
		p.consultant = msg.sender;
		p.consultant.send(10000000000000000000000);
		Ended(id);
	}

	function rejectContract(uint id){
		project p = Projects[id];
		p.client = msg.sender;
		p.client.send(p.amount);
		Ended(id);
	}
}
