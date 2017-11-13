#!/usr/bin/env bash

# Check track name param
if [ $# -eq 0 ]
then
    echo "Missing track name!"
    echo "Help: track-name [alpha | beta | production]"
    exit
fi
track_name=$1
echo "Bower and npm install (just in case)..."
bower install
npm install
echo "Upgrading required gems..."
gem install mime-types -v 2.6.2
echo "Building assets..."
grunt build --target=production
if [ $? -ne 0 ]; then
    echo "Building assets has failed"
    exit
fi
echo "Building APK..."
cordova build --release android
if [ $? -ne 0 ]; then
    echo "Error building the APK."
    exit
fi
if [ ! -f MVP-Local.keystore ]; then
    echo "Generating Keystore..."
    keytool -genkey -v -keystore MVP-Local.keystore -alias MVPLocal -keyalg RSA -keysize 2048 -validity 10000
    if [ $? -ne 0 ]; then
        echo "Error generating Keystore"
        exit
    fi
fi
echo "Signing APK..."
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore MVP-Local.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk mvplocal
if [ $? -ne 0 ]; then
    echo "Error signing the APK"
    exit
fi
echo "Making final APK..."
if [ -f platforms/android/build/outputs/apk/MVPLocal.apk ]; then
   rm platforms/android/build/outputs/apk/MVPLocal.apk
fi
zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/MVPLocal.apk
if [ $? -ne 0 ]; then
    echo "Error building the final APK."
    exit
fi
echo "Uploading to Google Play"
supply --apk platforms/android/build/outputs/apk/MVPLocal.apk --json_key Google-Play-Android-Developer-9e152ee31160.json --package_name com.kerryrichardson.mvplocal --track ${track_name}
if [ $? -ne 0 ]; then
    echo "Error uploading the APK to Google Play."
    exit
fi
