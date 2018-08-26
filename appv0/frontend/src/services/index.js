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

export const postRollout = (resultPath, modelName, seed) => (
  axios.post('http://localhost:5001/api/projects/1/experiments/1', {
    result_path: resultPath,
    model_name: modelName,
    seed,
  }).then((res) => res.data.info.result_path)
);

export const getRolloutLog = (logPath) => (
  axios.get(`http://localhost:5001/api/projects/1/experiments/1?result_path=${logPath}`).then(
    (res) => res.data.log
  )
);
