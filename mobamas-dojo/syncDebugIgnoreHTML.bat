@ECHO OFF
%~d0
PUSHD %~dp0

CALL compile.bat debug

robocopy . Z:\htdocs\mobamas-dojo * /MIR /XD .git .sass-cache /XF .gitattributes .gitignore compiler.jar template.html *.bat *.py /XA:SH

POPD
