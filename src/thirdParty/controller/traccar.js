import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';

dotenv.config();

class TraccarApi {
  constructor() {
    this.baseUrl = 'http://79.106.73.251:8082/api';
  }

  async createSession() {
    try {
      let data = qs.stringify({
        'email': 'it.department@arkevo-group.com',
        'password': 'Sr@ra@Q^7*SDFGd\\.'
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this.baseUrl}/session`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data
      };

      const response = await axios.request(config);
      const setCookieHeader = response.headers['set-cookie'][0];
      return setCookieHeader.split(';')[0];
    } catch (error) {
      throw new Error('Failed to create session: ' + error.response.data);
    }
  }

  async deleteSession(sessionId) {
    try {
      let data = qs.stringify({
        'email': 'it.department@arkevo-group.com',
        'password': 'Sr@ra@Q^7*SDFGd\\.'
      });

      let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${this.baseUrl}/session`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': sessionId
        },
        data: data
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete session: ' + error.message);
    }
  }

  async registerDevice(devName, imei) {
    try {
      const sessionData = await this.createSession();
      let data = JSON.stringify({
        "name": devName,
        "uniqueId": imei.toString()
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this.baseUrl}/devices`,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': sessionData
        },
        data: data
      };

      const response = await axios.request(config);
      await this.deleteSession(sessionData); //clear session
      return response.data;
    } catch (error) {
      throw new Error('Failed to register device: ' + error);
    }
  }

  async deleteDevice(id) {
    try {
      const sessionData = await this.createSession(); //Create session with traccar
      let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${this.baseUrl}/devices/${id}`,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': sessionData
        },
        //data: data
      };

      const response = await axios.request(config);
      await this.deleteSession(sessionData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete device: ' + error.response.data);
    }
  }
}

export default TraccarApi;
//new TraccarApi().deleteDevice(95);