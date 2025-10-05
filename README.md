<div align="center">
  <img align="center" width="128px" src="./crates/tablix-tauri/icons/icon.png" />
	<h1 align="center"><b>Tablix</b></h1>
	<p align="center">
		Database management tool
  </p>
</div>

<img align="center" src="./assets/welcome.png" alt="Welcome Page Screenshot" />

## Development
### Prerequisites

This is a Tauri app, which uses Rust for the backend and Javascript for the frontend. So let's make sure you have all the prerequisites installed.

1. Tauri Dev Deps

Follow the official guide here: https://tauri.app/start/prerequisites/#system-dependencies

2. Rust

You can use the following `rustup` quick install script to get all the necessary tools.

```bash
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

3. Node

Next, ensure you've got at least Node 22 installed. You can download it from the official Node.js website.
(https://nodejs.org/en/download)

4. pnpm

Finally, we use `pnpm` as our package manager. You can leverage `corepack`, which comes shipped with `node`, to install and use the `pnpm` version we defined in our `package.json`.

```bash
$ cd tablix
$ corepack enable
```

### Install dependencies

Next, install the app dependencies.

```bash
$ pnpm install 
```

You'll have to re-run this occasionally when our deps change.

### Run the app

Now you should be able to run the app in development mode:

```bash
$ pnpm tauri dev
```
