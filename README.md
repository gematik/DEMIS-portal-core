<img align="right" width="250" height="47" src="./media/Gematik_Logo_Flag.png"/> <br/>

# PortalCore

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
       <ul>
        <li><a href="#quality-gate">Quality Gate</a></li>
        <li><a href="#release-notes">Release Notes</a></li>
      </ul>
	</li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#endpoints">Endpoints</a></li>
      </ul>
    </li>
    <li><a href="#security-policy">Security Policy</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.1.
It contains central components for DEMIS-Frontends.

### Quality Gate
[![Quality Gate Status](https://sonar.prod.ccs.gematik.solutions/api/project_badges/measure?project=demis-portal-core&metric=alert_status&token=sqb_886f9ee9c95470795a4384e48ea1370d2116f46b)](https://sonar.prod.ccs.gematik.solutions/dashboard?id=demis-portal-core)
[![Vulnerabilities](https://sonar.prod.ccs.gematik.solutions/api/project_badges/measure?project=demis-portal-core&metric=vulnerabilities&token=sqb_886f9ee9c95470795a4384e48ea1370d2116f46b)](https://sonar.prod.ccs.gematik.solutions/dashboard?id=demis-portal-core)
[![Bugs](https://sonar.prod.ccs.gematik.solutions/api/project_badges/measure?project=demis-portal-core&metric=bugs&token=sqb_886f9ee9c95470795a4384e48ea1370d2116f46b)](https://sonar.prod.ccs.gematik.solutions/dashboard?id=demis-portal-core)
[![Code Smells](https://sonar.prod.ccs.gematik.solutions/api/project_badges/measure?project=demis-portal-core&metric=code_smells&token=sqb_886f9ee9c95470795a4384e48ea1370d2116f46b)](https://sonar.prod.ccs.gematik.solutions/dashboard?id=demis-portal-core)
[![Lines of Code](https://sonar.prod.ccs.gematik.solutions/api/project_badges/measure?project=demis-portal-core&metric=ncloc&token=sqb_886f9ee9c95470795a4384e48ea1370d2116f46b)](https://sonar.prod.ccs.gematik.solutions/dashboard?id=demis-portal-core)
[![Coverage](https://sonar.prod.ccs.gematik.solutions/api/project_badges/measure?project=demis-portal-core&metric=coverage&token=sqb_886f9ee9c95470795a4384e48ea1370d2116f46b)](https://sonar.prod.ccs.gematik.solutions/dashboard?id=demis-portal-core)


### Release Notes
See [ReleaseNotes](ReleaseNotes.md) for all information regarding the (newest) releases.

## Getting Started

### Prerequisites

Before you can build and run the application, you need to install the following software products:

* [NodeJS](https://nodejs.org) >= 20.0.0
* [npm](https://docs.npmjs.com/try-the-latest-stable-version-of-npm)
* A browser for Tests 
  * Google Chrome
  * Firefox
* An IDE
  * [WebStorm](https://www.jetbrains.com/webstorm)
  * [IntelliJ](https://www.jetbrains.com/de-de/idea)
  * [Visual Studio Code](https://code.visualstudio.com)

#### Angular CLI

To use the project, you need the Angular CLI tool and it can be installed and configured as follows:

```sh
npm add -g @angular/cli
```

### How to build

The Application can be built using the following commands, if they are installed natively:

```sh
npm install
npm run build
```

### Tests

From the IDE, if you are using JetBrains ones, you can run the tests by downloading the [Karma Plugin](https://plugins.jetbrains.com/plugin/7287-karma).

You can run all unit tests once with the following command:

```sh
npm test
```

## Usage

To use this library in your project, this project have to be build. Then run following command in **your** project:
```
npm install <path_to_this_project>/dist/gematik/demis-portal-core-library
```

After this the library should be implemented as local path to your project.

## Security Policy
If you want to see the security policy, please check our [SECURITY.md](.github/SECURITY.md).

## Contributing
If you want to contribute, please check our [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## License
EUROPEAN UNION PUBLIC LICENCE v. 1.2

EUPL © the European Union 2007, 2016

Following terms apply:

1. Copyright notice: Each published work result is accompanied by an explicit statement of the license conditions for use. These are regularly typical conditions in connection with open source or free software. Programs described/provided/linked here are free software, unless otherwise stated.

2. Permission notice: Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions::

    1. The copyright notice (Item 1) and the permission notice (Item 2) shall be included in all copies or substantial portions of the Software.

    2. The software is provided "as is" without warranty of any kind, either express or implied, including, but not limited to, the warranties of fitness for a particular purpose, merchantability, and/or non-infringement. The authors or copyright holders shall not be liable in any manner whatsoever for any damages or other claims arising from, out of or in connection with the software or the use or other dealings with the software, whether in an action of contract, tort, or otherwise.

    3. The software is the result of research and development activities, therefore not necessarily quality assured and without the character of a liable product. For this reason, gematik does not provide any support or other user assistance (unless otherwise stated in individual cases and without justification of a legal obligation). Furthermore, there is no claim to further development and adaptation of the results to a more current state of the art.

3. Gematik may remove published results temporarily or permanently from the place of publication at any time without prior notice or justification.

4. Please note: Parts of this code may have been generated using AI-supported technology.’ Please take this into account, especially when troubleshooting, for security analyses and possible adjustments.

See [LICENSE](LICENSE.md).

## Contact
E-Mail to [DEMIS Entwicklung](mailto:demis-entwicklung@gematik.de?subject=[GitHub]%20Portal-core)
