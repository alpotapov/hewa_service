pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: UNLICENSED

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HealthWalletAccess is ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping(uint256 => address[]) tokenGuardians;

  event AccessTokenCreated(address patient, uint256 tokenId);

  constructor() ERC721("HealthWalletAccess", "HWA") {}

  function requestNewAccessToken(
    address _patient,
    bool _assignAdminAsGuardian
  ) public returns (uint256) {
    uint256 newTokenId = _tokenIds.current();
    _mint(_patient, newTokenId);

    if (_assignAdminAsGuardian == true) {
      tokenGuardians[newTokenId].push(owner());
    }

    _tokenIds.increment();
    return newTokenId;
  }

  function isGuardian(
    address _guardian,
    uint256 _tokenId
  ) public view returns (bool) {
    for (uint256 i = 0; i < tokenGuardians[_tokenId].length; i++) {
      if (tokenGuardians[_tokenId][i] == _guardian) {
        return true;
      }
    }

    return false;
  }

  /**
     * @dev override default transferFrom and allow guardians to transfer NFTs.
    */
  function transferFrom(
      address from,
      address to,
      uint256 tokenId
  ) public virtual override {
      //solhint-disable-next-line max-line-length
      require(
        _isApprovedOrOwner(_msgSender(), tokenId) || isGuardian(_msgSender(), tokenId),
        "ERC721: caller is not token owner nor approved"
      );

      _transfer(from, to, tokenId);
  }

  // function restoreAccessToPatient(
  //   address _updatedPatientAddress,
  //   uint256 _tokenId
  // ) public onlyOwner {

  // }
}