@ECHO OFF
%~d0
PUSHD %~dp0

python main.py --debug
CALL compile.bat

POPD
