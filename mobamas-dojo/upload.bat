REM @ECHO OFF
%~d0
PUSHD %~dp0

git pull
python main.py
git add .
git commit -m "mobamas-dojo auto update"
git push

POPD
PAUSE