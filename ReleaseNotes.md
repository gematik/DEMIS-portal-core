<img align="right" alt="gematik" width="250" height="47" src="media/Gematik_Logo_Flag.png"/> <br/>    

# Release Notes Portal-Core

## Release 2.3.3

- Added notifiedPersonNotByName config to library

## Release 2.3.2

- Add FollowUp Notification Service & Dialog
- Add FhirCoreNotificationService for backend calls

## Release 2.3.1

- Make repeater component standalone
- Added notifiedPersonAnonymous config to library

## Release 2.3.0

- Updated ngx-formly to version 7.0.0

## Release 2.2.4

- Improvements to the section header component

## Release 2.2.3

- Fix routing issue in submit dialog

## Release 2.2.2

- Fixed pastebox bug when pasting content with newline characters

## Release 2.2.1

- Renaming and adaption of sectionTitle to sectionHeading
- Fixed a styling issue in the submit-dialog
- Added a new process stepper implementation and made the old one deprecated
- Update @angular-devkit/build-angular to 19.2.17

## Release 2.2.0

- Added spinner-dialog to library
- Fixed dependency issues

## Release 2.1.1

- Fixed release pipeline

## Release 2.1.0

- Enabled the datepicker to accept German date formats, even when set programmatically
- Added submit-dialog to library

## Release 2.0.3

- Simplified consumer pages by introducing Markdown support
- Added scripts to deploy locally built library tgz files to microfrontends and restore from these to a registry version
- Added demis-portal-theme-library to the Demo App in order to reflect the DEMIS visual style

## Release 2.0.2

- Fixed style bug in Datepicker

## Release 2.0.1

- Upgraded dependencies to most recent versions ensuring best compatibility

## Release 2.0.0

- **Breaking Change**: Switched to Angular 19 and updated all dependencies accordingly.

## Release 1.4.2

- Datepicker: Handled incorrect default values and edge cases related to the pastebox.
- Repeater: Provided unique ID for each repeated element.

## Release 1.4.1

- Datepicker: Fixed a bug with the navigation arrows in the header.
- Datepicker: Added support for dynamic minimum and maximum dates.
- Datepicker: Added support for custom styling and validation messages from the consuming application.
- Datepicker: made it compatible with repeater
- Datepicker: made it compatible with pastebox

## Release 1.4.0

- Fixed an issue with non compatible dependency versions of ngx-formly and missing peer dependencies.
- Introduced a FormlyDatepicker component to the library. It is based on Angular Material and designed to be used as a custom Formly type. The component supports three precision levels: day, month, and year.

## Release 1.3.6

- Enhanced the MaxHeightContentContainer component to support an array of CSS-selectors for HTML elements that will be subtracted from the max viewport height. This allows for more flexibility in defining the maximum height of the content container.


## Release 1.3.5

- Introduced a schematics project in the workspace and added schematic `consumer-page-for` in order to be used with the `ng generate` command. This schematic can be used to generate a new consumer page for a component from portal-core library in the demo app.
- Formly Repeater: Updated test selectors to use standard HTML id attributes instead of data-testid.


## Release 1.3.4

- Formly Repeater: Improved styling.


## Release 1.3.3

- Formly Repeater: Added setFieldCount method to programmatically adjust the number of repeated fields, with optional value reset support.


## Release 1.3.2

- Formly Repeater: Enabled the ability for consuming apps to dynamically apply custom classes, giving greater flexibility in styling repeatable form fields.


## Release 1.3.1

- Added new example and improved tests for the Formly Repeater
- Fixed URI decoding issue in the Paste Box component

## Release 1.3.0

- Introduced a Formly Repeater component to the library, which can be used as a Formly custom type for making single input fields repeatable.
- The Paste-Box now URL-decodes each splitted segment from the URL-encoded data from the clipboard.

## Release 1.2.1

- Adjusted the border radius of the error dialog

## Release 1.2.0

- Introduced Paste Box component to the library. This component comprises of a button that enables Microfrontends to read data from the clipboard in a generic way.

## Release 1.1.3

- Updated ospo-resources for adding additional notes and disclaimer
- Introduced a demo app to the workspace to showcase the usage of the portal-core library. The demo app is located in the `demo` folder and serves both as a reference for developers to understand how to integrate the library in their own applications and as development platform for the portal-core library with minimum dependencies.
- The error dialog has been adjusted to meet all micro-frontend requirements. Specifically, it can now be configured to be closable or to include a redirect to the homepage.

## Release 1.1.2

- Edit the style of the error dialog to align with the new style adjustments.

## Release 1.1.1

### Improvements

- The error dialog has been adjusted to meet the design specifications.
- Scroll behaviour of error dialog improved

## Release 1.1.0

- First official GitHub-Release
