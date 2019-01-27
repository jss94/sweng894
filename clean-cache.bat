Echo Cleaning Project For Git


rd /s /q UnitTests\obj

rd /s /q UnitTests\bin

rd /s /q IntegrationTests\obj

rd /s /q IntegrationTests\bin

git rm -r ./UnitTests/obj


git rm -r ./UnitTests/bin


git rm -r ./IntegrationTests/obj


git rm -r ./IntegrationTests/bin



git add ./UnitTests/.gitignore


git add ./IntegrationTests/.gitignore



git commit -m 'save'

PAUSE