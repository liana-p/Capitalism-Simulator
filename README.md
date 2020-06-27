# Capitalism Simulator

Idle game prototype built in [TypeScript](https://www.typescriptlang.org) with [Vue.js](https://vuejs.org) and [Vuex](https://vuex.vuejs.org). Uses [sass](https://sass-lang.com) for improved CSS and [Bulma](https://bulma.io) as the base CSS framework.

Playable at [http://capitalismsimulator.imfast.io](http://capitalismsimulator.imfast.io)

## Setup

Based on the [vue-cli](https://cli.vuejs.org) base setup
### Install
```
yarn install
```

### Develop with hot reloading
```
yarn serve
```

### Make a production build
```
yarn build
```

The build will be in the `dist` folder.

Note that `dist` _isn't gitignored_ because it's used to host the game directly from the repo.

### Deploy to prod

1. Build with `yarn build`
2. Push to master, the game URL is statically hosted on fast.io and will redeploy the contents of the `dist` folder when it detects changes on the master branch

## Tools and Frameworks

### TypeScript
Because typed code is much quicker to iterate as it avoids most runtime errors

### Vue.js

Vue.js is a JavaScript front-end framework that has great reactivity features and makes it easy to create reusable UI components. Idle games being very UI heavy, I decided to implement this project in a JS front-end framework rather than using a 2D game framework like pixi.js which would have poor UI features.

### Vuex

From the documentation: 

> "Vuex is a state management pattern + library for Vue.js applications. It serves as a centralized store for all the components in an application, with rules ensuring that the state can only be mutated in a predictable fashion. It also integrates with Vue's official devtools extension to provide advanced features such as zero-config time-travel debugging and state snapshot export / import."

Having a state manager system is very helpful to structure the game and make sure that modifications to the state are controlled and only done where they should be done. This helps ensure single responsibility principle by forbidding game code from manually mutating the state without going through known mutations.

### Sass + Bulma

Sass extends on CSS with features like variables which makes it way easier to specify color schemes and other common UI properties.

I wanted a CSS grid framework for the UI layout of the factories, and Bulma provides a grid system on top of being light and having a clean default CSS.

Bulma variables and other color scheme variables from the game are customised in `assets/sass/variables.scss`, while `main.scss` contains common CSS, and the rest of the CSS is embedded in specific Vue components.

### Typed vuex store

Vuex isn't very well typed by default, and I wanted fully typed access to the store to avoid runtime bugs. After some digging I found [the setup described there](https://medium.com/swlh/properly-typed-vuex-stores-427bf4c6a3d1) which is somewhat tedious to use but gives the huge advantage of having fully typed store access, mutations and getters.

## Game Architecture

### Folder Structure

The initial structure is based on the [vue-cli](https://cli.vuejs.org) automated app setup.

The game has a `package.json` which is used for installing libraries and running/building the game using npm or yarn.
The source code and assets are in the `src/` folder, while the built output of the game goes to `dist/`.

src folder contents:
* `assets`: Folder containing assets, including CSS files
* `components`: Contains all the Vue components used in the game
* `data`: Contains game balance data (stored as TypeScript file so type-checking can help avoid data mistakes)
* `directives`: vue.js [custom directives](https://vuejs.org/v2/guide/custom-directive.html), currently used to make it easy to conditionally disable buttons
* `filters`: vue.js [filters](https://vuejs.org/v2/guide/filters.html), currently used to make it easy to format numbers, currencies and times directly in vue components
* `interfaces`: Contains some type files that are used by multiple places in the code, as I find it convenient to have the types of a feature in one place rather than having bits of it in the middle of code
* `router`: vue.js routes for changing pages, technically used by the game but we only have one page so it's irrelevant
* `store`: The actual Vuex store with the structure of all the state of the game
  * `modules`: Inside the store folder, the `modules` folder contains individual parts of the store with their logic
* `utils`: Just a folder for storing utilities
* `views`: Folder containing pages, of which we only have one (`Game.vue`)

### Game flow

The game is built as a vue.js app. `main.ts` is the entrypoint, which just loads the vue app, router and vuex store to generate the application.

* `App.vue` is the main vue.js component and contains the overall layout of the game.
* `store/index.ts` is the file that builds and exports the vuex store for the game to use
* `router/index.ts` builds the list of page routes for the game, but only one page is used anyway

### Game entry point (App.vue)

`App.vue` loads the game as soon as it's created, using the `loadGame` function. Then it launches the game loop using requestAnimationFrame

The game loop calls `FactoriesStore.mutations.updateFactoriesProduction` to calculate profits on every tick. Then, the reactivity of Vue takes care of updating the UI everywhere based on what happens.

The components used there are:

* `GameTopbar`: The topbar displays the name of the game, current money, and a button to change purchase mode between x1, x10, next upgrade, or max available
* `Game`: The main game screen component displaying the factories and their production
* `DebugButton`: Displays little debugging tools to help with testing (should be disabled in production but I didn't get around to it)
* `NotificationToast`: Displays notifications if there are any
* `GameBottomBar`: Bottom menu with buttons to access managers and upgrades modals
* `ModalContainer`: Spawned for every modal in the store, takes care of displaying modals properly

#### Game.vue

The `game.vue` component is the main gameplay screen, and uses the `FactoriesContainer` component to display the list of all factories.

### Vuex store structure

The `store/RootState.ts` file is the one that defines the type of the state and its structure. Each object in the store is a module of the store, built as an instance of a class that represents the state of the module.

The store and its modules are built using [vuex-typex](https://github.com/mrcrowl/vuex-typex), a utility library that helps create a strongly typed store.

The overall store is built this way
```
export interface RootState {
    money: MoneyState;
    factories: FactoriesState;
    modals: ModalState;
    notifications: NotificationState;
    upgrades: UpgradesState;
}

export const storeBuilder = getStoreBuilder<RootState>();
```

Individual store modules are created using the `storeBuilder` too, for example:

```
/** Main state for the money store */
export class MoneyState {
    public lastUpdate: MoneyUpdate = {
        time: timer.time,
        money: 10,
    };
}

const builder = storeBuilder.module<MoneyState>('money', new MoneyState());
```

Each module contains the logic corresponding to its features. Store modules use the following:

* The state, which is a class to hold the data
* mutations, which are the vuex mutation functions and the only way state data is allowed to be mutated (this ensures single responsibility). Mutations are where most of the game simulation logic is
* getters, which are helpers to easily access specific bits of the state or pre-calculated values based on the state

The modules in the game are:

* `factories.ts` (`FactoriesState` class): Manages owned factories, their purchasing, cost, managers, calculation of profits etc. The core of the game logic is in this one.
* `modals.ts`: Manages modals in the store which allows any place in the game to dynamically spawn popups by calling a mutation with a component name and some parameters
* `money.ts` (`MoneyState` class): Manages the player's currency
* `notifications.ts`: Used to control the state of notification toasts that can appear sometimes
* `timer.ts`: Isn't technically in the store but is a Vue object so other components can react to it dynamically without it having to call a mutation every time the time ticks (which would spam mutations for no reason)
* `upgrades.ts`: Manages the list of upgrades that can be purchased and applies their effects. The code is very similar to managers, but because this feature is different and can be extended to have all sort of effects, I kept it separate.

## Features

### Factories

Factories are the core of the game, they are the main things the player purchases, and running them produces money, which is in turn used to purchase more factories.

Most of the game logic for them is in `store/modules/factories.ts`. The logic for displaying them is in `FactoryWidget.vue`. The balance data for factories is in `data/factories.data.ts`. Related types are in `interfaces/FactoryTypes.ts`

Factories also obtain a speed upgrade whenever they reach specific thresholds of amount of factories owned.

### Managers

Managers are "characters" that can be bought to manage factories. The code to manage them is in `store/modules/factories.ts` (because they're part of the factories). The screen to view and purchase them is accessible via a button in the bottom bar and uses the `ManagersModal` component. Their balance data is stored inside each factory, since there is one manager per factory. Related types are in `interfaces/ManagerTypes.ts`

The bottom bar will update a notification badge whenever new managers can be bought

### Saving and loading

Loading and saving is done using the localStorage API. Each module of the store has a function to generate a save object/load it, and `App.vue` takes care of calling those to generate the overall game save, and load it when the game starts.

The types for save data are in `interfaces/SaveTypes.ts`. What gets stored in localStorage is a stringified version of `IGameSave`.

The game is saved at the end of every main loop tick, to make sure no data is lost if the user suddenly quits the tab

### Upgrades

Upgrades are improvements for the player that can be bought. They are built to be extendable with the possibility of upgrades having various effects, but at the moment the only effect implemented is `multiply-revenue`, which allows an upgrade to multiply the revenue of a specific factory by a certain amount, or of all factories at once.

The code to manage them is in `store/modules/upgrades.ts`, which handles purchasing them and applying their effect to factories. Related types are in `interfaces/UpgradeTypes.ts`, and balance data for them is in `data/upgrades.data.ts`. Upgrades are displayed and purchased in the game via the `UpgradesModal` screen.

### Notifications

Notifications can appear to inform the player of something that happened. At the moment this feature is used to notify the player that a factory has received a speed upgrade

They are managed by `store/modules/notifications.ts`, and displayed in the game by the `NotificationToast` component.

### Modals

Modals are used to make popups appear on top of the game. They are used by the manager and upgrade screens. Modals are managed in the syate by `store/modules/Modals.ts` and their display is done using `ModalContainer.vue`.

To display them, the vue.js `component` tag is used. This allows us to dynamically display a component based on a variable and pass any properties to it, so game code can choose to display a modal of any component and pass arbitrary props:

```
ModalsStore.mutations.addModal({
    name: 'managers-modal',
    title: 'Managers',
    options: {},
});
```

### Offline earnings summary

If the player comes back to the game after more than 5 minutes, a modal will appear giving a summary of money earned during that time. `App.vue` takes care of calculating that in `handleReturnFromOffline`, and the `OfflineSummaryModal` is the component that displays the info.

## Problems and concerns

* The vuex store updates every 50ms with factory production. While this doesn't cause any issues, it makes devtools hard to use as vuex is being spammed with mutations. Ideally this should be modified so that the money displayed and the real-time progress in the game can be updated without having to actually mutate the state every time, similarly to what the timer does.
* Sometimes timers for factories will show a glitched number before the end.
* The Bulma columns aren't very good at not overflowing from the screen when their content is too big. I've tweaked the CSS to make sure everything fits on a mobile screen, but ideally the game should handle that better in the first place.