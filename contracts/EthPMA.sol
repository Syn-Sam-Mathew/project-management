contract EthPMA{
	struct project {
		string name;
		string description;
		uint amount;
		address recipient;
		string assignTo;
		string status;
		string assets;
	}
	mapping(uint => project) Projects;
	uint totalProjects;

	event Update(string name, string description, uint amount, uint projectID, address recipient, string assignTo, string status, string assets);

	function startRFP(string name, string description, uint amount, address recipient, string assignTo,string status, string assets) returns (uint projectID){
		projectID = totalProjects++;
		Projects[projectID].name = name;
		Projects[projectID].description = description;
		Projects[projectID].amount = amount;
		Projects[projectID].recipient = recipient;
		Projects[projectID].assignTo = assignTo;
		Projects[projectID].status = status;
		Projects[projectID].assets = assets;
		Update(name, description, amount, projectID, recipient, assignTo, status, assets); 
	}

	function updateContract(uint id,string status, string assets){
		project p = Projects[id];
		p.status = status;
		p.assets = assets;
		Update(p.name, p.description, p.amount, id, p.recipient, p.assignTo, p.status, p.assets);	
	}
}
