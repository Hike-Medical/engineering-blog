# Hike Labs: Monorepo with Pnpm Workspaces Example

The monorepo for applications and shared packages.

## Installation

### Prerequisites

1. **Node, version20** - recommend using [`nvm`](https://github.com/nvm-sh/nvm) to manage multiple versions of Node
2. **[`pnpm`](https://pnpm.io), version 8** - recommend using [Corepack](https://pnpm.io/installation#using-corepack) to install it
3. Ensure you have the `.env` files for the applications

### All Other Dependencies

1. From the root directory, run `pnpm install`

## Run

1. From the root directory, run `pnpm dev`

## Notes

1. The monorepo uses _pnpm workspaces_ to manage apps and packages. The root scripts are convenience commands that run sub-package commands. To run a command for a specific package, use the `pnpm --filter` command and the name of the package, such as: `pnpm --filter '@basem/portfolio-web' build`
2. `Concurrently` used from the root `package.json` for segregating parallel commands to the console in a human-readable way.
