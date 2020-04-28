
export const createHandleScroll = (elWrapper, elInner, cb) => new ScrollHanlderCreator(elWrapper, elInner, cb);

class ScrollHanlderCreator {
	lastPos = 0;
	constructor(elWrapper, elInner, cb) {
		elWrapper.addEventListener(
			'scroll',
			e => {
				const pos = e.target.scrollTop;
				const isScrollUp = pos - this.lastPos > 1;

				this.lastPos = pos;
				if (
					elInner.getBoundingClientRect().bottom -
					e.target.getBoundingClientRect().bottom <
					1 &&
					isScrollUp
				) {
					cb(e);
				}
			},
			false
		);
	}

}
