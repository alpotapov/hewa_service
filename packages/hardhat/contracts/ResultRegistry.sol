pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: UNLICENSED

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./VerifySignature.sol";

contract ResultRegistry is Ownable, VerifySignature {
    mapping(address => bool) private authorizedDevices;
    mapping(string => string) private results;

    event Authorized(address device);
    event ResultPublished(string guid);

    constructor() {}

    function authorizeDevice(address _newDevice) public onlyOwner {
        require(
            !authorizedDevices[_newDevice],
            "ResultRegistry: device already authorized"
        );
        authorizedDevices[_newDevice] = true;
        emit Authorized(_newDevice);
    }

    function removeDeviceAuthorization(address _device) public onlyOwner {
        authorizedDevices[_device] = false;
    }

    function isDeviceAuthorized(address _device) public view returns (bool) {
        return authorizedDevices[_device];
    }

    function getMessageHash(string memory _a, string memory _b)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_a, _b));
    }

    function verify(
        address _signer,
        string memory _result,
        string memory _guid,
        bytes memory signature
    ) public pure returns (bool) {
        bytes32 messageHash = getMessageHash(_result, _guid);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, signature) == _signer;
    }

    function publishResult(
        address _device,
        string memory _guid,
        string memory _result,
        bytes memory _signature
    ) external {
        bytes memory result = bytes(results[_guid]);
        require(result.length == 0, "ResultRegistry: guid already in use");

        require(
            isDeviceAuthorized(_device),
            "ResultRegistry: device not authorized"
        );
        require(
            verify(_device, _result, _guid, _signature),
            "ResultRegistry: wrong signature"
        );

        results[_guid] = _result;
        emit ResultPublished(_guid);
    }

    function getResult(string memory _guid)
        public
        view
        returns (string memory)
    {
        return results[_guid];
    }
}
