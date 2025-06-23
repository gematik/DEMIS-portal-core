/*
    Copyright (c) 2025 gematik GmbH
    Licensed under the EUPL, Version 1.2 or - as soon they will be approved by the
    European Commission – subsequent versions of the EUPL (the "Licence").
    You may not use this work except in compliance with the Licence.
    You find a copy of the Licence in the "Licence" file or at
    https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
    Unless required by applicable law or agreed to in writing,
    software distributed under the Licence is distributed on an "AS IS" basis,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
    In case of changes by gematik find details in the "Readme" file.
    See the Licence for the specific language governing permissions and limitations under the Licence.
    *******
    For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
 */

import { normalize, strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  externalSchematic,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Source,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';

/**
 * Utility function to convert kebab-case strings to Title Case.
 *
 * @param str The kebab-case string to convert.
 * @returns   The converted Title Case string.
 */
function kebabToTitleCase(str: string): string {
  let convertedStr = '';
  for (let segment of str.split('-')) {
    convertedStr += `${segment.charAt(0).toUpperCase()}${segment.slice(1)} `;
  }
  return convertedStr;
}

/**
 * Function to create an example component for the consumer page.
 *
 * @param selectorSuffix The suffix of the component selector from the lib after gem-demis.
 *                       Also used for the name of the folder where the example component will be created.
 * @returns              The source of the example component.
 */
function createExampleComponent(selectorSuffix: string, classNamePrefix: string): Source {
  // Create a new example component for the consumer page by modifying and using the existing example component template
  return apply(url('./files/examples'), [template({ selectorSuffix, classNamePrefix }), move('demo/src/app/code-snippets')]);
}

/**
 * Function to create the content of the consumer page by passing concrete values to the source template.
 *
 * @param selectorSuffix        The suffix of the component selector from the lib after gem-demis.
 *                              Also the name of the folder the example component is taken from.
 * @param fileNamePrefix        The prefix for the file name of the consumer page component.
 * @param consumerComponentName The name of the consumer page component.
 * @param classNamePrefix       The prefix for the class name of the consumer page component.
 * @returns                     The source of the consumer page component.
 */
function createConsumerPageContent(selectorSuffix: string, fileNamePrefix: string, consumerComponentName: string, classNamePrefix: string): Source {
  // Create the consumer page contents by modifying and using the existing consumer page template
  return apply(url('./files/consumer-component'), [
    template({
      selectorSuffix,
      fileNamePrefix,
      consumerComponentName,
      classNamePrefix,
    }),
    move('demo/src/app/pages'),
  ]);
}

/**
 * Function to create the consumer page component using the Angular schematic.
 *
 * @param componentPath The path where the consumer page component will be created.
 * @returns             The rule to create the consumer page component.
 */
function createConsumerPageComponent(componentPath: string): Rule {
  // Use the Angular schematic to generate the consumer component
  return externalSchematic('@schematics/angular', 'component', {
    name: componentPath,
    style: 'scss',
    inlineStyle: true,
    inlineTemplate: true,
    skipTests: true,
    flat: true,
    skipSelector: true,
    project: 'demo',
  });
}

/**
 * Function to register the consumer page in the app routes.
 *
 * @param tree                     The tree representing the file system.
 * @param routePath                The path of the route to be registered.
 * @param routeTitle               The title of the route to be registered.
 * @param destinationComponentName The name of the destination component to route to.
 * @param destinationComponentPath The import path of the destination component to route to.
 */
function registerConsumerPageInAppRoutes(
  tree: Tree,
  routePath: string,
  routeTitle: string,
  destinationComponentName: string,
  destinationComponentPath: string
): void {
  // Register the consumer page in the app routes
  const appRoutesFilePath = 'demo/src/app/app.routes.ts';

  if (!tree.exists(appRoutesFilePath)) {
    throw new Error(`File ${appRoutesFilePath} not found.`);
  }

  const appRoutesContent = tree.readText(appRoutesFilePath);
  const regex = /(componentConsumerRoutes: Routes = \[[^\]]*)\];/gi;
  const changedAppRoutesContent = appRoutesContent.replace(
    regex,
    `$1` +
      `  {\n` +
      `    path: '${routePath}',\n` +
      `    title: '${routeTitle}',\n` +
      `    pathMatch: 'full',\n` +
      `    component: ${destinationComponentName}Component,\n` +
      `  },\n` +
      `];`
  );

  const appRoutesContentLines = changedAppRoutesContent.split('\n');
  const importLineRegex = /^ *import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
  const importLineIndices: number[] = [];
  appRoutesContentLines.forEach((line, index) => {
    if (importLineRegex.test(line)) {
      importLineIndices.push(index);
    }
  });
  importLineIndices.sort((a, b) => b - a); // Sort in descending order
  const newImportLine = `import { ${destinationComponentName}Component } from '${destinationComponentPath}';`;
  appRoutesContentLines.splice(importLineIndices[0], 0, newImportLine);
  tree.overwrite(appRoutesFilePath, appRoutesContentLines.join('\n'));
}

/**
 * The main schematic function to create a consumer page for a component.
 *
 * @param options The options for the schematic, including the name of the component.
 * @returns       The rule to create an example component, create the consumer page, and register the consumer to the app routes.
 */
export function consumerPageFor(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const dasherizedName = strings
      .dasherize(options.name)
      .toLowerCase()
      .replace(/[-|\.]component$/, '');
    const classifiedName = strings.classify(dasherizedName);
    const titleCaseName = kebabToTitleCase(dasherizedName);
    const consumerComponentFileNamePrefix = `${dasherizedName}-consumer`;
    const consumerComponentName = strings.classify(consumerComponentFileNamePrefix);
    const consumerComponentSourcePath = normalize(`pages/${consumerComponentFileNamePrefix}`);
    const consumerComponentImportPath = `./${consumerComponentSourcePath}.component`;

    const exampleTemplateSource = createExampleComponent(dasherizedName, classifiedName);

    const consumerPageContent = createConsumerPageContent(dasherizedName, consumerComponentFileNamePrefix, consumerComponentName, classifiedName);

    const generateConsumerComponentRule = createConsumerPageComponent(consumerComponentSourcePath);

    registerConsumerPageInAppRoutes(tree, dasherizedName, titleCaseName, consumerComponentName, consumerComponentImportPath);

    // execute the rule chain for the schematic
    return chain([
      generateConsumerComponentRule,
      mergeWith(exampleTemplateSource, MergeStrategy.Overwrite),
      mergeWith(consumerPageContent, MergeStrategy.Overwrite),
    ])(tree, context);
  };
}
