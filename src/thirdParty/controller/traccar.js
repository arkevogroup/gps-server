import axios from 'axios';
import qs from 'qs';

// @desc Performs creation of a session with traccar server and return sessionId(token)
// @function register_Device or delete_Device
// @Call function
const createSession = async () => {
  try {
    let data = qs.stringify({
      'email': 'it.department@arkevo-group.com',
      'password': 'Sr@ra@Q^7*SDFGd\\.'
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://79.106.73.251:8082/api/session',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      data : data
    };
    const response = await axios.request(config);
    const setCookieHeader = response.headers['set-cookie'][0];
    const cookie = setCookieHeader.split(';')[0];
    return cookie;
  } catch (error) {
    throw new Error('Failed to create session: ' + error.response.data);
  }
};

// @desc Performs deleting of a session with traccar server and return sessionId(token)
// @function register_Device or delete_Device
// @Call function
const deleteSession = async (sessionId) => {
  try {
    let data = qs.stringify({
      'email': 'it.department@arkevo-group.com',
      'password': 'Sr@ra@Q^7*SDFGd\\.' 
    });

    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: 'http://79.106.73.251:8082/api/session',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Cookie': sessionId
      },
      data : data
    };

    const response = await axios.request(config);
    return response.data;

  } catch (error) {
    throw new Error('Failed to delete session: ' + error.message);
  }
};

// @desc Perform asynchronous operations to post data to Traccar server
// @route POST /api/gps/store
// @access from session cookie
const register_Device = async (dev_name, imei) => {
    try {
      const sessionData = await createSession();
      //console.log('Session data:', sessionData);
      let data = JSON.stringify({
        "name": dev_name,
        "uniqueId": imei.toString()
      });
  
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://79.106.73.251:8082/api/devices',
        headers: { 
          'Content-Type': 'application/json', 
          'Cookie': sessionData
        },
        data : data
      };
      const response = await axios.request(config);
      //console.log('Device registered:', response.data);
      const deletedSession = await deleteSession(sessionData);
     // console.log('Session deleted:', deletedSession);
      return response.data;
    } catch (error) {
        throw new Error('Failed to register device: ' + error.response.data);
    }
  };

  const delete_Device = async (id) => {
    try {
      const sessionData = await createSession();
      console.log('Session data:', sessionData);
      let data = JSON.stringify({
        "name": dev_name,
        "uniqueId": imei.toString()
      });
  
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://79.106.73.251:8082/api/devices',
        headers: { 
          'Content-Type': 'application/json', 
          'Cookie': sessionData
        },
        data : data
      };
      const response = await axios.request(config);
      console.log('Device registered:', response.data);
      const deletedSession = await deleteSession(sessionData);
      console.log('Session deleted:', deletedSession);
      return response.data;
    } catch (error) {
        throw new Error('Failed to register device: ' + error.response.data);
    }
  };

export {register_Device,delete_Device};