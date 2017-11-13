# mvplocal business

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Development enviroment setup

### Build dependencies

To build the project you'll need grunt. Grunt installs with npm, so you'll need node.js installed first. Get latest version 4 from [the official website](https://nodejs.org/en/).

After installing nodejs, run `npm install` on the repo root to get grunt and its plugins (and other dependencies). Finally, to get the grunt CLI installed globally run `npm install -g grunt-cli`.

Front end deps are managed with bower. Get the CLI by running `npm install -g bower`.

Stylesheets are written in [SCSS](http://sass-lang.com/) on top of [the Compass framework](http://compass-style.org/). Install compass by following [the official instructions](http://compass-style.org/install/); summarily:

```
$ gem update --system  # Might need sudo
$ gem install compass
```

If you need to install Ruby (depends on your system setup), [rvm](https://rvm.io) or [rbenv](http://rbenv.org/) are recommended.

### Project dependencies

To install front end dependencies with bower, run `bower install`. This will install all dependencies as listed in the file `bower.json`.

### Build or run locally in the browser

Run `grunt` for building and `grunt serve` for development live reload.

### Build for other environments

We have 3 environments:

1- Development
2- Test
3- Uat

When you run `grunt` or `grunt build`, you are building for development environment.
If you need build for other environments, you have to use the parameter "target" like this:

For test, run:
`grunt build --target=test`

For uat, run:
`grunt build --target=uat`

The "target" parameter generates the constants for the specified environment.
Each time that you run this command, you can see changes in constants.js file.



### Add constansts

App constants will be added in common.constants.json file
After add a constant, run grunt build to make it available in constants.js file.

Environment constants are in Gruntfile.js under the task ngconstant.


### Run on Android or iOS devices or emulators

Install the phonegap CLI: `npm install -g phonegap`.

Before following the instructions below, build dependencies as instructed above.

#### Android

Install the Android SDK. You can install standalone, or with Android Studio from http://developer.android.com/intl/es/sdk/index.html.

Open AVD Manager (Android Virtual Device Manager) and set up an emulator, or set up a hardware device following [these instructions](http://developer.android.com/intl/es/tools/device.html). If you set up a genymotion emulator, follow the instructions as if using a hardware device.

Add the android platform for phonegap by running `phonegap platform add android`.

Build the app's assets by running `grunt build`. Run `phonegap run android --verbose` to generate the .apk, install the application in the configured device and open the app on it.

#### iOS

This **must** be run on a Mac with Xcode.

Add the ios platform for phonegap by running `phonegap platform add ios`.

Build the app's assets by running `grunt build`. Run `phonegap run ios --verbose` to generate the .apk, install the application in the configured device and open the app on it.


## Testing

Running `grunt test` will run the unit tests with karma.


### Generate .ipa in Windows

1. Go to https://build.phonegap.com and signup

2. Add a key for iOS
  a. Go to https://build.phonegap.com/people/edit and select Signing Keys

  b. Select “add a key” and upload provisioning profile and p12 file to generate the key. The provisioning profile file is unique for each device/app, p12 file is the same for all keys. 

  c. Select lock icon and set the password: mvplocal

3. Go to Apps tab, create a .zip file of www project folder, and upload it. The building processes start automatically.

4. If building processes finish successfully, you can see blue buttons to download the .ipa or .apk. If there was an error, you can check the logs.

### Upload .ipa in Testfairy

1. Go to https://app.testfairy.com/ and signup

2. Upload the .ipa

3. Go to Apps and select the app version

4. Send an invitation to testing, adding the tester email.

### Install .ipa on iPhone

#### From TestFairy

1. Open a browser on the iPhone and go to the testfairy link that is displayed in Apps page. Log in and download .ipa. 

#### From iTunes

1. Install iTunes on Windows

2. Go to tab “Apps” in the top navbar

3. Drag the .ipa and provisioning profile file (if it is the first time that you install the app )

4. Connect the phone

5. Go to phone tab and synchronize

6. Check the app was installed

## Generate UAT release

Build the app's assets for UAT enviroment by running `grunt build --target=uat`.

#### Android

Run `phonegap build android --verbose` to generate the .apk, and get the generated apk from `platforms/android/build/outputs/apk/android-debug.apk`

#### iOS (TestFlight)

The following steps **must** be run on a Mac with Xcode.

Run `phonegap build ios --verbose` to generate Xcode project. Open Xcode project from `platforms/ios/mvp business.xcodeproj` and follow these steps:

1. You must be logged in with krichardson@mvplocal.com Apple ID and have the appropiate Development Certificate and Provisioning Profile (if you do not possess credentials, request them to the project manager).

2. On the 'General' tab of the project, select team "Kerry Richardson (krichardson@mvplocal.com)".

3. Go to Product > Archive. When archiving finishes, Xcode will show a "Build successful" and open the Organizer.

4. On the Organizer, select appropiate build and click on "Upload to App Store..." (right panel).

5. Select the team and follow steps in the modal.

6. Once uploading finishes, you must login to iTunes Connect (https://itunesconnect.apple.com) with the same Apple ID.

7. On iTunnes Connect, go to "My Apps" > "MVP Local" > "TestFlight" > "Internal Testing" > "Select Version to Test" and choose the appropiate build (it may take a few minutes/hours for build to be available).

8. Don't forget to click the 'Save' button! Refresh browser page to make sure changes were applied.

Once build is selected for testing, an email will be sent to Internal Testers to install the app.