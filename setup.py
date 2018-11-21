from setuptools.command.sdist import sdist
from setuptools import setup, find_packages
import subprocess

with open("requirements.txt") as f:
    dependencies = f.read().splitlines()


class chainerrlui_sdist(sdist):
    def run(self):
        subprocess.check_call('cd frontend && npm run build', shell=True)
        sdist.run(self)


setup(
    name="chainerrlui",
    version="0.1",
    packages=find_packages(exclude=("tests", "docs")),
    install_requires=dependencies,
    include_package_data=True,
    package_data={
        "chainerrlui": {
            "templates/*",
            "static/**/*",
        }
    },
    author="sykwer",
    author_email="sykwer@gmail.com",
    description="UI tool for chainerrl",
    cmdclass={
        'sdist': chainerrlui_sdist
    },
)
