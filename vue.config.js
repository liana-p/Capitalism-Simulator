module.exports = {
    /** Hosting public path changed to match what github pages generate so I can host it there */
    // publicPath: '/Capitalism-Simulator/dist/',
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/assets/sass/variables.scss";`
            }
        }
    }
};
