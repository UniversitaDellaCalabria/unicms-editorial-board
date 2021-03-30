# unicms-editorial-board

### Use as is in production

```
pip install unicms-editorial-board
./manage.py collectstatic
```

### Development

Install node.js and npm

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

Install packages
```
cd /unicms-editorial-board/src/unicms_editorial_board/unicms_editorial_board_vue
npm install
```

Edit files and build
```
npm run build
```

