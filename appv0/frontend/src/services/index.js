import axios from 'axios';

/* eslint-disable import/prefer-default-export */

export const postRollout = (resultPath, modelName, seed) => (
  axios.post('http://localhost:5001/api/projects/1/experiments/1', {
    result_path: resultPath,
    model_name: modelName,
    seed,
  }).then((res) => res.data)
);
