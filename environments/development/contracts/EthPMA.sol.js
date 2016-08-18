// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"consultant","type":"address"},{"name":"assignTo","type":"string"},{"name":"status","type":"string"},{"name":"assets","type":"string"}],"name":"startRFP","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"status","type":"string"},{"name":"assets","type":"string"}],"name":"updateContract","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"endContract","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"rejectContract","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"description","type":"string"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"projectID","type":"uint256"},{"indexed":false,"name":"client","type":"address"},{"indexed":false,"name":"consultant","type":"address"},{"indexed":false,"name":"assignTo","type":"string"},{"indexed":false,"name":"status","type":"string"},{"indexed":false,"name":"assets","type":"string"}],"name":"Update","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"projectID","type":"uint256"}],"name":"Ended","type":"event"}],
    binary: "6060604052610e9c806100126000396000f3606060405260e060020a60003504630a1907e8811461003c578063ad847487146101fe578063c85a6b3d146102ed578063c99994ef14610376575b005b6040805160206004803580820135601f810184900484028501840190955284845261003a94919360249390929184019190819084018382808284375050604080516020601f8935808c0135918201839004830284018301909452808352979998604498929750929092019450925082915084018382808284375050604080516020606435808b0135601f81018390048302840183019094528383529799983598976084975091955060249190910193509091508190840183828082843750506040805160209735808a0135601f81018a90048a0283018a0190935282825296989760a4979196506024919091019450909250829150840183828082843750506040805160209735808a0135601f81018a90048a0283018a0190935282825296989760c497919650602491909101945090925082915084018382808284375094965050505050505060018054808201825560008181526020818152604082208a5181548285529383902094959194600292851615610100026000190190941691909104601f90810183900484019391928c01908390106103ff57805160ff19168380011785555b5061042f9291505b8082111561049557600081556001016101ea565b60408051602060248035600481810135601f810185900485028601850190965285855261003a9581359591946044949293909201918190840183828082843750506040805160209735808a0135601f81018a90048a0283018a01909352828252969897606497919650602491909101945090925082915084018382808284375094965050505050505060008381526020818152604082206006810180548651828652948490209294919360026000196001841615610100020190921691909104601f90810182900484019391880190839010610aab57805160ff19168380011785555b50610adb9291506101ea565b61003a600435600081815260208190526040808220600481018054600160a060020a031916331790819055600282015492519193600160a060020a039190911692909182818181858883f150506040805186815290517f601095663bda08ac0f932087ef2eb08e42e4bcd1927f3a8d9500f6ad2c5aef9094509081900360200192509050a15050565b61003a600435600081815260208190526040808220600381018054600160a060020a031916331790819055600282015492519193600160a060020a039190911692909182818181858883f150506040805186815290517f601095663bda08ac0f932087ef2eb08e42e4bcd1927f3a8d9500f6ad2c5aef9094509081900360200192509050a15050565b828001600101855582156101e2579182015b828111156101e2578251826000505591602001919060010190610411565b5050600081815260208181526040822088516001918201805481865294849020909460029381161561010002600019011692909204601f9081018490048301939192918b019083901061049957805160ff19168380011785555b506104c99291506101ea565b5090565b82800160010185558215610489579182015b828111156104895782518260005055916020019190600101906104ab565b5050600081815260208181526040822034600282810191909155600382018054600160a060020a031990811633179091556004830180549091168a17905587516005929092018054818652948490209094600181161561010002600019011691909104601f90810184900482019389019083901061055a57805160ff19168380011785555b5061058a9291506101ea565b8280016001018555821561054e579182015b8281111561054e57825182600050559160200191906001019061056c565b505060008181526020818152604082208551600691909101805481855293839020909360026001821615610100026000190190911604601f9081018490048201938801908390106105ee57805160ff19168380011785555b5061061e9291506101ea565b828001600101855582156105e2579182015b828111156105e2578251826000505591602001919060010190610600565b505060008181526020818152604082208451600791909101805481855293839020909360026001821615610100026000190190911604601f90810184900482019387019083901061068257805160ff19168380011785555b506106b29291506101ea565b82800160010185558215610676579182015b82811115610676578251826000505591602001919060010190610694565b50507f0104beecb4e7c7cbfdb9f3f327a4062f96eedc20c6004df69b034a4381ab6b8f60006000506000838152602001908152602001600020600050600001600050600060005060008481526020019081526020016000206000506001016000506000600050600085815260200190815260200160002060005060020160005054846000600050600087815260200190815260200160002060005060030160009054906101000a9004600160a060020a03166000600050600088815260200190815260200160002060005060040160009054906101000a9004600160a060020a031660006000506000898152602001908152602001600020600050600501600050600060005060008a8152602001908152602001600020600050600601600050600060005060008b81526020019081526020016000206000506007016000506040518080602001806020018a815260200189815260200188600160a060020a0316815260200187600160a060020a0316815260200180602001806020018060200186810386528f8181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156108b45780601f10610889576101008083540402835291602001916108b4565b820191906000526020600020905b81548152906001019060200180831161089757829003601f168201915b505086810385528e5460026001821615610100026000190190911604808252602091909101908f9080156109295780601f106108fe57610100808354040283529160200191610929565b820191906000526020600020905b81548152906001019060200180831161090c57829003601f168201915b50508681038452895460026001821615610100026000190190911604808252602091909101908a90801561099e5780601f106109735761010080835404028352916020019161099e565b820191906000526020600020905b81548152906001019060200180831161098157829003601f168201915b505086810383528854600260018216156101000260001901909116048082526020919091019089908015610a135780601f106109e857610100808354040283529160200191610a13565b820191906000526020600020905b8154815290600101906020018083116109f657829003601f168201915b505086810382528754600260018216156101000260001901909116048082526020919091019088908015610a885780601f10610a5d57610100808354040283529160200191610a88565b820191906000526020600020905b815481529060010190602001808311610a6b57829003601f168201915b50509e50505050505050505050505050505060405180910390a150505050505050565b828001600101855582156102e1579182015b828111156102e1578251826000505591602001919060010190610abd565b505081816007016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610b3657805160ff19168380011785555b50610b669291506101ea565b82800160010185558215610b2a579182015b82811115610b2a578251826000505591602001919060010190610b48565b50507f0104beecb4e7c7cbfdb9f3f327a4062f96eedc20c6004df69b034a4381ab6b8f81600001600050826001016000508360020160005054878560030160009054906101000a9004600160a060020a03168660040160009054906101000a9004600160a060020a03168760050160005088600601600050896007016000506040518080602001806020018a815260200189815260200188600160a060020a0316815260200187600160a060020a0316815260200180602001806020018060200186810386528f818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015610ca85780601f10610c7d57610100808354040283529160200191610ca8565b820191906000526020600020905b815481529060010190602001808311610c8b57829003601f168201915b505086810385528e5460026001821615610100026000190190911604808252602091909101908f908015610d1d5780601f10610cf257610100808354040283529160200191610d1d565b820191906000526020600020905b815481529060010190602001808311610d0057829003601f168201915b50508681038452895460026001821615610100026000190190911604808252602091909101908a908015610d925780601f10610d6757610100808354040283529160200191610d92565b820191906000526020600020905b815481529060010190602001808311610d7557829003601f168201915b505086810383528854600260018216156101000260001901909116048082526020919091019089908015610e075780601f10610ddc57610100808354040283529160200191610e07565b820191906000526020600020905b815481529060010190602001808311610dea57829003601f168201915b505086810382528754600260018216156101000260001901909116048082526020919091019088908015610e7c5780601f10610e5157610100808354040283529160200191610e7c565b820191906000526020600020905b815481529060010190602001808311610e5f57829003601f168201915b50509e50505050505050505050505050505060405180910390a15050505056",
    unlinked_binary: "6060604052610e9c806100126000396000f3606060405260e060020a60003504630a1907e8811461003c578063ad847487146101fe578063c85a6b3d146102ed578063c99994ef14610376575b005b6040805160206004803580820135601f810184900484028501840190955284845261003a94919360249390929184019190819084018382808284375050604080516020601f8935808c0135918201839004830284018301909452808352979998604498929750929092019450925082915084018382808284375050604080516020606435808b0135601f81018390048302840183019094528383529799983598976084975091955060249190910193509091508190840183828082843750506040805160209735808a0135601f81018a90048a0283018a0190935282825296989760a4979196506024919091019450909250829150840183828082843750506040805160209735808a0135601f81018a90048a0283018a0190935282825296989760c497919650602491909101945090925082915084018382808284375094965050505050505060018054808201825560008181526020818152604082208a5181548285529383902094959194600292851615610100026000190190941691909104601f90810183900484019391928c01908390106103ff57805160ff19168380011785555b5061042f9291505b8082111561049557600081556001016101ea565b60408051602060248035600481810135601f810185900485028601850190965285855261003a9581359591946044949293909201918190840183828082843750506040805160209735808a0135601f81018a90048a0283018a01909352828252969897606497919650602491909101945090925082915084018382808284375094965050505050505060008381526020818152604082206006810180548651828652948490209294919360026000196001841615610100020190921691909104601f90810182900484019391880190839010610aab57805160ff19168380011785555b50610adb9291506101ea565b61003a600435600081815260208190526040808220600481018054600160a060020a031916331790819055600282015492519193600160a060020a039190911692909182818181858883f150506040805186815290517f601095663bda08ac0f932087ef2eb08e42e4bcd1927f3a8d9500f6ad2c5aef9094509081900360200192509050a15050565b61003a600435600081815260208190526040808220600381018054600160a060020a031916331790819055600282015492519193600160a060020a039190911692909182818181858883f150506040805186815290517f601095663bda08ac0f932087ef2eb08e42e4bcd1927f3a8d9500f6ad2c5aef9094509081900360200192509050a15050565b828001600101855582156101e2579182015b828111156101e2578251826000505591602001919060010190610411565b5050600081815260208181526040822088516001918201805481865294849020909460029381161561010002600019011692909204601f9081018490048301939192918b019083901061049957805160ff19168380011785555b506104c99291506101ea565b5090565b82800160010185558215610489579182015b828111156104895782518260005055916020019190600101906104ab565b5050600081815260208181526040822034600282810191909155600382018054600160a060020a031990811633179091556004830180549091168a17905587516005929092018054818652948490209094600181161561010002600019011691909104601f90810184900482019389019083901061055a57805160ff19168380011785555b5061058a9291506101ea565b8280016001018555821561054e579182015b8281111561054e57825182600050559160200191906001019061056c565b505060008181526020818152604082208551600691909101805481855293839020909360026001821615610100026000190190911604601f9081018490048201938801908390106105ee57805160ff19168380011785555b5061061e9291506101ea565b828001600101855582156105e2579182015b828111156105e2578251826000505591602001919060010190610600565b505060008181526020818152604082208451600791909101805481855293839020909360026001821615610100026000190190911604601f90810184900482019387019083901061068257805160ff19168380011785555b506106b29291506101ea565b82800160010185558215610676579182015b82811115610676578251826000505591602001919060010190610694565b50507f0104beecb4e7c7cbfdb9f3f327a4062f96eedc20c6004df69b034a4381ab6b8f60006000506000838152602001908152602001600020600050600001600050600060005060008481526020019081526020016000206000506001016000506000600050600085815260200190815260200160002060005060020160005054846000600050600087815260200190815260200160002060005060030160009054906101000a9004600160a060020a03166000600050600088815260200190815260200160002060005060040160009054906101000a9004600160a060020a031660006000506000898152602001908152602001600020600050600501600050600060005060008a8152602001908152602001600020600050600601600050600060005060008b81526020019081526020016000206000506007016000506040518080602001806020018a815260200189815260200188600160a060020a0316815260200187600160a060020a0316815260200180602001806020018060200186810386528f8181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156108b45780601f10610889576101008083540402835291602001916108b4565b820191906000526020600020905b81548152906001019060200180831161089757829003601f168201915b505086810385528e5460026001821615610100026000190190911604808252602091909101908f9080156109295780601f106108fe57610100808354040283529160200191610929565b820191906000526020600020905b81548152906001019060200180831161090c57829003601f168201915b50508681038452895460026001821615610100026000190190911604808252602091909101908a90801561099e5780601f106109735761010080835404028352916020019161099e565b820191906000526020600020905b81548152906001019060200180831161098157829003601f168201915b505086810383528854600260018216156101000260001901909116048082526020919091019089908015610a135780601f106109e857610100808354040283529160200191610a13565b820191906000526020600020905b8154815290600101906020018083116109f657829003601f168201915b505086810382528754600260018216156101000260001901909116048082526020919091019088908015610a885780601f10610a5d57610100808354040283529160200191610a88565b820191906000526020600020905b815481529060010190602001808311610a6b57829003601f168201915b50509e50505050505050505050505050505060405180910390a150505050505050565b828001600101855582156102e1579182015b828111156102e1578251826000505591602001919060010190610abd565b505081816007016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610b3657805160ff19168380011785555b50610b669291506101ea565b82800160010185558215610b2a579182015b82811115610b2a578251826000505591602001919060010190610b48565b50507f0104beecb4e7c7cbfdb9f3f327a4062f96eedc20c6004df69b034a4381ab6b8f81600001600050826001016000508360020160005054878560030160009054906101000a9004600160a060020a03168660040160009054906101000a9004600160a060020a03168760050160005088600601600050896007016000506040518080602001806020018a815260200189815260200188600160a060020a0316815260200187600160a060020a0316815260200180602001806020018060200186810386528f818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015610ca85780601f10610c7d57610100808354040283529160200191610ca8565b820191906000526020600020905b815481529060010190602001808311610c8b57829003601f168201915b505086810385528e5460026001821615610100026000190190911604808252602091909101908f908015610d1d5780601f10610cf257610100808354040283529160200191610d1d565b820191906000526020600020905b815481529060010190602001808311610d0057829003601f168201915b50508681038452895460026001821615610100026000190190911604808252602091909101908a908015610d925780601f10610d6757610100808354040283529160200191610d92565b820191906000526020600020905b815481529060010190602001808311610d7557829003601f168201915b505086810383528854600260018216156101000260001901909116048082526020919091019089908015610e075780601f10610ddc57610100808354040283529160200191610e07565b820191906000526020600020905b815481529060010190602001808311610dea57829003601f168201915b505086810382528754600260018216156101000260001901909116048082526020919091019088908015610e7c5780601f10610e5157610100808354040283529160200191610e7c565b820191906000526020600020905b815481529060010190602001808311610e5f57829003601f168201915b50509e50505050505050505050505050505060405180910390a15050505056",
    address: "0x4a06aaa46356509055b788bc2052279c5d1b93ec",
    generated_with: "2.0.9",
    contract_name: "EthPMA"
  };

  function Contract() {
    if (Contract.Pudding == null) {
      throw new Error("EthPMA error: Please call load() first before creating new instance of this contract.");
    }

    Contract.Pudding.apply(this, arguments);
  };

  Contract.load = function(Pudding) {
    Contract.Pudding = Pudding;

    Pudding.whisk(contract_data, Contract);

    // Return itself for backwards compatibility.
    return Contract;
  }

  Contract.new = function() {
    if (Contract.Pudding == null) {
      throw new Error("EthPMA error: Please call load() first before calling new().");
    }

    return Contract.Pudding.new.apply(Contract, arguments);
  };

  Contract.at = function() {
    if (Contract.Pudding == null) {
      throw new Error("EthPMA error: Please call load() first before calling at().");
    }

    return Contract.Pudding.at.apply(Contract, arguments);
  };

  Contract.deployed = function() {
    if (Contract.Pudding == null) {
      throw new Error("EthPMA error: Please call load() first before calling deployed().");
    }

    return Contract.Pudding.deployed.apply(Contract, arguments);
  };

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of Pudding in the browser,
    // and we can use that.
    window.EthPMA = Contract;
  }

})();
