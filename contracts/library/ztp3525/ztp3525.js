/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/solv-finance/erc-3525/blob/main/contracts/ZTP3525.sol
 */

import 'utils/basic-operation';
import 'interface/IZEP165';
import 'interface/ztp3525/IZTP3525';
import 'interface/ztp3525/IZTP3525';
import 'interface/ztp721/IZTP721';
import 'interface/ztp3525/IZTP3525Receiver';
import 'interface/ztp721/IZTP721Receiver';

const ZTP3525 = function () {
    const BasicOperationUtil = new BasicOperation();

    const TOKEN_PRE = 'token';
    const ADDRESS_PRE = 'address';
    const SLOT_PRE = 'slot';
    const APPROVED_VALUES = 'approved_values';
    const TOTAL_SUPPLY = 'total_supply';
    const CONTRACT_INFO = 'contract_info';
    const ZTP_PROTOCOL = 'ztp3525';
    const EMPTY_ADDRESS = "0x";
        
    const self = this;
    let tokenIdGenerator = 1;

    function TokenData(id, slot, owner) {
        this.id = id;
        this.slot = slot;
        this.owner = owner;
        this.balance = 0;
        this.approved = "";
        this.valueApprovals = [];
    }

    function AddressData() {
        this.ownedTokens = [];
        this.approvals = [];
    }

    function AllTokens() {
        this.tokens = [];
    }

    self.p = {/*protected functions*/};

    self.p.init = function (name, symbol, describe = "", version = "1.0.0") {
        BasicOperationUtil.saveObj(CONTRACT_INFO, {
            name: name,
            symbol: symbol,
            describe: describe,
            protocol: ZTP_PROTOCOL,
            version: version,
            issuer: Chain.msg.sender
        });

        let allTokens = new AllTokens();
        BasicOperationUtil.saveObj(TOTAL_SUPPLY, allTokens);
    };

    self.p.createOriginalTokenId = function () {
        tokenIdGenerator = tokenIdGenerator + 1;
        return tokenIdGenerator;
    };

    self.p.createDerivedTokenId = function () {
        return self.p.createOriginalTokenId();
    };

    /**
     * @dev Reverts if the `tokenId` hasn't been minted, or it has been burned.
     * Returns true/false.
     */
    self.p.requireMinted = function (tokenId) {
        let tokenObj = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId));
        Utils.assert(tokenObj !== false, 'ZTP3525: Token does not exist.');
        return true;
    };

    self.p.isApprovedOrOwner = function (operator, tokenId) {
        self.p.requireMinted(tokenId);
        let tokenObj = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId));
        if (operator === tokenObj.owner || operator === tokenObj.approved) {
            return true;
        } else {
            return false;
        }
    };

    self.p.exists = function (tokenId) {
        let tokenData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId));
        if (tokenData === false) {
            return false;
        } else {
            return true;
        }
    };

    self.supportsInterface = function (paramObj) {
        let interfaceId = paramObj.interfaceId;
        let iface1 = Utils.sha256(JSON.stringify(IZEP165), 1);
        let iface2 = Utils.sha256(JSON.stringify(IZTP721), 1);
        let iface3 = Utils.sha256(JSON.stringify(IZTP3525Receiver), 1);
        let iface4 = Utils.sha256(JSON.stringify(IZTP721Receiver), 1);

        return interfaceId === iface1 || interfaceId === iface2 || interfaceId === iface3 || interfaceId === iface4;
    };

    self.name = function () {
        let data = BasicOperationUtil.loadObj(CONTRACT_INFO);
        if (data === false) {
            return '';
        }
        return data.name;
    };

    self.symbol = function () {
        let data = BasicOperationUtil.loadObj(CONTRACT_INFO);
        if (data === false) {
            return '';
        }
        return data.symbol;
    };

    self.valueDecimals = function () {
        let data = BasicOperationUtil.loadObj(CONTRACT_INFO);
        if (data === false) {
            return '';
        }
        return data.decimals;
    };

    // returns the balance of tokens for an address or balance of a token id
    self.balanceOf = function (paramObj) {
        if (paramObj.tokenId && !paramObj.ownerAddress) {
            self.p.requireMinted(paramObj.tokenId);
            let tokenObj = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, paramObj.tokenId));
            if (tokenObj === false) {
                return '0';
            }
            return tokenObj.balance;
        } else if (!paramObj.tokenId && paramObj.ownerAddress) {
            Utils.assert(Utils.addressCheck(paramObj.ownerAddress), "ZTP3525: Invalid owner address: " + paramObj.ownerAddress);
            let ownerObj = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(ADDRESS_PRE, paramObj.ownerAddress));
            if (ownerObj === false) {
                return [];
            }
            return ownerObj.ownedTokens;
        }
    };

    self.ownerOf = function (paramObj) {
        self.p.requireMinted(paramObj.tokenId);
        let tokenObj = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, paramObj.tokenId));
        return tokenObj.owner;
    };

    self.slotOf = function (paramObj) {
        self.p.requireMinted(paramObj.tokenId);
        let tokenObj = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, paramObj.tokenId));
        return tokenObj.slot;        
    };

    self.p.baseURI = function () {
        return "";
    };

    self.contractInfo = function () {
        return BasicOperationUtil.loadObj(CONTRACT_INFO);
    };

    self.contractURI = function () {
        let data = BasicOperationUtil.loadObj(CONTRACT_INFO);
        if (data === false) {
            return '';
        }
        return data;
    };

    self.slotURI = function (paramObj) {
        let data = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(SLOT_PRE, paramObj.slotId));
        if (data === false) {
            return '';
        }
        return data;
    };

    self.tokenURI = function (paramObj) {
        let data = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, paramObj.tokenId));
        if (data === false) {
            return '';
        }
        return data;
    };

    self.approve = function (paramObj) {
        let owner = "";
        if (paramObj.tokenId && paramObj.to && paramObj.value) {
            owner = self.ownerOf({ tokenId: paramObj.tokenId });
            Utils.assert(paramObj.to !== owner, 'ZTP3525: Approval to current owner.');
            let permissioned = self.p.isApprovedOrOwner(Chain.msg.sender, paramObj.tokenId);
            Utils.assert(permissioned === true, 'ZTP3525: approve caller is not owner nor approved.');
            self.p.approveValue(paramObj.tokenId, paramObj.to, paramObj.value);
        } else if (paramObj.to && paramObj.tokenId) {
            owner = self.ownerOf({ tokenId: paramObj.tokenId });
            Utils.assert(paramObj.to !== owner, 'ZTP3525: Approval to current owner.');
            Utils.assert(Chain.msg.sender === owner || self.isApprovedForAll({ owner: owner, operator: Chain.msg.sender }), 'ZTP3525: Approve caller is not owner nor approved for all.');
            self.p.approve(paramObj.to, paramObj.tokenId);
        }

    };

    self.p.approve = function (to, tokenId) {
        let tokenData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId));
        tokenData.approved = to;
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId), tokenData);
    };

    self.isApprovedForAll = function (paramObj) {
        let addressData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(ADDRESS_PRE, paramObj.owner));
        let isApprovedForAll = addressData.approvals.includes(paramObj.operator);
        return isApprovedForAll;
    };

    self.p.approveValue = function (tokenId, to, value) {
        Utils.assert(Utils.addressCheck(to) === true, 'ZTP3525: Operator address is invalid.');
        Utils.assert(to !== EMPTY_ADDRESS, 'ZTP3525: Approve value to the zero address.');
        let tokenData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId));
        Utils.assert(tokenData !== false, 'ZTP3525: Token does not exist.');
        let exist = self.p.existApproveValue(to, tokenId);
        if (!exist) {
            tokenData.valueApprovals.push(to);
            BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId), tokenData);
        }
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(APPROVED_VALUES, to, tokenId), value);
    };

    self.p.clearApprovedValues = function (tokenId) {
        let tokenKey = BasicOperationUtil.getKey(TOKEN_PRE, tokenId);
        let tokenData = BasicOperationUtil.loadObj(tokenKey);
        tokenData.valueApprovals.forEach(function(address) {
            BasicOperationUtil.delObj(BasicOperationUtil.getKey(APPROVED_VALUES, address, tokenId));
        });      
        tokenData.valueApprovals = [];
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId), tokenData);
    };

    self.p.existApproveValue = function (to, tokenId) {
        let tokenData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId));
        if (tokenData.valueApprovals.includes(to) === false) {
            return false;
        } else {
            return true;
        }
    };

    self.allowance = function (paramObj) {
        self.p.requireMinted(paramObj.tokenId);
        let approvedValues = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(APPROVED_VALUES, paramObj.operator, paramObj.tokenId));
        if (approvedValues !== false) {
            return approvedValues;
        } else {
            return '0';
        }
    };

    self.p.spendAllowance = function (operator, tokenId, value) {
        let currentAllowance = self.allowance({ tokenId: tokenId, operator: operator });
        if(!self.p.isApprovedOrOwner(operator, tokenId)) {
            Utils.assert(Utils.int256Compare(currentAllowance, value) > 0, 'ZTP3525: Insufficient allowance.');
            self.p.approveValue(tokenId, operator, currentAllowance - value);
        }
    };

    self.totalSupply = function () {
        let totalSupply = BasicOperationUtil.loadObj(TOTAL_SUPPLY);
        return totalSupply.tokens.length;
    };

    self.p.beforeValueTransfer = function (from, to, fromTokenId, toTokenId, slot, value) {
        /**
         * @dev to implement custom logic
         */
        return;
    };

    self.p.afterValueTransfer = function (from, to, fromTokenId, toTokenId, slot, value) {
        /**
         * @dev to implement custom logic
         */
        return;
    };

    self.p.mint = function (to, slot, value, tokenId = "") {
        if (tokenId === "") {
            tokenId = self.p.createOriginalTokenId();
        }
        Utils.assert(to !== EMPTY_ADDRESS, 'ZTP3525: Mint to the zero address');
        Utils.assert(tokenId !== 0, 'ZTP3525: Cannot mint zero tokenId');
        Utils.assert(self.p.exists(tokenId) === false, 'ZTP3525: Token already minted.');

        /** 
        * @dev can implement logic before & after transfer 
        * */
       self.p.beforeValueTransfer(EMPTY_ADDRESS, to, 0, tokenId, slot, value);
       self.p.mintToken(to, tokenId, slot);
       self.p.mintValue(tokenId, value);
       self.p.afterValueTransfer(EMPTY_ADDRESS, to, 0, tokenId, slot, value);
    };

    self.p.mintValue = function (tokenId, value) {
        let tokenKey = BasicOperationUtil.getKey(TOKEN_PRE, tokenId);
        let tokenData = BasicOperationUtil.loadObj(tokenKey);
        Utils.assert(tokenData !== false, 'ZTP3525: Token does not exist.');
        let approved = self.p.isApprovedOrOwner(Chain.msg.sender, tokenId);
        Utils.assert(approved === true, 'ZTP3525: Not owner or approved address.');

        /** 
        * @dev can implement logic before & after transfer 
        * */
        self.p.beforeValueTransfer(EMPTY_ADDRESS, tokenData.owner, 0, tokenId, tokenData.slot, value);
        tokenData.balance = Utils.int256Add(tokenData.balance, value);
        BasicOperationUtil.saveObj(tokenKey, tokenData);
        self.p.afterValueTransfer(EMPTY_ADDRESS, tokenData.owner, 0, tokenId, tokenData.slot, value);
    };
    
    self.p.mintToken = function (to, tokenId, slot) {
        Utils.assert(Utils.addressCheck(to) === true, 'ZTP3525: Recipient address is invalid.');
        let tokenKey = BasicOperationUtil.getKey(TOKEN_PRE, tokenId);
        let tokenData = BasicOperationUtil.loadObj(tokenKey);
        Utils.assert(tokenData === false, 'Token ID already exists.');
    
        // create object
        let tokenObject = new TokenData(tokenId, slot, Chain.msg.sender);
    
        // store token object
        BasicOperationUtil.saveObj(tokenKey, tokenObject);
    
        // update balance for recipient
        let recipientKey = BasicOperationUtil.getKey(ADDRESS_PRE, to);
        let recipientData = BasicOperationUtil.loadObj(recipientKey);
    
        if (recipientData === false) {
            recipientData = new AddressData();
        }
        recipientData.ownedTokens.push(tokenKey);
        BasicOperationUtil.saveObj(recipientKey, recipientData);
    
        // update total supply
        let currentSupply = BasicOperationUtil.loadObj(TOTAL_SUPPLY);
        currentSupply.tokens.push(tokenKey);
        BasicOperationUtil.saveObj(TOTAL_SUPPLY, currentSupply);
    };

    self.transferFrom = function (paramObj) {
        // transfer value between tokens
        if (paramObj.fromTokenId && paramObj.toTokenId && paramObj.value) {            
            self.p.spendAllowance(Chain.msg.sender, paramObj.fromTokenId, paramObj.value);
            self.p.transferValue(paramObj.fromTokenId, paramObj.toTokenId, paramObj.value);
        } 
        else if (paramObj.fromTokenId && paramObj.to && paramObj.value) {
            self.p.spendAllowance(Chain.msg.sender, paramObj.fromTokenId, paramObj.value);
            let newTokenId = self.p.createDerivedTokenId();
            self.p.mint(paramObj.to, self.slotOf({ tokenId: paramObj.fromTokenId }), 0, newTokenId);
            self.p.transferValue(paramObj.fromTokenId, newTokenId, paramObj.value);
        }
        // transfer token to another address 
        else if (paramObj.from && paramObj.to && paramObj.tokenId) {
            Utils.assert(self.p.isApprovedOrOwner(Chain.msg.sender, paramObj.tokenId) === true, 'ZTP3525: Transfer caller is not owner nor approved.');
            self.p.transferTokenId(paramObj.from, paramObj.to, paramObj.tokenId);
        }
    };

    self.p.transferTokenId = function (from, to, tokenId) {
        Utils.assert(self.ownerOf({ tokenId: tokenId }) === from, 'ZTP3525: Transfer from invalid owner.');
        Utils.assert(to !== EMPTY_ADDRESS, 'ZTP3525: Transfer to the zero address.');
        let slot = self.slotOf({ tokenId: tokenId });
        let value = self.balanceOf({ tokenId: tokenId });
        self.p.beforeValueTransfer(from, to, tokenId, tokenId, slot, value);
        self.p.approve(EMPTY_ADDRESS, tokenId);
        self.p.clearApprovedValues(tokenId);
        self.p.removeTokenFromOwnerEnumeration(from, tokenId);
        self.p.addTokenToOwnerEnumeration(to, tokenId);
        self.p.beforeValueTransfer(from, to, tokenId, tokenId, slot, value);
    };

    self.p.transferValue = function (fromTokenId, toTokenId, value) {
        Utils.assert(self.p.exists(fromTokenId) === true, 'ZTP3525: Transfer from invalid token ID.');
        Utils.assert(self.p.exists(toTokenId) === true, 'ZTP3525: Transfer to invalid token ID.');
        let fromTokenData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, fromTokenId));
        let toTokenData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, toTokenId));

        Utils.assert(Utils.int256Compare(fromTokenData.balance, value) > 0, 'ZTP3525: Insufficient balance.');
        Utils.assert(fromTokenData.slot === toTokenData.slot, 'ZTP3525: Transfer to token with different slot.');

        self.p.beforeValueTransfer(fromTokenData.owner, toTokenData.owner, fromTokenId, toTokenId, fromTokenData.slot, value);
        fromTokenData.balance -= value;
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOKEN_PRE, fromTokenId), fromTokenData);
        toTokenData.balance += value;
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOKEN_PRE, toTokenId), toTokenData);
        self.p.afterValueTransfer(fromTokenData.owner, toTokenData.owner, fromTokenId, toTokenId, fromTokenData.slot, value);

        /**
         * @dev to implement and call checkOnZTP3525Received
         */
    };

    self.p.removeTokenFromOwnerEnumeration = function (from, tokenId) {
        let tokenKey = BasicOperationUtil.getKey(TOKEN_PRE, tokenId);
        let tokenData = BasicOperationUtil.loadObj(tokenKey);
        tokenData.owner = EMPTY_ADDRESS;
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId), tokenData);

        let addressData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(ADDRESS_PRE, from));
        addressData.ownedTokens = addressData.ownedTokens.filter(function(ownedToken) {
            let ownedTokenKey = BasicOperationUtil.getKey(TOKEN_PRE, ownedToken);
            return ownedTokenKey !== tokenKey;
        });
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(ADDRESS_PRE, from), addressData);
    };

    self.p.addTokenToOwnerEnumeration = function (to, tokenId) {
        let tokenKey = BasicOperationUtil.getKey(TOKEN_PRE, tokenId);
        let tokenData = BasicOperationUtil.loadObj(tokenKey);
        tokenData.owner = to;
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId), tokenData);

        let addressData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(ADDRESS_PRE, to));
        addressData.ownedTokens.push(tokenKey);
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(ADDRESS_PRE, to), addressData);
    };

    self.getApproved = function (paramObj) {
        self.p.requireMinted(paramObj.tokenId);
        let tokenData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, paramObj.tokenId));
        return tokenData.approved;
    };

    self.setApprovalForAll = function (paramObj) {
        self.p.setApprovalForAll(Chain.msg.sender, paramObj.operator, paramObj.approved);
    };

    self.p.setApprovalForAll = function (owner, operator, approved) {
        Utils.assert(owner !== operator, 'ERC3525: Approve to caller.');
        let addressData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(ADDRESS_PRE, owner));
        if (approved) {
            if (!addressData.approvals.includes(operator)) {
                addressData.approvals.push(operator);
            }
        } else {
            addressData.approvals = addressData.approvals.filter(function(address) {
                return address !== operator;
            });
        }
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(ADDRESS_PRE, owner), addressData);
    };

    self.p.removeTokenFromAllTokensEnumeration = function (tokenId) {
        let tokenToRemoveKey = BasicOperationUtil.getKey(TOKEN_PRE, tokenId);
        let totalSupply = BasicOperationUtil.loadObj(TOTAL_SUPPLY);
        totalSupply.tokens = totalSupply.tokens.filter(function(token) {
            let tokenKey = BasicOperationUtil.getKey(TOKEN_PRE, token);
            return tokenKey !== tokenToRemoveKey;
        });
        BasicOperationUtil.saveObj(TOTAL_SUPPLY, totalSupply);
    };

    self.p.burn = function (tokenId) {
        self.p.requireMinted(tokenId);
        let tokenData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId));
        let owner = tokenData.owner;
        let slot = tokenData.slot;
        let value = tokenData.balance;

        self.p.beforeValueTransfer(owner, EMPTY_ADDRESS, tokenId, 0, slot, value);
        self.p.clearApprovedValues(tokenId);
        self.p.removeTokenFromOwnerEnumeration(owner, tokenId);
        self.p.removeTokenFromAllTokensEnumeration(tokenId);
        self.p.afterValueTransfer(owner, EMPTY_ADDRESS, tokenId, 0, slot, value);
    };

    self.p.burnValue = function (tokenId, burnValue) {
        self.p.requireMinted(tokenId);
        let tokenData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId));
        let owner = tokenData.owner;
        let slot = tokenData.slot;
        let value = tokenData.balance;

        Utils.assert(Utils.int256Compare(value, burnValue) > 0, 'ZTP3525: Burn value exceeds balance.');
        self.p.beforeValueTransfer(owner, EMPTY_ADDRESS, tokenId, 0, slot, burnValue);
        tokenData.balance -= burnValue;
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOKEN_PRE, tokenId), tokenData);
        self.p.afterValueTransfer(owner, EMPTY_ADDRESS, tokenId, 0, slot, burnValue);
    };

    self.safeTransferFrom = function (paramObj) {
        Utils.assert(self.p.isApprovedOrOwner(Chain.msg.sender, paramObj.tokenId) === true, 'ZTP3525: Transfer caller is not owner nor approved.');
        self.p.safeTransferTokenId(paramObj.from, paramObj.to, paramObj.tokenId, paramObj.data);
    };

    self.p.safeTransferTokenId = function (from, to, tokenId, data) {
        self.p.transferTokenId(from, to, tokenId);
        /**
         * @dev to implement and call checkOnZTP3525Received
        */
    };

    self.p.isContract = function (address) {
        let query = {
            'method': 'contractInfo'
        };
        let ret = Chain.contractQuery(address, JSON.stringify(query));
        if (ret === false || JSON.parse(ret.error) === true) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * @dev to implement and call checkOnZTP3525Received
    */
    // self.p.checkOnZTP3525Received = function (from, to, tokenId, data) {    
    // };
};