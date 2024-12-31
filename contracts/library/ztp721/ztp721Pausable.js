import 'library/ztp721/ztp721';
import 'library/pausable';

const ZTP721Pausable = function () {

    const self = this;

    ZTP721.call(self);
    Pausable.call(self);

    const _update = self.update;

    // override
    self.update = function (to, tokenId, auth) {
        self.whenNotPaused();
        return _update.call(self, to, tokenId, auth);
    };
};