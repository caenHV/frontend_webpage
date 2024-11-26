


# Frontend webpage (CAEN HV Manager) 


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
```bash
export REACT_APP_CAEN=development && npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

```bash
export REACT_APP_CAEN=production && npm run build
```

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Config
Some parameters of the webpage can be configured with `src/config.js` file

## Release process
1. Create tag in form `vX.X` of the specific commit
    ```bash
    git tag -a vX.X
    ```
1. Push the tag on github
    ```bash
    git push origin --tags
    ```
1. Github action will be launched automatically
1. Ensure that the action successfuly finished and download artifact
1. Prepare new release. Attach `build.zip` file from unzipped artifact.