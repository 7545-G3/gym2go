#!/usr/bin/env node

console.log("Running (Android) compatible screens hook")

var fs = require('fs')
var manifestSrc = 'platforms/android/AndroidManifest.xml'

var rawManifest = fs.readFileSync(manifestSrc, 'utf8')

// Parse with DOMParse to manipulate
var DOMParser = require('xmldom').DOMParser
var AndroidManifest = new DOMParser().parseFromString(rawManifest)

// Get 'manifest' elememt
var manifestElement = AndroidManifest.getElementsByTagName('manifest')[0]

// Just in case remove current 'compatible-screens' element (perhaps Cordova set some default value)
var compatibleScreens = manifestElement.getElementsByTagName('compatible-screens')[0]
if (compatibleScreens) {
  manifestElement.removeChild(compatibleScreens)
}

// Append 'compatible-screens' element with desired config
var configXML = getCompatibleScreensXML()
var compatibleScreens = new DOMParser().parseFromString(configXML)
manifestElement.appendChild(compatibleScreens)

// Convert manifest back to raw string
var XMLSerializer = require('xmldom').XMLSerializer
var modifiedManifest = new XMLSerializer().serializeToString(AndroidManifest)

// Write file with new config
fs.writeFileSync(manifestSrc, modifiedManifest)

console.log('Succesfully saved AndroidManifest.xml')


function getCompatibleScreensXML() {

  var js2xmlparser = require("js2xmlparser")

  var data = {
    'screen': [{
      '@': {
        'android:screenSize': 'small',
        'android:screenDensity': 'ldpi'
      }
    }, {
      '@': {
        'android:screenSize': 'small',
        'android:screenDensity': 'mdpi'
      }
    }, {
      '@': {
        'android:screenSize': 'small',
        'android:screenDensity': 'hdpi'
      }
    }, {
      '@': {
        'android:screenSize': 'small',
        'android:screenDensity': 'xhdpi'
      }
    }, {
      '@': {
        'android:screenSize': 'normal',
        'android:screenDensity': 'ldpi'
      }
    }, {
      '@': {
        'android:screenSize': 'normal',
        'android:screenDensity': 'mdpi'
      }
    }, {
      '@': {
        'android:screenSize': 'normal',
        'android:screenDensity': 'hdpi'
      }
    }, {
      '@': {
        'android:screenSize': 'normal',
        'android:screenDensity': 'xhdpi'
      }
    }]
  }

  var options = {
    declaration: {
      include: false
    }
  }

  return js2xmlparser('compatible-screens', data, options)
}

/*

<compatible-screens>
    <screen android:screenDensity="ldpi" android:screenSize="small" />
    <screen android:screenDensity="mdpi" android:screenSize="small" />
    <screen android:screenDensity="hdpi" android:screenSize="small" />
    <screen android:screenDensity="xhdpi" android:screenSize="small" />
    <screen android:screenDensity="ldpi" android:screenSize="normal" />
    <screen android:screenDensity="mdpi" android:screenSize="normal" />
    <screen android:screenDensity="hdpi" android:screenSize="normal" />
    <screen android:screenDensity="xhdpi" android:screenSize="normal" />
</compatible-screens>

*/