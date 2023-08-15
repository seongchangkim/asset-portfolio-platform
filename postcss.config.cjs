/* eslint-env node */

module.exports = {
  modules: true,
  plugins: {  
    "tailwindcss/nesting": "postcss-nesting",
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: [
        ">1%",
        "last 4 versions",
        "Firefox ESR",
        "not ie < 9"
      ],
      flexbox: "no-2009"
    }
  },
}
