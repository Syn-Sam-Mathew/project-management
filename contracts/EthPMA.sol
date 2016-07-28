contract EthPMA{
	struct project {
		string name;
		string description;
		uint amount;
		address recipient;
		string assignTo;
		string status;
	}
	mapping(uint => project) Projects;
	uint totalProjects;

	event Update(string name, string description, uint amount, uint projectID, address recipient, string assignTo, string status);

	function startRFP(string name, string description, uint amount, address recipient, string assignTo,string status ) returns (uint projectID){
		projectID = totalProjects++;
		Projects[projectID].name = name;
		Projects[projectID].description = description;
		Projects[projectID].amount = amount;
		Projects[projectID].recipient = recipient;
		Projects[projectID].assignTo = assignTo;
		Projects[projectID].status = status;
		Update(name, description, amount, projectID, recipient, assignTo, status); 
	}
}
