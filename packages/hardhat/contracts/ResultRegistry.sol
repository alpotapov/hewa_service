pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: UNLICENSED

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./VerifySignature.sol";

contract ResultRegistry is Ownable {
  mapping(address => bool) private authorizedDevices;

  event Authorized(address device);

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
}