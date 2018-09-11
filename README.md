# UI for ChainerRL
You can anaylize learned ChainerRL agent's behavior in well visuzlized way, making debug easier.

# Usage
Just pass `agent` and `env` object to `chainerrlui.launch_visuzlizer` function.
```python
from chainerrlui import launch_visualizer

# Prepare agent and env object here
#

# Prepare dictionary which explains meanings of each action
ACTION_MEANINGS = {
  0: 'hoge',
  1: 'fuga',
  ...
}

launch_visualizer(agent, env, action_meanings=ACTION_MEANINGS)

```
- `agent` object must be instance of Agent class provided by ChainerRL, which extends `chainerrl.agent.Agent` class.
- `env` object must implement three gym-like methods below.
  - `reset`: Reset the environment to initial state.
  - `step` : Take `numpy.ndarray` action as argument, and proceed enviroment one step.
  - `render` : Return 3D `numpy.ndarray` which represents RGB image describing env state.
