# Geoguessr Archipelago World

## Requirements

- Python 3.13.11

I advise using `direnv`. To do that install `pyenv` and `direnv`. 

Set in `.envrc` this line
```
layout pyenv 3.13.11
```

Then run 
```
direnv allow
```

If it went correctly, doing `which python` in the folder where `.direnv` is should return:
```
>>> which python
<your-path>/geoguessr-archipelago/world/.direnv/python-3.13.11/bin/python
```