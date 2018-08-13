from setuptools import setup, find_packages

with open("requirements.txt") as f:
    dependencies = f.read().splitlines()

setup(name="chainerrl-ui",
      version="0.1",
      packages=find_packages(exclude=("tests", "docs")),
      install_requires=dependencies,
      author="sykwer",
      author_email="sykwer@gmail.com",
      description="UI tool for chainerrl",
      entry_points={
          "console_scripts": [
              "chainerrlui=chainerrlui.app:main"
          ]
      })
