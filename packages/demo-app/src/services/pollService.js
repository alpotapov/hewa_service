/* eslint-disable no-unused-vars */
import axios from 'axios';
import * as Sentry from '@sentry/react';
import { v4 as uuidv4 } from 'uuid';

const polls = [];

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const getPolls = async () => polls;

const getPoll = async (uuid) => polls.find((poll) => poll.uuid === uuid);

const createPoll = async (poll) => {
  // try {
  //   const response = await axios.post(`${SERVER_URL}/api/v2/questionnaire`, poll);
  //   return response.data;
  // } catch (error) {
  //   Sentry.captureException(error);
  //   throw error;
  // }
  const created = {
    ...poll,
    uuid: uuidv4(),
  };
  polls.push(created);

  return created;
};

export default {
  createPoll,
  getPolls,
  getPoll,
};
