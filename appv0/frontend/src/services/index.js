import axios from 'axios';

export const getProjectsList = () => (
  axios.get('api/projects').then(
    (res) => res.data.projects
  )
);

export const getExperimentsList = (projectId) => (
  axios.get(`http://localhost:5001/api/projects/${projectId}/experiments`).then(
    (res) => res.data.experiments
  )
);

export const getExperiment = (projectId, experimentId) => (
  axios.get(`http://localhost:5001/api/projects/${projectId}/experiments/${experimentId}`).then(
    (res) => res.data
  )
);

export const postRollout = (experimentId, agentPath, envPath) => (
  axios.post(`http://localhost:5001/api/experiments/${experimentId}/rollouts`, {
    agent_path: agentPath,
    env_path: envPath,
  }).then((res) => res.data.rollout_dir)
);

export const getRolloutLog = (logPath) => (
  axios.get(`http://localhost:5001/api/projects/1/experiments/1?result_path=${logPath}`).then(
    (res) => res.data.log
  )
);
