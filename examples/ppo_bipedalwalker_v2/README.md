# How to run example
In this example, you need to install `box2d`. [For some reason](https://github.com/openai/gym/issues/100#issuecomment-260095406), you have to install box2d from source.
```
# Install swig in proper way to your OS.
$ brew install swig

# Install box2d from source.
$ git clone https://github.com/pybox2d/pybox2d
$ cd pybox2d
$ python setup.py clean
$ python setup.py build
$ python setup.py install
$ cd ../ && rm -Rf pybox2d
```

Run example
```
$ cd examples/ppo_bipedalwalker_v2
$ python main.py
```
