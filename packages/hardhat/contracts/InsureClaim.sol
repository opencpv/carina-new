// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InsureClaim {
    struct Claim {
        uint256 id;
        address payable claimant;
        string policyName;
        address insurerAddress;
        string description;
        uint256 claimAmount;
        bool submitted;
        bool isApproved;
        bool isPaid;
        string rejectionReason;
    }

    uint256 public nextClaimId;
    mapping(uint256 => Claim) public claims;
    address public insurer;

    event ClaimSubmitted(uint256 claimId, address claimant);
    event ClaimApproved(uint256 claimId);
    event ClaimRejected(uint256 claimId, string reason);
    event ClaimPaid(uint256 claimId, uint256 amount);

    modifier onlyInsurer() {
        require(msg.sender == insurer, "Only insurer can perform this action");
        _;
    }

    modifier onlySubmitted(uint256 claimId) {
        require(claims[claimId].submitted, "Claim must be submitted");
        _;
    }

    constructor() {
        insurer = msg.sender;
    }

    function submitClaim(
        string memory _policyName,
        string memory _description,
        uint256 _claimAmount,
        address _insurerAddress
    ) external returns(uint id) {
        require(_claimAmount > 0, "Claim amount must be greater than zero");

        claims[nextClaimId] = Claim({
            id: nextClaimId,
            claimant: payable(msg.sender),
            policyName: _policyName,
            description: _description,
            claimAmount: _claimAmount,
            insurerAddress:_insurerAddress,
            submitted: true,
            isApproved: false,
            isPaid: false,
            rejectionReason: ""
        });

        emit ClaimSubmitted(nextClaimId, msg.sender);
        nextClaimId++;

        return nextClaimId - 1;
    }

    function approveClaim(uint256 _claimId) external onlyInsurer onlySubmitted(_claimId) {
        Claim storage claim = claims[_claimId];
        require(!claim.isApproved, "Claim already approved");
        require(!claim.isPaid, "Claim already paid");

        claim.isApproved = true;

        emit ClaimApproved(_claimId);
    }

    function rejectClaim(uint256 _claimId, string memory _reason) external onlyInsurer onlySubmitted(_claimId) {
        Claim storage claim = claims[_claimId];
        require(!claim.isApproved, "Claim already approved");
        require(!claim.isPaid, "Claim already paid");

        claim.isApproved = false;
        claim.rejectionReason = _reason;

        emit ClaimRejected(_claimId, _reason);
    }

    function payClaim(uint256 _claimId) external onlyInsurer onlySubmitted(_claimId) {
        Claim storage claim = claims[_claimId];
        require(claim.isApproved, "Claim not approved");
        require(!claim.isPaid, "Claim already paid");

        claim.isPaid = true;
        claim.claimant.transfer(claim.claimAmount);

        emit ClaimPaid(_claimId, claim.claimAmount);
    }

    function getClaim(uint256 _claimId)
        external
        view
        returns (
            uint256 id,
            address claimant,
            string memory policyName,
            string memory description,
            uint256 claimAmount,
            bool submitted,
            bool isApproved,
            bool isPaid,
            string memory rejectionReason
        )
    {
        Claim storage claim = claims[_claimId];
        return (
            claim.id,
            claim.claimant,
            claim.policyName,
            claim.description,
            claim.claimAmount,
            claim.submitted,
            claim.isApproved,
            claim.isPaid,
            claim.rejectionReason
        );
    }

    function withdrawFunds() external onlyInsurer {
        payable(insurer).transfer(address(this).balance);
    }

    // Function to deposit funds into the contract for payment purposes
    function depositFunds() external payable {}

    receive() external payable {}
}