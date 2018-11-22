import pytest

from chainerrlui import launch_visualizer

def test_launch_visualizer():
    assert callable(launch_visualizer)
