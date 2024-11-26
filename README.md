# Frontend webpage (CAEN HV Manager) 

Frontend webpage source repository

## Description

This project is a React-based frontend web application designed to manipulate and monitor CAEN High Voltage (HV) device. 
The application provides a user-friendly interface for users to interact with the CMD-3 CAEN HV device, allowing for real-time monitoring and control.

Builded version of the frontend is a part of the python module [`caen_tools`](https://git.inp.nsk.su/cmd3/caendc/tools).

## Development

### Prerequesties

Need to install `npm` package manager.

### Getting Started

To get started with the project development, follow these steps:

1. Clone the repository:
```bash
git clone git@git.inp.nsk.su:cmd3/caendc/frontend.git
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
export REACT_APP_CAEN=development && npm run start
```
4. Open your browser: navigate to http://localhost:3000 to view the application. 

The page will reload when you make changes.
You may also see any lint errors in the console.

**Note**: it's only frontend.
So if you want to have full interaction with backend, you need to run backend API (from `caen_tools` or something else) and provide that path in [config file](src/config.js) (development section)


### Build package

`caen_tools` uses builded version of frontend webpage

```bash
export REACT_APP_CAEN=production && npm run build
```
(`REACT_APP_CAEN` points out to config section that is used during `npm run`)

Builded version of the frontend will be stored in the folder *./build*

### Development process
Once you have made the necessary changes to the project and verified its build, you can commit and push it to git. 

Add a tag to the commit and gitlab will automatically build the project.

```bash
git add <...>
git commit -m <Your commit message>
git tag -a <tagname like vX.X.X-devX>
git push origin <branchname> --follow-tags
```
If successful, a new [release](https://git.inp.nsk.su/cmd3/caendc/frontend/-/releases) will be automatically created.
You can pull this frontend edition into [`caen_tools`](https://git.inp.nsk.su/cmd3/caendc/tools) by modifying its *.gitlab-ci.yml*