%~d0
PUSHD %~dp0

git pull
python main.py
git add .
git commit -m "mobamas-dojo"
git push

POPD
PAUSE