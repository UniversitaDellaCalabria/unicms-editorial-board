# node.js and npm install

Purge old installation
```
sudo rm -rf /usr/local/bin/npm /usr/local/share/man/man1/node* ~/.npm
sudo rm -rf /usr/local/lib/node*
sudo rm -rf /usr/local/bin/node*
sudo rm -rf /usr/local/include/node*

sudo apt-get purge nodejs npm
sudo apt autoremove
```

Download the latest tar.xz NodeJS file from https://nodejs.org/en/download/
```
tar -xf node-v#.#.#-linux-x64.tar.xz
sudo mv node-v#.#.#-linux-x64/bin/* /usr/local/bin/
sudo mv node-v#.#.#-linux-x64/lib/node_modules/ /usr/local/lib/
Where #.#.# is the version you downloaded.
```

Verify installation using
```
node -v
npm -v
```

# unicms-editorial-board

```
pip install unicms-editorial-board
python3 manage.py install_board
```


