%~d0
PUSHD %~dp0

PUSHD js
java -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js storage.js --js config.js --js mobamas-dojo.js --js init.js --js_output_file mobamas-dojo-min.js
POPD

PUSHD css
call sass --style compressed mobamas-dojo.scss:mobamas-dojo-min.css
POPD

POPD

PAUSE
