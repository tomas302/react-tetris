

window.accurateInterval = function(fn, time) {
    var cancel, nextAt, timeout, wrapper;
    nextAt = new Date().getTime() + time;
    timeout = null;
    wrapper = function() {
      nextAt += time;
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      return fn();
    };
    cancel = function() {
      return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
      cancel: cancel
    };
};

const timer = (state = -1, action) => {
    switch(action.type) {
        case 'START_TIMER':
            return window.accurateInterval(action.fn, action.delay);
        case 'STOP_TIMER':
            state.cancel()
            return -1;
        default:
            return state;
    }
};

export default timer;