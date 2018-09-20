# How to run example
Clone the repo and change directory to the project.
```
$ git clone https://github.com/pfn-intern/i18-sykwer.git
$ cd i18-sykwer
```

Prepare environment (such as venv) for running example.
```
$ python -m venv venv
$ source venv/bin/activate
```

Install packages in development mode.
```
$ python setup.py develop
```

In this example, you need to install `box2d`. For some reason, you have to install box2d from source.
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
