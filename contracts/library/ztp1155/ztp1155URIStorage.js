/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol
 */

import 'utils/basic-operation'
import 'library/ztp1155/ztp1155';

const ZTP1155URIStorage = function () {

    const BasicOperationUtil = new BasicOperation();

    const TOKEN_URIS = 'token_uris';
    const BASE_URI = 'base_uri';

    const self = this;

    ZTP1155.call(self);

    // override
    const _uri = self.uri;
    self.uri = function (tokenId) {
        let tokenUri = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_URIS, tokenId));
        let baseUri = BasicOperationUtil.loadObj(BASE_URI);
        return (tokenUri !== false && tokenUri.length > 0) ? (baseUri + tokenUri) : _uri(tokenId);
    };

    self.setUri = function (tokenId, tokenURI) {
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOKEN_URIS, tokenId), tokenURI);
        Chain.tlog("URI", self.uri(tokenId), tokenId);
    };

    self.setBaseURI = function (baseURI) {
        BasicOperationUtil.saveObj(BASE_URI, baseURI);
    };

};
