console.log(`
Available npm scripts:

Deployment Scripts:
  - npm run deploy:math              Deploys math library
  - npm run deploy:bytes             Deploys byte library
  - npm run deploy:logic-op          Deploys logic op library
  - npm run deploy:ztp20 <arg>       Deploys ZTP20 (arg: core, permit, pausable, burnable, capped)
  - npm run deploy:ztp721 <arg>      Deploys ZTP721 (arg: core, pausable, burnable, enumerable)
  - npm run deploy:ztp1155 <arg>     Deploys ZTP1155 (arg: core, pausable, burnable, supply, uri)

Upgrade Scripts:
  - npm run upgrade:ztp20 <arg>      Upgrades ZTP20 (arg: core, permit, pausable, burnable, capped)
  - npm run upgrade:ztp721 <arg>     Upgrades ZTP721 (arg: core, pausable, burnable, enumerable)
  - npm run upgrade:ztp1155 <arg>    Upgrades ZTP1155 (arg: core, pausable, burnable, supply, uri)

Run 'npm run <script>' to execute a command.
`);