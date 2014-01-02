%~d0
PUSHD %~dp0

git config credential.helper store
git pull
python main.py
git add .
git commit -m "mobamas-dojo auto update"
git push

POPD
