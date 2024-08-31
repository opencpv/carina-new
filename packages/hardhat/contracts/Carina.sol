// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.0 <0.9;

contract Carina {
    uint private claimEnumerator;

    struct Patient {
        string fullname;
        string email;
        address payable wallet;
    }

    struct Insurer {
        address wallet;
        string name;
    }

    struct HealthProvider {
        address wallet;
        string name;
        string email;
    }

    struct Claim {
        uint id;
        Patient patient;
        HealthProvider provider;
        ClaimStatus status;
        uint256 cost;
    }

    enum ClaimStatus {
        Pending,
        Approved,
        Rejected,
        Settled
    }

    mapping(address => Patient) private patients;
    mapping(address => HealthProvider) private providers;
    mapping(uint => Claim) public claims;
    mapping(address => Insurer) public insurers;

    event ClaimCreated(uint claimId, uint256 cost);
    event ClaimStatusUpdated(uint claimId, ClaimStatus status);
    event ClaimSettled(uint claimId);

    constructor() {
        claimEnumerator = 0;
    }

function submitClaim(string memory fullname, string memory email, address payable walletAddress, uint256 cost) public returns (uint) {
    require(stringNotEmpty(providers[msg.sender].email), "Health provider email must not be empty");

    Patient memory patient;
    if (patients[walletAddress].wallet == address(0)) {
        patient = Patient({
            fullname: fullname,
            email: email,
            wallet: walletAddress
        });

        patients[patient.wallet] = patient;
    } else {
        patient = patients[walletAddress];
    }

    HealthProvider storage provider = providers[msg.sender];

    claimEnumerator++;

    Claim storage claim = claims[claimEnumerator];
    claim.id = claimEnumerator;
    claim.patient = patient;
    claim.provider = provider;
    claim.status = ClaimStatus.Pending;
    claim.cost = cost;

    emit ClaimCreated(claim.id, claim.cost);
    return claim.id;
}

    function approveClaim(uint claimId) public {
        require(stringNotEmpty(insurers[msg.sender].name), "Caller must be a registered insurer");

        updateClaimStatus(claimId, ClaimStatus.Approved);
        emit ClaimStatusUpdated(claimId, ClaimStatus.Approved);
    }

    function rejectClaim(uint claimId) public {
        require(stringNotEmpty(insurers[msg.sender].name), "Caller must be a registered insurer");

        updateClaimStatus(claimId, ClaimStatus.Rejected);
        emit ClaimStatusUpdated(claimId, ClaimStatus.Rejected);
    }

    function settleClaim(uint claimId) public payable returns (bool) {
        require(stringNotEmpty(insurers[msg.sender].name), "Caller must be a registered insurer");
    
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.Approved, "Only approved claims can be settled");

        require(msg.sender.balance >= claim.cost, "Not enough funds to settle claim");
    
        claim.patient.wallet.transfer(claim.cost);
    
        updateClaimStatus(claimId, ClaimStatus.Settled);
        emit ClaimSettled(claimId);
        emit ClaimStatusUpdated(claimId, ClaimStatus.Settled);
    
        return true;
    }

    function getClaim(uint claimId) public view returns (Claim memory) {
        return claims[claimId];
    }

    function createInsurer(string memory name, address insurerAddress) public returns (Insurer memory) {
        require(stringNotEmpty(name), "Insurer name must not be empty");
    
        if (stringNotEmpty(insurers[insurerAddress].name)) {
            return insurers[insurerAddress];
        }
    
        Insurer storage insurer = insurers[insurerAddress];
        insurer.wallet = insurerAddress;
        insurer.name = name;
    
        return insurer;
    }

    function createProvider(string memory name, string memory email, address providerAddress) public returns (HealthProvider memory) {
        if (stringNotEmpty(providers[providerAddress].email)) {
            return providers[providerAddress];
        }
    
        HealthProvider storage provider = providers[providerAddress];
        provider.wallet = providerAddress;
        provider.name = name;
        provider.email = email;
    
        return provider;
    }

    function stringsEqual(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function stringNotEmpty(string memory a) internal pure returns (bool) {
        return !stringsEqual(a, '');
    }

    function updateClaimStatus(uint claimId, ClaimStatus status) private {
        if(stringNotEmpty(claims[claimId].patient.email)){
            claims[claimId].status = status;
        }
    }
}

