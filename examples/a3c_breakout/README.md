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

In this example, you need to install `gym[atari]` , `opencv-python` .
```
$ pip install gym[atari] opencv-python
```

Run example
```
$ cd examples/a3c_breakout
$ python main.py
```
