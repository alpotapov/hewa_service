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

  constructor () {}

  function authorizeDevice(address _newDevice) public onlyOwner() {
    bool isAuthorized = authorizedDevices[_newDevice];
    if (!isAuthorized) {
      authorizedDevices[_newDevice] = true;
      emit Authorized(_newDevice);
    }
  }

  function removeDeviceAuthorization(address _device) public onlyOwner() {
    authorizedDevices[_device] = false;
  }

  function isDeviceAuthorized(address _device) public view returns (bool) {
    return authorizedDevices[_device];
  }

  function publishResult(
    address _device,
    string memory _guid,
    string memory _result,
    uint _nonce,
    bytes memory _signature
  ) external {
    bytes memory result = bytes(results[_guid]);
    require(result.length == 0, "ResultRegistry: guid already in use");

    require(
      isDeviceAuthorized(_device),
      "ResultRegistry: device not authorized"
    );
    require(
      verify(_device, _result, _nonce, _signature),
      "ResultRegistry: wrong signature"
    );

    results[_guid] = _result;
    emit ResultPublished(_guid);
  }
}