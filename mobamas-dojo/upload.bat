REM @ECHO OFF
%~d0
PUSHD %~dp0

python main.py
git 

POPD
PAUSE
