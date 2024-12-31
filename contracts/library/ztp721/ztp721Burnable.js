import 'library/ztp721/ztp721';

const ZTP721Burnable = function () {

    const EMPTY_ADDRESS = "0x";

    const self = this;

    ZTP721.call(self);

    self.burn = function (tokenId) {
        self.update(EMPTY_ADDRESS, tokenId, Chain.msg.sender);
    };
};