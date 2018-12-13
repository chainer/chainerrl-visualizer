from setuptools.command.sdist import sdist
from setuptools import setup, find_packages
import subprocess

with open('requirements.txt') as f:
    dependencies = f.read().splitlines()


class chainerrl_visualizer_sdist(sdist):
    def run(self):
        subprocess.check_call('cd frontend && npm run build', shell=True)
        sdist.run(self)


setup(
    name='chainerrl_visualizer',
    version='0.1.0',
    packages=find_packages(exclude=('tests', 'docs')),
    install_requires=dependencies,
    include_package_data=True,
    package_data={
        'chainerrl_visualizer': {
            'templates/*',
            'static/**/*',
        }
    },
    author='sykwer',
    author_email='sykwer@gmail.com',
    description='Visualizer for ChainerRL',
    cmdclass={
        'sdist': chainerrl_visualizer_sdist
    },
)
