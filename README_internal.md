<img align="right" width="250" height="47" src="./media/Gematik_Logo_Flag.png"/> <br/>

# Internal Readme portal-core

### NPM Configuration

The Project requires access to the Nexus Private NPM registry from gematik, therefore the `npm` CLI tool should be configured accordingly:

```sh
# Login to private registry with username/password
npm login --registry=https://nexus.prod.ccs.gematik.solutions/repository/allNpmRepos/
# Set npm standard registry
npm config set registry https://nexus.prod.ccs.gematik.solutions/repository/allNpmRepos/
```
