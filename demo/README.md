<img align="right" width="250" height="47" src="./../media/Gematik_Logo_Flag.png"/> <br/>

# Readme portal-core demo app

## Getting Started

### Building the lib and running the demo app

Make sure you have the library project in this workspace built and running in watch mode and the demo application up and running in serve mode.
The easiest way to achieve this is to run the following npm script:

```sh
npm run dev
```

This will start the library in watch mode and the demo application in serve mode. The demo application will automatically reload when changes are made to the library.

## Development of a new feature of portal-core library with the help of this demo app

### The short answer

You can use the built in schematic to create a new showcase page for your feature.
At the moment, there is only one schematic available, which creates a new showcase page and one example for a component.
To create a new showcase page for your feature, run the following command:

```sh
ng generate core-schematics:consumer-page-for <component-name-in-kebab-case>
```

This will create a new showcase page for your feature in the `src/app/pages` folder and a new example component in the `src/app/code-snippets/<component-name>` folder.
The result should look like this:

```
src
└── app
    ├── code-snippets
    │   └── <component-name>
    │       ├── example-1.component.html
    │       └── example-1.component.ts
    └── pages
        ├── <component-name>-consumer.component.ts
        └── ...
```
The schematic will also add the route for the new showcase page to the `src/app/app.routes.ts` file.
For best results, make sure, that the component you are generating the showcase page for is already implemented in the library.

### The long answer

To develop a new feature of portal-core in this demo app you need to add a showcase page for it.
Create a new file in the `src/app/pages` folder with the name of your feature, suffixed by the term `-consumer`.
For example, if you want to develop a new component called `paste-box`, create a file called `paste-box-consumer.component.ts`.
The result should look like this:

```
src
└── app
    └── pages
        ├── paste-box-consumer.component.ts
        └── ...
```

The easiest way to create a new showcase page is to copy an existing one and adapt it to your needs.
Alternatively, you can create one on your own using the Angular CLI like so:

```sh
ng generate component --inline-template --inline-style --flat --skip-tests pages/paste-box-consumer --project demo
```

As you can see, the command combines everything needed by the consumer component in one single file.
Furthermore, it skips the creation of a test spec file, which is not needed for the demo app at the moment.
**BEWARE!** That does NOT mean that you should not write tests for the library component itself!

The showcase page should be a simple Angular component and contain some general information about the feature as well as some examples showcasing the use cases the feature is designed for.
Please use the generic building blocks of the demo app to create the showcase page.
These building blocks are located in the `src/app/utils` folder.
If you need to create a new building block, or enhance the functionality of an already existing one, make sure to coordinate these changes in a frontend sync before pushing them.

#### Adding examples to a showcase page

Typically, a showcase page should contain at least one example of the feature.
The example should be a simple Angular component that uses the feature and demonstrates its functionality.
All examples of a feature should be placed in a corresponding subfolder of the `src/app/code-snippets` folder and imported into the showcase page from there.

For example, if you want to add an example for the `paste-box` feature, create a new Angular component called `example-1` in the `src/app/code-snippets/paste-box` folder.
The result should look like this:

```
src
└── app
    ├── code-snippets
    │   ├── paste-box
    │   │   ├── example-1.component.html
    │   │   └── example-1.component.ts
    │   └── ...
    └── pages
        ├── paste-box-consumer.component.ts
        └── ...
```

In order to use the example in the showcase page, you need to import it and use the `code-example-box` component from the `utils` folder.
The `code-example-box` component is a generic building block that can be used to display code examples in the demo app.
For it to work properly, it is crucial, that the example component is placed in the `src/app/code-snippets` folder and imported from there.
Contents of the code-snippets folder are copied to the `dist` folder of the demo app and are available in the demo app at runtime.
Thus, the `code-example-box` component can access the sourced of the example component and display the formatted code in the demo app.

#### Make showcase page available in the demo app

In order to make the showcase page available in the demo app, you need to add it to the `src/app/app.routes.ts` file.
In this file, there are dedicated sections for each type of feature (components, services, directives, etc.) of the portal-core library prepared.
You need to add the route for your showcase page to the corresponding section.
Make sure to give the route a meaningful title, because this title will be used automatically in the demo app.
Once you added the route, you can start the demo app and navigate to the showcase page using a navigation link in the corresponding feature type section.
The entries in the navigation sections are sorted alphabetically by route title.

## Troubleshooting

If you encounter any issues while running the demo application or while development, please check one of the already exiting showcase pages or contact other DEMIS frontend developers.
