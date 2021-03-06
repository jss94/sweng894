# Build Status

Master: [![Build Status](https://travis-ci.com/jss94/sweng894.svg?branch=master)](https://travis-ci.com/jss94/sweng894)

# Install the following software:
* Git: https://git-scm.com/
* Node.js 10.15+ https://nodejs.org/en/
* Visual Studio Code: https://code.visualstudio.com/
* Visual Studio Community: https://visualstudio.microsoft.com/vs/community/
    - NOTE: If you already have this installed make sure you have all the updates installed as well.
    - You do not need to install any packages now. However, when prompt to install missing packages later, click OK.
* ASP.Net Core 2.2 SDK: https://dotnet.microsoft.com/download
* MySQL Workbench: https://dev.mysql.com/downloads/workbench/

# Once you have everything installed clone the GitHub Repo:
1. Create a folder and name it whatever you want. I named my folder “psu”.
2. Go to the command prompt and navigate to your new directory.
3. When in your new directory type
```
    git clone https://github.com/jss94/sweng894.git
```

# Open the solution and build the project:
1. Navigate and open ./psu/sweng894/source/source.sln in your file browser.
2. After Visual Studio Community opens, in the top menu bar, click build>rebuild
3. Click "start" on the top nav bar to start your project.
4. Wait until a browser automatically opens and displays the webpage. 
    - NOTE: This might take awhile the first time as it is downloading all the dependencies.

# Modifying the frontend project:
1. Open Visual Studio Code and open the following folder ./psu/sweng894/source/clientapp
2. You will find all the pages/components in the ./src/app folder. Here are a few things to note:
    - Each page and all its related files are placed together in the same folder. For example the google-map folder contains all the related HTML, CSS and TS files needed to create the page. 
    - When additional Angular services and models are needed they are placed under the same folder. See get-users folder.
    - You can modify the frontend without having to rebuild and run the project, just saving the file will cause the website to reload your changes.

# Connecting to the Database:
Before you can use MySQL Workbench to connect to the db on Google Cloud you mush start, and keep, the proxy server running.
1. Start the Google Cloud Proxy Server
    - For Window users click on ./psu/sweng894/source/start-proxy.bat
    - For Mac users click on ./psu/sweng894/source/start-proxy.bash
2. Database connection properties can be found in ./psu/sweng894/source/appsettings.json

# Developer work flow
1. Pick a story to work on. 
2. Create a feature branch from the latest master branch
3. Update your feature branch with your code.
4. When done, make sure you get the latest code from master and fix any merge conflicts.
5. Create a pull request for your feature branch using the GitHub site.
6. Ask another developer to review your pull request.
7. Once approved, go to GitHub and merge your pull request.
8. Close out your story in the project managment software.

# Adding a feature branch to the project

### Create your own branch to work from:
1. In the command prompt go to ./psu/sweng894
2. Type the following to create a new branch:
```
    git branch your-name/feature-name
```
3. Type the following to go to the branch you just created:
```
    git checkout your-name/feature-name
```
4. You can now modify the code as much as you’d like without changing master

### Updating your branch with the latest from the master branch:
1. In the command prompt go to ./psu/sweng894
2. Make sure you are on your feature branch. If you are not then type.
```
    git checkout your-name/feature-name
```
3. Type the following to update your branch with the latest code from master
```
    git pull origin master
```
-  This tells git to go to the location aliased by “origin” (i.e. https://github.com/jss94/sweng894.git) and get the code from the branch called “master”.
4. Resolve frontend and backend merge conflicts in their respective IDEs.

### Updating your feature branch on origin; i.e. https://github.com/jss94/sweng894.git:
1. In the command prompt go to ./psu/sweng894
2. Make sure you are on your feature branch. If you are not then type.
```
    git checkout your-name/feature-name
```
3. Type the following to stage all your files for commitment:
```
    git add .
```
4. Type the following to commit your files to the feature branch in the local repository:
```
    git commit -m ‘your commit message here’
```
5. Type the following to update the feature branch at the origin or remote repository. 
```
    git push
```

# Using Swagger
Swagger is a tool that Swagger allows APIs to describe their own structure. It provides interactive documentation. Our swagger UI can be found at https://localhost:5001/swagger. It is set up to read the basic information from each API, and will read API descriptions if the native Visual Studio commenting structure is used. The commenting structure can be created by typing /// above your methods. 
Ex.
```
        /// <summary>
        /// Gets a vendor by the vendor id
        /// </summary>
        /// <param name="id">Vendor id</param>
        /// <returns>Vendor</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            ...
        }
 ```
Swagger is interactive, so you can test your APIs from the UI.
