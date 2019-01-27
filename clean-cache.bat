Echo Cleaning Project For Git
git rm -r UnitTests/obj
git rm -r UnitTests/bin
git rm -r IntegrationTests/obj
git rm -r IntegrationTests/bin

git add UnitTests/.gitignore
git add IntegrationTests/.gitignore

git commit -m 'save'