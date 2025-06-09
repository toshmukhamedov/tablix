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

First of all, this is a Tauri app, which uses Rust for the backend and Javascript for the frontend. So let's make sure you have all the prerequisites installed.

1. Tauri Dev Deps (https://tauri.app/start/prerequisites/#system-dependencies)

On Mac OS, ensure you've installed XCode and `cmake`. On Linux, if you're on Debian or one of its derivatives like Ubuntu, you can use the following command.

<details>
<summary>Linux Tauri dependencies</summary>

```bash
$ sudo apt update
$ sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  cmake
```

</details>

2. Rust

For both Mac OS and Linux, you can use the following `rustup` quick install script to get all the necessary tools.

```bash
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

3. Node

Next, ensure you've got at least Node 20 installed. If you're on Mac OS or Linux and you're missing `node`, you can use your favorite package manager like `brew` or `apt`.

Alternatively, you can use the following Node installer from Vercel to get the latest version.

```bash
$ curl https://install-node.vercel.app/latest > install_node.sh
$ sudo ./install_node.sh
```

4. pnpm

Finally, we use `pnpm` as our javascript package manager. You can leverage `corepack`, which comes shipped with `node`, to install and use the `pnpm` version we defined in our `package.json`.

```bash
$ cd tablix
$ corepack enable
```

### Install dependencies

Next, install the app dependencies.

```bash
$ pnpm install # This should now ask you to confirm the download, installation, and use of pnpm via corepack
```

You'll have to re-run this occasionally when our deps change.

### Run the app

Now you should be able to run the app in development mode:

```bash
$ pnpm tauri dev
```
