const fs = require('fs')
const Path = require('path')
const { generateRoutes } = require('vue-route-generator')

const pagesDirectory = Path.resolve('./pages')
const outputFile = Path.resolve('./router/routes.js')

const defaultConfig = {
  pages: pagesDirectory,
  importPrefix: '~/pages/'
}

module.exports = async bundler => {

  bundler.on('buildStart', async (entryPoints) => {

    const code = generateRoutes(defaultConfig)

    fs.readFile(outputFile, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }

      if(data != code){
        fs.writeFileSync(outputFile, code)
      }
  
    });

  })

  bundler.on('buildError', async (entryPoints) => {
    console.log("got error")
  })

  bundler.on('bundled', async (bundle) => {
    let mainAsset =
    bundler.mainAsset ||                                                // parcel < 1.8
    bundler.mainBundle.entryAsset ||                                    // parcel >= 1.8 single entry point
    bundler.mainBundle.childBundles.values().next().value.entryAsset;   // parcel >= 1.8 multiple entry points

    bundler.watch(pagesDirectory, mainAsset);
  })

}