module.exports = {
    plugins: ['@snowpack/plugin-typescript'],
    mount: {
        "res": {url: '/res'},
        "src": {url: '/'},
    },
    devOptions: {
        open: 'none'
    }
};