# UI for ChainerRL
You can anaylize learned ChainerRL agent's behavior in well visualized way, making debug easier.

#### NOTICE
This library is under development and all modules in chainerrl are not supported yet.
Supported and unsupported modules are listed below.
- ActionValue
  - `DiscreteActionValue` : supported
  - `DistributionalDiscreteActionValue` : supported
  - `QuadraticActionValue` : unsupported
  - `SingleActionValue` : unsupported
- Distribution
  - `SoftmaxDistribution` : supported
  - `MellowmaxDistribution` : unsupported
  - `GaussianDistribution` : supported
  - `ContinuousDeterministicDistribution` : unsupported
  
#### Bug workaround for MacOS
If you use MacOS, you may encounter a crash message below when sending `rollout` or `saliency` command from UI.
```
objc[42564]: +[__NSCFConstantString initialize] may have been in progress in another thread when fork() was called. We cannot safely call it or ignore it in the fork() child process. Crashing instead. Set a breakpoint on objc_initializeAfterForkError to debug.
```
This behavior is due to a change in high Sierra. If you would like to know detail, see [here](https://bugs.python.org/issue33725).
Workaround is to set environment variable `OBJC_DISABLE_INITIALIZE_FORK_SAFETY` to `YES` prior to executing python.
```
$ export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES
```

## Installation
To install UI for ChainerRL from source.

```sh
$ git clone https://github.com/pfnet/i18-sykwer.git
$ cd i18-sykwer/frontend
$ npm install && npm run build && cd ..
$ pip install -e .
```

## Usage
Just pass `agent` and `env` object to `chainerrl_visualizer.launch_visualizer` function.
```python
from chainerrl_visualizer import launch_visualizer

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
- `agent` object must be instance of [Agent class provided by ChainerRL](https://github.com/chainer/chainerrl/tree/master/chainerrl/agents), which extends `chainerrl.agent.Agent` class.
- `env` object must implement three gym-like methods below.
  - `reset`: Reset the environment to initial state.
  - `step` : Take `numpy.ndarray` action as argument, and proceed enviroment one step.
  - `render` : Return 3D `numpy.ndarray` which represents RGB image describing env state.

## Env object interface
### reset
Reset the environment state and returns initial array-like observation object.
```
Returns:
  - observation (array-like object): agent's observation of the current environment
```

### step
Run the timestep of environment's dynamics.
```
Args:
  - action (numpy.ndarray): ndarray representing next action to take

Returns:
  - observation (array-like object): agent's observation of the current environment
  - reward (float): amount of reward returned after args action taken
  - done (boolean): whether the episode has ended or not
  - info (dict): contains various information helpful for debugging
```

### render
Returns 3d numpy.ndarray which represents RGB image of current environment appearance.
```
Returns:
  - image (3d numpy.ndarray): RGB image of current environment appearance.
```

## Quick start
Follow instructions of each example.
- [CategoricalDQN at seaquest](examples/categorical_dqn_seaquest)
- [A3C at breakout](examples/a3c_breakout)
- [PPO at bipedalwalker-v2](examples/ppo_bipedalwalker_v2)
