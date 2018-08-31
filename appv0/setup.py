from setuptools import setup, find_packages

with open("requirements.txt") as f:
    dependencies = f.read().splitlines()

setup(name="chainerrlui",
      version="0.1",
      packages=find_packages(exclude=("tests", "docs")),
      install_requires=dependencies,
      package_data={
          "chainerrlui": {
              "templates/*",
              "static/**/*",
          }
      },
      author="sykwer",
      author_email="sykwer@gmail.com",
      description="UI tool for chainerrl",
      entry_points={
          "console_scripts": [
              "chainerrlui=chainerrlui.main:main"
          ]
      })
