import axios from 'axios';

/* eslint-disable import/prefer-default-export */

export const postRollout = () => (
  axios.post('http://localhost:5002/rollouts').then((res) => ({
    rolloutPath: res.data.rollout_path,
    isRolloutStarted: res.data.is_rollout_started,
  }))
);
