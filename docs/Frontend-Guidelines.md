# PPR - Schulgong - Frontend-Guidelines 

<hr>

## :pushpin: General information

The present document provides an outline of the guidelines for the Frontend.

<hr>

### :wrench: Environment Setup

- Node.js Version 18.15.0 LTS
- Angular Version 15.2.0

<hr>

### :book: Naming convention for variables

- All variables must be written in English!

- In addition, the variables must be in camelCase!

- Meaningful variable names e.g.: totalAmount;

- The naming convention for a list must be for e.g.: personList;

#### Typescript Doc (Documentation):

- All methods must have English Typescript documentation e.g.:

```ts
  /**
   * Toggle sidebar
   * return void
   */
  toggle(): void {
    this.isOpen = !this.isOpen;
  }
```

- All classes must have at the beginning implementation notes e.g.:

```ts
/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.1
 * @since: April 2023
 * @description: Reusable delete dialog component
 */
```

### :file_folder: Project structure

- We decided to use the following folder structure (as an example). For example, all reused components should be created in the 'components' folder.
- In addition, pages should be created in the 'page' folder.
Services that are necessary for calling the REST API should be created in the services' folder.

- All Angular Material components must be imported in material.module.ts.

```md
├── app
|  ├── components
|  ├── layout
|  ├── models
|  ├── pages
|  ├── services
|  ├── material.module.ts
├── assets
|  ├── fonts
|  |     ├── Montserrat-Regular.ttf
|  ├── images
```

### :clipboard: Testing

For every implemented class, a corresponding test class and associated Unit tests must also be written.
