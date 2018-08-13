import argparse
import os

import matplotlib
import matplotlib.pyplot as plt

import gym

gym.undo_logger_setup()  # NOQA
from chainer import functions as F
from chainer import links as L
from chainer import optimizers
import numpy as np

import chainerrl
from chainerrl.action_value import DiscreteActionValue
from chainerrl import agents
from chainerrl import experiments
from chainerrl import explorers
from chainerrl import links
from chainerrl import misc
from chainerrl.q_functions import DuelingDQN
from chainerrl import replay_buffer


def rollout():
    pass


def score_frame():
    pass


def gen_saliency_map():
    pass


def main():
    env_name = "Breakout-v0"
    save_dir = "figures/"

    env = gym.make(env_name)
    env.seed(1)

    model = links.Sequence(
        links.NIPSDQNHead(activation=F.relu),
        L.Linear(256, env.action_space.n),
        DiscreteActionValue)

    # Run agent and get history
    #
    # history = rollout(...)
    #

    # Show frame of specified idx of history
    #
    # plt.imshow(...)
    #

    # By perturbation to specified frame, get score map which means where agent pays attention to
    #
    # actor_score_map = score_frame(...)
    # critic_score_map = score_frame(...)
    #

    # Generate saliency map from actor_score_map and critic_score_map
    #
    # frame = gen_saliency_map(...)
    #

    # Show frame of saliency map
    #
    # plt.imshow(...)
    #


if __name__ == "__main__":
    main()
