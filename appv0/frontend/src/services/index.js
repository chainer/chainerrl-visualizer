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

export const postRollout = (experimentId, envName, agentClass, seed) => (
  axios.post(`http://localhost:5001/api/experiments/${experimentId}/rollouts`, {
    env_name: envName,
    agent_class: agentClass,
    seed,
  }).then((res) => res.data.rollout_dir)
);

export const getRolloutLog = (logPath) => (
  axios.get(`http://localhost:5001/api/rollout_logs?path=${logPath}`).then(
    (res) => res.data.log
  )
);

export const postSaliency = (experimentId, fromStep, toStep, seed) => (
  axios.post(`http://localhost:5001/api/experiments/${experimentId}/saliency`, {
    from_step: fromStep,
    to_step: toStep,
    seed,
  }).then((res) => res.data.image_paths)
);
