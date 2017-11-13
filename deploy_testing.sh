#!/usr/bin/env bash
app_id=2083200
phonegap_build_token=u8SaCkoPYvCwLuncwWr4
testfairy_token=c08525fcd11d2f0e3d51856f67fb228b263da141
version=$1

apk_dest="test_releases/mvplocal-business-test@$version.apk"
ipa_dest="test_releases/mvplocal-business-test@$version.ipa"

# Check version number param
if [ $# -eq 0 ]
then
    echo "Missing version number!"
    exit
fi

# Check jsawk installed
jsawk --help >/dev/null 2>&1 || { echo >&2 "This script needs jsawk!"; exit; }

# Bower and npm install (just in case)
clear
echo "Bower and npm install (just in case)...."
bower install
npm install

# Grunt build test release
clear
echo "Building Grunt test release...."
grunt build --target=test
clear

# Remove files if exist
rm www.zip >/dev/null 2>&1
rm $apk_dest >/dev/null 2>&1
rm $ipa_dest >/dev/null 2>&1

# Compress www folder
echo "Compressing www..."
zip -r www.zip www >/dev/null

# Upload app to Phonegap Build
echo "Uploading project to Phonegap Build..."
curl -X PUT -F "file=@www.zip" "https://build.phonegap.com/api/v1/apps/$app_id?auth_token=$phonegap_build_token" >/dev/null

# Create release dir if not exists
mkdir test_releases >/dev/null 2>&1

# Download APK (loop until available)
printf "Waiting for APK..."
apkURL=""
while [ -z "$apkURL" ]
do
    sleep 1s
    apkURL=$(curl -s "https://build.phonegap.com/api/v1/apps/$app_id/android?auth_token=$phonegap_build_token" | jsawk 'return this.location')
    printf "."
done
echo "\nDownloading APK to $apk_dest..."
curl -o $apk_dest $apkURL

# Download IPA (loop until available)
printf "Waiting for IPA..."
ipaURL=""
while [ -z "$ipaURL" ]
do
    sleep 1s
    ipaURL=$(curl -s "https://build.phonegap.com/api/v1/apps/$app_id/ios?auth_token=$phonegap_build_token" | jsawk 'return this.location')
    printf "."
done
echo "\nDownloading IPA to $ipa_dest..."
curl -o $ipa_dest $ipaURL

# Upload to TestFairy
echo "Uploading APK to TestFairy..."
curl "https://app.testfairy.com/api/upload" -F "api_key=$testfairy_token" -F "file=@$apk_dest" -F "testers_groups=all" >/dev/null
echo "Uploading IPA to TestFairy..."
curl "https://app.testfairy.com/api/upload" -F "api_key=$testfairy_token" -F "file=@$ipa_dest" -F "testers_groups=all" >/dev/null

# Delete compressed www folder
rm www.zip >/dev/null 2>&1

echo "Release $version succesful!"